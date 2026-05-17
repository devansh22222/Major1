import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import doctorMiddleware from "../middleware/doctor.middleware.js";

import {

  getPendingReviews,

  approveReview,

  rejectReview,

  editReview

} from "../controllers/doctor.controller.js";


const router = express.Router();


/* =========================
   GET PENDING REVIEWS
========================= */

router.get(
  "/pending",

  authMiddleware,

  doctorMiddleware,

  getPendingReviews
);


/* =========================
   APPROVE REVIEW
========================= */

router.put(
  "/approve/:id",

  authMiddleware,

  doctorMiddleware,

  approveReview
);


/* =========================
   REJECT REVIEW
========================= */

router.put(
  "/reject/:id",

  authMiddleware,

  doctorMiddleware,

  rejectReview
);


/* =========================
   EDIT REVIEW
========================= */

router.put(
  "/edit/:id",

  authMiddleware,

  doctorMiddleware,

  editReview
);


export default router;