import DoctorReview from "../models/DoctorReview.js";
import Chat from "../models/Chat.js";

/* =========================
   GET PENDING REVIEWS
========================= */

export const getPendingReviews =
  async (req, res) => {

    try {

      const reviews =
        await DoctorReview.find({
          status: "pending"
        })
        .sort({ createdAt: -1 });

      res.json(reviews);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        msg:
          "Failed to load reviews"
      });
    }
  };



/* =========================
   APPROVE REVIEW
========================= */

export const approveReview =
  async (req, res) => {

    try {

      const review =
        await DoctorReview.findById(
          req.params.id
        );

      if (!review) {

        return res.status(404).json({
          msg: "Review not found"
        });
      }


      review.status =
        "approved";

      review.reviewedBy =
        req.user.id;

      review.reviewedAt =
        new Date();


      await review.save();

      /* UPDATE CHAT MESSAGE */

        const chat =
        await Chat.findById(
            review.chat
        );

        if (chat) {

        const assistantMessage =
            chat.messages
            .slice()
            .reverse()
            .find(
                (msg) =>
                msg.role ===
                "assistant"
            );

        if (assistantMessage) {

            assistantMessage.reviewStatus =
            "approved";

            await chat.save();
        }
        }


      res.json({
        success: true
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        msg:
          "Approval failed"
      });
    }
  };



/* =========================
   REJECT REVIEW
========================= */

export const rejectReview =
  async (req, res) => {

    try {

      const review =
        await DoctorReview.findById(
          req.params.id
        );

      if (!review) {

        return res.status(404).json({
          msg: "Review not found"
        });
      }


      review.status =
        "rejected";

      review.reviewedBy =
        req.user.id;

      review.reviewedAt =
        new Date();


      await review.save();

      const chat =
        await Chat.findById(
            review.chat
        );

        if (chat) {

        const assistantMessage =
            chat.messages
            .slice()
            .reverse()
            .find(
                (msg) =>
                msg.role ===
                "assistant"
            );

        if (assistantMessage) {

            assistantMessage.reviewStatus =
            "rejected";

            await chat.save();
        }
        }


      res.json({
        success: true
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        msg:
          "Reject failed"
      });
    }
  };



/* =========================
   EDIT REVIEW
========================= */

export const editReview =
  async (req, res) => {

    try {

      const {
        doctorResponse,
        doctorNotes
      } = req.body;


      const review =
        await DoctorReview.findById(
          req.params.id
        );

      if (!review) {

        return res.status(404).json({
          msg: "Review not found"
        });
      }


      review.status =
        "edited";

      review.doctorResponse =
        doctorResponse;

      review.doctorNotes =
        doctorNotes;

      review.reviewedBy =
        req.user.id;

      review.reviewedAt =
        new Date();


      await review.save();

      const chat =
        await Chat.findById(
            review.chat
        );

        if (chat) {

        const assistantMessage =
            chat.messages
            .slice()
            .reverse()
            .find(
                (msg) =>
                msg.role ===
                "assistant"
            );

        if (assistantMessage) {

            assistantMessage.reviewStatus =
            "edited";

            assistantMessage.content =
            doctorResponse;

            assistantMessage.doctorNotes =
            doctorNotes;

            await chat.save();
        }
        }


      res.json({
        success: true
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        msg:
          "Edit failed"
      });
    }
  };