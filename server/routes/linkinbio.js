import express from "express";
import User from "../models/User.js";
import store from "../store.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    let user;
    if (global.USE_MEMORY_STORE) {
      user = store.findUserById(req.user._id);
    } else {
      user = await User.findById(req.user._id).select("linkinbio name username avatar");
    }
    res.json({ linkinbio: user.linkinbio, name: user.name, username: user.username, avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/", protect, async (req, res) => {
  try {
    const { profilePic, bio, links, socialLinks, theme } = req.body;

    const linkinbio = {
      profilePic: profilePic || "",
      bio: bio ?? "",
      links: links || [],
      socialLinks: socialLinks || {},
      theme: theme || "dark",
    };

    let user;
    if (global.USE_MEMORY_STORE) {
      user = store.updateUser(req.user._id, { linkinbio });
    } else {
      user = await User.findByIdAndUpdate(req.user._id, { linkinbio }, { new: true }).select("linkinbio");
    }

    res.json({ linkinbio: user.linkinbio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/public/:username", async (req, res) => {
  try {
    let user;
    if (global.USE_MEMORY_STORE) {
      user = store.users.find((u) => u.username === req.params.username);
    } else {
      user = await User.findOne({ username: req.params.username }).select("linkinbio name username avatar");
    }

    if (!user) return res.status(404).json({ message: "User not found" });
    const { linkinbio, name, username, avatar } = user;
    res.json({ user: { linkinbio, name, username, avatar } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
