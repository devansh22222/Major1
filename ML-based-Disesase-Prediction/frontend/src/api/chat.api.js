import axios from "./axios";


/* =========================
   GET HISTORY
========================= */

export const getHistoryAPI =
  async () => {

    const res =
      await axios.get(
        "/chat/history"
      );

    return res.data;
  };



/* =========================
   SEND MESSAGE
========================= */

export const sendMessageAPI =
  async (data) => {

    const res =
      await axios.post(
        "/chat/send",
        data
      );

    return res.data;
  };