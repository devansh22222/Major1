import Chat from "../models/Chat.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt for the friendly doctor chatbot
const SYSTEM_PROMPT = `You are a friendly, empathetic, and informative medical assistant. Your role is to:
- Provide general health information and wellness advice
- Explain medical concepts in simple, understandable language
- Suggest when someone should consult a healthcare professional
- Be supportive and compassionate in your responses
- Never diagnose diseases or replace professional medical advice
- Always encourage users to consult with qualified doctors for diagnosis and treatment

Remember: You are NOT a disease prediction tool. You are a friendly health information companion.`;

export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(chats);

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    // Initialize the model - using the most efficient model available
    // Options: "gemini-pro", "gemini-pro-vision"
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // Build the full prompt with system instructions
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${message}`;

    // Send message to Gemini with generation config in the request
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: fullPrompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const botReply = result.response.text();

    // Save chat to database
    const newChat = new Chat({
      user: userId,
      symptoms: message,
      response: {
        answer: botReply,
        timestamp: new Date(),
      },
    });

    await newChat.save();

    // Return response to frontend
    res.json({
      success: true,
      message: message,
      reply: botReply,
      chatId: newChat._id,
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Failed to get response from chatbot",
      details: error.message,
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    const formattedChats = chats.map((chat) => ({
      id: chat._id,
      message: chat.symptoms,
      reply: chat.response.answer,
      timestamp: chat.createdAt,
    }));

    res.json(formattedChats);

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};