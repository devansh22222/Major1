import express from "express";
import { predictDisease } from "../controllers/prediction.controller.js ";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected route - authMiddleware will verify JWT token and set req.user
router.post("/predict", authMiddleware, predictDisease);

export default router;