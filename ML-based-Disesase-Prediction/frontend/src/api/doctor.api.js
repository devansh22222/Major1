import axios from "./axios";


/* =========================
   GET PENDING REVIEWS
========================= */

export const getPendingReviewsAPI =
  async () => {

    const res =
      await axios.get(
        "/doctor/pending"
      );

    return res.data;
  };



/* =========================
   APPROVE REVIEW
========================= */

export const approveReviewAPI =
  async (id) => {

    const res =
      await axios.put(
        `/doctor/approve/${id}`
      );

    return res.data;
  };



/* =========================
   REJECT REVIEW
========================= */

export const rejectReviewAPI =
  async (id) => {

    const res =
      await axios.put(
        `/doctor/reject/${id}`
      );

    return res.data;
  };



/* =========================
   EDIT REVIEW
========================= */

export const editReviewAPI =
  async (
    id,
    data
  ) => {

    const res =
      await axios.put(
        `/doctor/edit/${id}`,
        data
      );

    return res.data;
  };