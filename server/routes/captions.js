import express from "express";
import Caption from "../models/Caption.js";
import store from "../store.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const moods = {
  funny: ["Laughing at how real this is", "Not me actually ", "I'm not crying, you're crying"],
  inspirational: ["Your sign to ", "Stop waiting. Start doing.", "The glow up starts now"],
  aesthetic: ["A vibe that hits different", "POV: you found your aesthetic", "Soft era loading"],
  educational: ["Save this for later ", "Here's what nobody tells you", "The truth about "],
  relatable: ["We all do this and it's okay", "That awkward moment when", "Nobody:                        Me:"],
};

const generateCaptions = (topic, mood, audience) => {
  const moodCaptions = moods[mood?.toLowerCase()] || moods.relatable;
  return {
    captions: [
      `${moodCaptions[0]} ${topic}${mood === "funny" ? " 😭" : ""}`,
      `${moodCaptions[1]} ${topic} ✨`,
      `${moodCaptions[2]} ${topic} 👏`,
      `Saving this if you're a ${audience || "creator"} who needs to hear this: ${topic}`,
      `${topic} is the new era and we're here for it 🔥`,
    ],
    hooks: [
      `STOP SCROLLING if you ${topic}`,
      `The truth about ${topic} nobody talks about`,
      `${topic} changed my life`,
    ],
    povLines: [
      `POV: you finally ${topic.toLowerCase()}`,
      `POV: ${audience || "creators"} when ${topic}`,
      `POV: the ${topic} era begins now`,
    ],
    hashtags: [
      `#${topic.replace(/\s+/g, "")}`,
      `#${topic.replace(/\s+/g, "")}Tok`,
      "#creatorhub", "#contentcreator", "#growyourpage", "#viral", "#fyp",
    ],
  };
};

router.post("/generate", protect, async (req, res) => {
  try {
    const { topic, mood, audience } = req.body;
    if (!topic) return res.status(400).json({ message: "Topic is required" });

    const { captions, hooks, povLines, hashtags } = generateCaptions(topic, mood, audience);
    const doc = { userId: req.user._id, topic, mood: mood || "", audience: audience || "", captions, hooks, povLines, hashtags };

    let result;
    if (global.USE_MEMORY_STORE) {
      result = store.createCaption(doc);
    } else {
      result = await Caption.create(doc);
    }

    res.status(201).json(result);
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
