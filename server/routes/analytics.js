import express from "express";
import Analytics from "../models/Analytics.js";
import store from "../store.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const days = req.query.days || 30;

    let data;
    if (global.USE_MEMORY_STORE) {
      data = store.findAnalyticsByUser(req.user._id, days);
    } else {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));
      const query = { userId: req.user._id, date: { $gte: startDate } };
      if (req.query.platform) query.platform = req.query.platform;
      data = await Analytics.find(query).sort({ date: 1 });
    }

    const totals = data.reduce(
      (acc, cur) => ({
        followers: Math.max(acc.followers, cur.followers),
        views: acc.views + cur.views,
        likes: acc.likes + cur.likes,
        comments: acc.comments + cur.comments,
        shares: acc.shares + cur.shares,
      }),
      { followers: 0, views: 0, likes: 0, comments: 0, shares: 0 }
    );

    const engagementRate =
      totals.views > 0
        ? parseFloat((((totals.likes + totals.comments + totals.shares) / totals.views) * 100).toFixed(2))
        : 0;

    res.json({ data, totals, engagementRate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/sync", protect, async (req, res) => {
  try {
    const { platform, followers, views, likes, comments, shares } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let entry;
    if (global.USE_MEMORY_STORE) {
      const existing = store.analytics.find(
        (a) =>
          a.userId === req.user._id &&
          a.platform === platform &&
          new Date(a.date).setHours(0, 0, 0, 0) === today.getTime()
      );
      if (existing) {
        Object.assign(existing, { followers, views, likes, comments, shares, updatedAt: new Date() });
        entry = existing;
      } else {
        entry = store.createAnalytics({ userId: req.user._id, platform, followers, views, likes, comments, shares, date: new Date() });
      }
    } else {
      entry = await Analytics.findOneAndUpdate(
        { userId: req.user._id, platform, date: { $gte: today, $lte: new Date(today.getTime() + 86400000) } },
        { followers, views, likes, comments, shares },
        { upsert: true, new: true }
      );
    }

    res.json({ entry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
