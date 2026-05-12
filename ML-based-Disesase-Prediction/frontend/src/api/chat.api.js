// import axios from "./axios";

// export const getHistoryAPI = () => {
//   return axios.get("/chat/history").then(res => res.data);
// };

// export const sendMessageAPI = (message) => {
//   return axios.post("/chat/send", { message }).then(res => res.data);
// };

import axios from "./axios";

/* GET CHAT HISTORY */
export const getHistoryAPI = async () => {
  const res = await axios.get("/chat/history");
  return res.data;
};

/* SEND MESSAGE */
export const sendMessageAPI = async (message) => {
  const res = await axios.post("/chat/send", {
    message
  });

  return res.data;
};