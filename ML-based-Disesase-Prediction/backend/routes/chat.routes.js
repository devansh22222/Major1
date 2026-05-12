import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import {
  sendMessage,
  getChatHistory
} from "../controllers/chat.controller.js";

const router = express.Router();

/* SEND MESSAGE */
router.post(
  "/send",
  authMiddleware,
  sendMessage
);

/* GET HISTORY */
router.get(
  "/history",
  authMiddleware,
  getChatHistory
);

export default router;