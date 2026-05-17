import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =========================
   GENERATE TOKEN
========================= */

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
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

    const userExists = await User.findOne({
      email
    });

    if (userExists) {
      return res.status(400).json({
        msg: "User already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "patient"
    });

    const token = generateToken(
      user._id,
      user.role
    );

    res.status(201).json({
      token,
      role: user.role
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
      password,
      role
    } = req.body;

    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(400).json({
        msg: "Invalid credentials"
      });
    }

    /* ROLE CHECK */

    if (user.role !== role) {
      return res.status(403).json({
        msg: `This account is not registered as ${role}`
      });
    }

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

    const token = generateToken(
      user._id,
      user.role
    );

    res.json({
      token,
      role: user.role
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