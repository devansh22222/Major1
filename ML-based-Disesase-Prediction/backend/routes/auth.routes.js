import express from "express";

import {
  register,
  login,
  getMe
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

/* =========================
   AUTH ROUTES
========================= */

/* REGISTER */
router.post(
  "/register",
  register
);

/* LOGIN */
router.post(
  "/login",
  login
);

/* GET USER PROFILE */
router.get(
  "/me",
  authMiddleware,
  getMe
);

export default router;