import axios from "./axios";

export const getHistoryAPI = () => {
  return axios.get("/chat/history").then(res => res.data);
};

export const sendMessageAPI = (message) => {
  return axios.post("/chat/send", { message }).then(res => res.data);
};