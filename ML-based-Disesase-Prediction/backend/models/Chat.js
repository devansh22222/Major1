import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  symptoms: {
    type: String,
    required: true
  },
  response: {
    type: Object,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Chat", chatSchema);