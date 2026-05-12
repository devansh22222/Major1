import axios from "./axios";

/* =========================
   REGISTER
========================= */

export const registerUser = async (data) => {
  const res = await axios.post(
    "/auth/register",
    data
  );

  return res;
};



/* =========================
   LOGIN
========================= */

export const loginUser = async (data) => {
  const res = await axios.post(
    "/auth/login",
    data
  );

  return res;
};



/* =========================
   GET USER PROFILE
========================= */

export const getUserProfile = async () => {
  const res = await axios.get(
    "/auth/me"
  );

  return res.data;
};