import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =========================
   GENERATE TOKEN
========================= */

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};



/* =========================
   REGISTER
========================= */

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    /* CHECK USER */
    const userExists = await User.findOne({
      email
    });

    if (userExists) {
      return res.status(400).json({
        msg: "User already exists"
      });
    }

    /* HASH PASSWORD */
    const hashedPassword =
      await bcrypt.hash(password, 10);

    /* CREATE USER */
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    /* TOKEN */
    const token = generateToken(user._id);

    res.status(201).json({
      token
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Server error"
    });
  }
};



/* =========================
   LOGIN
========================= */

export const login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    /* FIND USER */
    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid credentials"
      });
    }

    /* MATCH PASSWORD */
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid credentials"
      });
    }

    /* TOKEN */
    const token = generateToken(user._id);

    res.json({
      token
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Server error"
    });
  }
};



/* =========================
   GET PROFILE
========================= */

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        msg: "User not found"
      });
    }

    res.json(user);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Server error"
    });
  }
};