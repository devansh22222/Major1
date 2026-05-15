// import Chat from "../models/Chat.js";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(
//   process.env.GOOGLE_API_KEY
// );

// const SYSTEM_PROMPT = `
// You are MediRx AI Health Assistant.

// Rules:
// - Be friendly and supportive
// - Explain health information simply
// - Suggest common medicines only
// - Never claim certainty
// - Never replace real doctors
// - Keep answers concise and readable
// - Use simple formatting
// `;



// /* =========================
//    SEND MESSAGE
// ========================= */

// export const sendMessage = async (req, res) => {
//   try {
//     const { message } = req.body;

//     if (!message?.trim()) {
//       return res.status(400).json({
//         error: "Message required"
//       });
//     }

//     const model = genAI.getGenerativeModel({
//       model: "gemini-2.5-flash"
//     });

//     const prompt = `
//       ${SYSTEM_PROMPT}

//       User Symptoms/Message:
//       ${message}

//       Respond in this format:

//       Possible Condition:
//       ...

//       Suggested Medicines:
//       - ...
//       - ...

//       Advice:
//       ...
//       `;

//     const result = await model.generateContent(prompt);

//     const reply = result.response.text();

//     /* SAVE CHAT */
//     const newChat = await Chat.create({
//       user: req.user.id,
//       symptoms: message,
//       response: {
//         answer: reply
//       }
//     });

//     res.json({
//       success: true,
//       reply,
//       chatId: newChat._id
//     });

//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       error: "Failed to generate response"
//     });
//   }
// };



// /* =========================
//    GET CHAT HISTORY
// ========================= */

// export const getChatHistory = async (req, res) => {
//   try {
//     const chats = await Chat.find({
//       user: req.user.id
//     })
//       .sort({ createdAt: -1 });

//     const formattedChats = chats.map((chat) => ({
//       id: chat._id,
//       message: chat.symptoms,
//       reply: chat.response?.answer || "",
//       createdAt: chat.createdAt
//     }));

//     res.json(formattedChats);

//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       error: "Failed to load history"
//     });
//   }
// };


import axios from "axios";
import Chat from "../models/Chat.js";

/* APIs */
const ML_API = "http://127.0.0.1:8000/predict";
const RAG_API = "http://127.0.0.1:8001/chat";


/* =========================
   SEND MESSAGE
========================= */

export const sendMessage = async (req, res) => {

  try {

    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        error: "Message required"
      });
    }


    /* =========================
       STEP 1 → ML PREDICTION
    ========================= */

    const mlResponse = await axios.post(
      ML_API,
      {
        symptoms: message
      }
    );

    const predictionData = mlResponse.data;


    /* =========================
       EXTRACT DISEASES
    ========================= */

    const diseases =
      predictionData?.results?.map(
        (item) => item.disease
      ) || [];


    /* =========================
       BUILD RAG QUERY
    ========================= */

const ragPrompt = `
You are MediRx AI Assistant.

IMPORTANT:
- Reply in SAME language as user.
- If user writes in Gujarati, reply in Gujarati.
- If user writes in Hindi, reply in Hindi.
- If user writes in English, reply in English.
- Use simple language.
- Use ONLY NFI grounded medical information.

User symptoms:
${message}

Predicted diseases:
${diseases.join(", ")}

Provide:
- possible condition
- medicines from NFI
- dosage/safety info
- simple advice
- warning if needed
`;


    /* =========================
       STEP 2 → NFI RAG
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
       SAVE CHAT
    ========================= */

    const newChat = await Chat.create({

      user: req.user.id,

      symptoms: message,

      response: {
        answer: finalReply,
        prediction: predictionData
      }
    });


    /* =========================
       RESPONSE
    ========================= */

    res.json({

      success: true,

      reply: finalReply,

      prediction: predictionData,

      chatId: newChat._id
    });

  } catch (error) {

    console.log( "ERROR in sendMessage:", error?.response?.data || error.message);

    res.status(500).json({
      error: "Failed to generate response"
    });
  }
};



/* =========================
   GET CHAT HISTORY
========================= */

export const getChatHistory = async (req, res) => {

  try {

    const chats = await Chat.find({
      user: req.user.id
    }).sort({ createdAt: -1 });


    const formattedChats = chats.map(
      (chat) => ({

        id: chat._id,

        message: chat.symptoms,

        reply:
          chat.response?.answer || "",

        prediction:
          chat.response?.prediction || {},

        createdAt: chat.createdAt
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