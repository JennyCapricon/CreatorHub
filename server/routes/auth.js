import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import store from "../store.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const sanitize = (user) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  username: user.username,
  avatar: user.avatar,
  plan: user.plan,
  preferences: user.preferences,
  bio: user.bio,
  createdAt: user.createdAt,
  linkinbio: user.linkinbio,
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    let user;
    if (global.USE_MEMORY_STORE) {
      user = await store.createUser({ email, password, name: name || "" });
    } else {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: "User already exists" });
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = await User.create({ email, password: hashedPassword, name: name || "" });
    }

    const token = generateToken(user._id);
    res.status(201).json({ token, user: sanitize(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user;
    if (global.USE_MEMORY_STORE) {
      user = store.findUserByEmail(email);
    } else {
      user = await User.findOne({ email });
    }

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({ token, user: sanitize(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/me", protect, async (req, res) => {
  res.json({ user: req.user });
});

router.put("/profile", protect, async (req, res) => {
  try {
    const { name, username, bio, avatar } = req.body;
    let user;
    if (global.USE_MEMORY_STORE) {
      user = store.updateUser(req.user._id, { name, username, bio, avatar });
    } else {
      user = await User.findByIdAndUpdate(req.user._id, { name, username, bio, avatar }, { new: true }).select("-password");
    }
    res.json({ user: sanitize(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/preferences", protect, async (req, res) => {
  try {
    const { darkMode, emailNotifications } = req.body;
    let user;
    if (global.USE_MEMORY_STORE) {
      user = store.updateUser(req.user._id, { preferences: { darkMode, emailNotifications } });
    } else {
      user = await User.findByIdAndUpdate(req.user._id, { preferences: { darkMode, emailNotifications } }, { new: true }).select("-password");
    }
    res.json({ user: sanitize(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
