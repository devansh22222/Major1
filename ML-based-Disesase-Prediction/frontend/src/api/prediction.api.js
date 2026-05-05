import axios from "./axios";

export const predictDisease = (data) =>
  axios.post("/predict", data).then((res) => res.data);