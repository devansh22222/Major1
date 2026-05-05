import Chat from "../models/Chat.js";

export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(chats);

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};