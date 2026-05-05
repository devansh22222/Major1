import express from "express";
import { getUserChats } from "../controllers/chat.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/history", authMiddleware, getUserChats);

export default router;