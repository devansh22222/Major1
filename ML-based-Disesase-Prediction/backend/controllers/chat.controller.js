import Chat from "../models/Chat.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_API_KEY
);

const SYSTEM_PROMPT = `
You are MediRx AI Health Assistant.

Rules:
- Be friendly and supportive
- Explain health information simply
- Suggest common medicines only
- Never claim certainty
- Never replace real doctors
- Keep answers concise and readable
- Use simple formatting
`;



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

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
${SYSTEM_PROMPT}

User Symptoms/Message:
${message}

Respond in this format:

Possible Condition:
...

Suggested Medicines:
- ...
- ...

Advice:
...
`;

    const result = await model.generateContent(prompt);

    const reply = result.response.text();

    /* SAVE CHAT */
    const newChat = await Chat.create({
      user: req.user.id,
      symptoms: message,
      response: {
        answer: reply
      }
    });

    res.json({
      success: true,
      reply,
      chatId: newChat._id
    });

  } catch (error) {
    console.log(error);

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
    })
      .sort({ createdAt: -1 });

    const formattedChats = chats.map((chat) => ({
      id: chat._id,
      message: chat.symptoms,
      reply: chat.response?.answer || "",
      createdAt: chat.createdAt
    }));

    res.json(formattedChats);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Failed to load history"
    });
  }
};