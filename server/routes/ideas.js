import express from "express";
import Idea from "../models/Idea.js";
import store from "../store.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const { status, type, search } = req.query;
    let ideas;

    if (global.USE_MEMORY_STORE) {
      ideas = store.findIdeasByUser(req.user._id, { status, type, search });
    } else {
      const query = { userId: req.user._id };
      if (status) query.status = status;
      if (type) query.type = type;
      if (search) query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
      ideas = await Idea.find(query).sort({ updatedAt: -1 });
    }

    res.json({ ideas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { title, description, type, tags, status } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const doc = { userId: req.user._id, title, description, type: type || "video", tags: tags || [], status: status || "draft" };

    let idea;
    if (global.USE_MEMORY_STORE) {
      idea = store.createIdea(doc);
    } else {
      idea = await Idea.create(doc);
    }

    res.status(201).json({ idea });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    let idea;
    if (global.USE_MEMORY_STORE) {
      idea = store.updateIdea(req.params.id, req.user._id, req.body);
    } else {
      idea = await Idea.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true });
    }
    if (!idea) return res.status(404).json({ message: "Idea not found" });
    res.json({ idea });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    let idea;
    if (global.USE_MEMORY_STORE) {
      idea = store.deleteIdea(req.params.id, req.user._id);
    } else {
      idea = await Idea.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    }
    if (!idea) return res.status(404).json({ message: "Idea not found" });
    res.json({ message: "Idea deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
