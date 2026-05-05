import axios from "./axios";

export const getHistoryAPI = () => {
  return axios.get("/chat/history").then(res => res.data);
};