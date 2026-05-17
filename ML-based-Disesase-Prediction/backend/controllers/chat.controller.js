import axios from "axios";
import Chat from "../models/Chat.js";
import DoctorReview from "../models/DoctorReview.js";

/* APIs */
const ML_API = "http://127.0.0.1:8000/predict";
const RAG_API = "http://127.0.0.1:8001/chat";


/* =========================
   SEND MESSAGE
========================= */

export const sendMessage = async (req, res) => {

  try {

    const {
      message,
      chatId
    } = req.body;


    if (!message?.trim()) {

      return res.status(400).json({
        error: "Message required"
      });
    }


    /* =========================
       ML PREDICTION
    ========================= */

    const mlResponse = await axios.post(
      ML_API,
      {
        symptoms: message
      }
    );

    const predictionData = mlResponse.data;


    const diseases =
      predictionData?.results?.map(
        (item) => item.disease
      ) || [];


    /* =========================
       RAG PROMPT
    ========================= */

// const ragPrompt = `
// You are MediRx AI Assistant.

// STRICT RULES:
// - Use ONLY information retrieved from NFI documents.
// - Do NOT use general medical knowledge.
// - Do NOT invent medicines.
// - If information is unavailable in NFI, clearly say so.

// LANGUAGE RULE:
// - Reply in SAME language as user.
// - Gujarati → Gujarati
// - Hindi → Hindi
// - English → English

// GREETING RULE:
// - If user only says hello/hi/hey,
//   reply naturally without medical advice.

// For symptom queries provide STRICTLY:

// 1. Possible Conditions
// 2. Medicines from NFI
// 3. Dosage Information
// 4. Safety Advice
// 5. Doctor Warning

// User Message:
// ${message}

// Predicted Diseases:
// ${diseases.join(", ")}
// `;

const ragPrompt = `
You are MediRx AI Assistant.

IMPORTANT RULES:
- Use predicted diseases as primary diagnosis candidates.
- Do NOT introduce completely unrelated diseases.
- Use medicine information from provided NFI context.
- Keep responses medically realistic and readable.
- Reply in same language as user.
- If user greets only, respond naturally.

USER SYMPTOMS:
${message}

TOP PREDICTED DISEASES:
${diseases.join(", ")}

TASK:
1. Analyze which predicted disease is MOST likely.
2. Briefly mention other possible predicted diseases if relevant.
3. Provide medicines and dosage information from NFI data.
4. Provide precautions, warnings, pregnancy info if available.
5. Keep response structured and professional.

FORMAT:

For EACH predicted disease provide:

Disease Name:
...

Why it matches symptoms:
...

Medicine information from NFI:
- Medicine name
- Dosage
- Safety / Pregnancy / Contraindications

Advice:
...

Warning:
...

IMPORTANT:
- Cover ALL predicted diseases.
- First disease should be MOST likely disease.
- Use only provided disease predictions.
- Keep response readable and well separated.
`;
    /* =========================
       RAG RESPONSE
    ========================= */

    const ragResponse = await axios.post(
      RAG_API,
      {
        message: ragPrompt
      }
    );


    const finalReply =
      ragResponse.data.reply;


    /* =========================
       FIND OR CREATE CHAT
    ========================= */

    let chat;


    if (chatId) {

      chat = await Chat.findById(chatId);
    }


    if (!chat) {

      chat = await Chat.create({

        user: req.user.id,

        title:
          message.substring(0, 40),

        messages: []
      });
    }


    /* =========================
       PUSH USER MESSAGE
    ========================= */

    chat.messages.push({
      role: "user",
      content: message
    });


    /* =========================
       PUSH AI MESSAGE
    ========================= */

    chat.messages.push({

      role: "assistant",

      content: finalReply,

      reviewStatus: "pending",

      doctorNotes: ""
    });


    await chat.save();

      /* =========================
    CREATE DOCTOR REVIEW
  ========================= */

  await DoctorReview.create({

    user: req.user.id,

    chat: chat._id,

    symptoms: message,

    aiResponse: finalReply,

    status: "pending"
  });


    /* =========================
       RESPONSE
    ========================= */

    res.json({

      success: true,

      prediction:
        predictionData.results,

      reply: finalReply,

      chatId: chat._id,

      messages: chat.messages
    });

  } catch (error) {

    console.log(
      "ERROR in sendMessage:",
      error?.response?.data || error.message
    );

    res.status(500).json({
      error: "Failed to generate response"
    });
  }
};



/* =========================
   GET CHAT HISTORY
========================= */

export const getChatHistory = async (
  req,
  res
) => {

  try {

    const chats = await Chat.find({
      user: req.user.id
    }).sort({ updatedAt: -1 });


    const formattedChats = chats.map(
      (chat) => ({

        id: chat._id,

        title: chat.title,

        messages: chat.messages,

        updatedAt: chat.updatedAt
      })
    );


    res.json(formattedChats);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Failed to load history"
    });
  }
};