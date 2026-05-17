import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/mongoDB.js";

import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";

dotenv.config();

const app = express();

/* =========================
   DATABASE
========================= */

connectDB();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());

app.use(express.json());

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/doctor", doctorRoutes);



/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("MediRx API Running 🚀");
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});