import axios from "axios";
import Chat from "../models/Chat.js";

const PYTHON_API = "http://127.0.0.1:8000/predict";

export const predictDisease = async (req, res) => {
  try {
    const { symptoms } = req.body;

    const response = await axios.post(PYTHON_API, { symptoms });

    const savedChat = await Chat.create({
      user: req.user.id,
      symptoms,
      response: response.data
    });

    res.json(savedChat);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};