import mongoose from "mongoose";

const doctorReviewSchema =
  new mongoose.Schema(
    {

      user: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true
      },

      chat: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Chat",

        required: true
      },

      symptoms: {
        type: String,
        required: true
      },

      aiResponse: {
        type: String,
        required: true
      },

      status: {
        type: String,

        enum: [
          "pending",
          "approved",
          "edited",
          "rejected"
        ],

        default: "pending"
      },

      doctorResponse: {
        type: String,
        default: ""
      },

      doctorNotes: {
        type: String,
        default: ""
      },

      reviewedBy: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User"
      },

      reviewedAt: {
        type: Date
      }

    },
    {
      timestamps: true
    }
  );

export default mongoose.model(
  "DoctorReview",
  doctorReviewSchema
);