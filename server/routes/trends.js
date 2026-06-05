import express from "express";
import Trend from "../models/Trend.js";
import store from "../store.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    let trends;
    if (global.USE_MEMORY_STORE) {
      trends = store.findTrendsByUser(req.user._id, req.query);
    } else {
      const query = { userId: req.user._id };
      if (req.query.category) query.category = req.query.category;
      if (req.query.used !== undefined) query.used = req.query.used === "true";
      trends = await Trend.find(query).sort({ createdAt: -1 });
    }
    res.json({ trends });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { title, url, platform, category, notes } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const doc = { userId: req.user._id, title, url: url || "", platform: platform || "tiktok", category: category || "other", notes: notes || "" };

    let trend;
    if (global.USE_MEMORY_STORE) {
      trend = store.createTrend(doc);
    } else {
      trend = await Trend.create(doc);
    }

    res.status(201).json({ trend });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    let trend;
    if (global.USE_MEMORY_STORE) {
      trend = store.updateTrend(req.params.id, req.user._id, req.body);
    } else {
      trend = await Trend.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true });
    }
    if (!trend) return res.status(404).json({ message: "Trend not found" });
    res.json({ trend });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    let trend;
    if (global.USE_MEMORY_STORE) {
      trend = store.deleteTrend(req.params.id, req.user._id);
    } else {
      trend = await Trend.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    }
    if (!trend) return res.status(404).json({ message: "Trend not found" });
    res.json({ message: "Trend deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
