import axios from "./axios";

export const registerUser = (data) =>
  axios.post("/auth/register", data);

export const loginUser = (data) =>
  axios.post("/auth/login", data);


export const getUserProfile = () => {
  return axios.get("/auth/me").then(res => res.data);
};