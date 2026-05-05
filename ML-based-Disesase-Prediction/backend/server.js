// import express from "express";
// import axios from "axios";
// import cors from "cors";
// import connectDB from "./config/mongoDB.js";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());


// connectDB();

// // Python ML API URL
// const PYTHON_API = "http://127.0.0.1:8000/predict";

// // route
// app.post("/predict", async (req, res) => {
//   try {
//     const { symptoms } = req.body;

//     const response = await axios.post(PYTHON_API, {
//       symptoms
//     });

//     res.json(response.data);

//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// app.listen(process.env.PORT || 5000, () => {
//   console.log("Node server running on port " + (process.env.PORT || 5000));
// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongoDB.js";


dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// DB
connectDB();

import predictionRoutes from "./routes/prediction.routes.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";

// routes
app.use("/api/auth", authRoutes);
app.use("/api", predictionRoutes);
app.use("/api/chat", chatRoutes);


// test route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Node server running on port " + (process.env.PORT || 5000));
});