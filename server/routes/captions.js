import express from "express";
import Caption from "../models/Caption.js";
import store from "../store.js";
import { protect } from "../middleware/auth.js";
import { generateContent } from "../utils/contentEngine.js";

const router = express.Router();

router.post("/generate", protect, async (req, res) => {
  try {
    const {
      topic = "", niche = "", platform = "instagram", contentType = "auto",
      tone = "casual", audience = "everyone", count = 1, goal = "", experienceLevel = "",
    } = req.body;

    const result = generateContent({ topic, niche, platform, contentType, tone, audience, count, goal, experienceLevel });
    const doc = {
      userId: req.user._id,
      topic: topic || "",
      niche: niche || "",
      platform,
      contentType: contentType || "auto",
      tone: tone || "casual",
      audience: audience || "everyone",
      count: result.count,
      posts: result.posts,
      hashtags: result.hashtags,
    };

    let resultDoc;
    if (global.USE_MEMORY_STORE) {
      resultDoc = store.createCaption(doc);
    } else {
      resultDoc = await Caption.create(doc);
    }

    res.status(201).json({ ...result, _id: resultDoc._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/history", protect, async (req, res) => {
  try {
    let captions;
    if (global.USE_MEMORY_STORE) {
      captions = store.findCaptionsByUser(req.user._id);
    } else {
      captions = await Caption.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20);
    }
    res.json({ captions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/save", protect, async (req, res) => {
  try {
    let caption;
    if (global.USE_MEMORY_STORE) {
      caption = store.updateCaption(req.params.id, req.user._id, { saved: true });
    } else {
      caption = await Caption.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { saved: true }, { new: true });
    }
    res.json({ caption });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;