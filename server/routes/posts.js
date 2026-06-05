import express from "express";
import Post from "../models/Post.js";
import store from "../store.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    let posts;
    if (global.USE_MEMORY_STORE) {
      posts = store.findPostsByUser(req.user._id, { month: req.query.month, year: req.query.year });
    } else {
      const query = { userId: req.user._id };
      if (req.query.month && req.query.year) {
        const start = new Date(req.query.year, req.query.month - 1, 1);
        const end = new Date(req.query.year, req.query.month, 0, 23, 59, 59);
        query.scheduledDate = { $gte: start, $lte: end };
      }
      posts = await Post.find(query).sort({ scheduledDate: 1 });
    }
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { title, caption, platform, scheduledDate, tags } = req.body;
    if (!scheduledDate) return res.status(400).json({ message: "Scheduled date is required" });

    const doc = { userId: req.user._id, title: title || "", caption: caption || "", platform: platform || "tiktok", scheduledDate: new Date(scheduledDate), tags: tags || [] };

    let post;
    if (global.USE_MEMORY_STORE) {
      post = store.createPost(doc);
    } else {
      post = await Post.create(doc);
    }

    res.status(201).json({ post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    let post;
    if (global.USE_MEMORY_STORE) {
      post = store.updatePost(req.params.id, req.user._id, req.body);
    } else {
      post = await Post.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true });
    }
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    let post;
    if (global.USE_MEMORY_STORE) {
      post = store.deletePost(req.params.id, req.user._id);
    } else {
      post = await Post.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    }
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
