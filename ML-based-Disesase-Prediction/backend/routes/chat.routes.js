import express from "express";
import { getUserChats, sendMessage, getChatHistory } from "../controllers/chat.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Get chat history
router.get("/history", authMiddleware, getChatHistory);

// Send a message to the chatbot
router.post("/send", authMiddleware, sendMessage);

export default router;