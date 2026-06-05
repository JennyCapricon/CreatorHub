import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    followers: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    platform: { type: String, enum: ["tiktok", "instagram"], default: "tiktok" },
  },
  { timestamps: true }
);

export default mongoose.model("Analytics", analyticsSchema);
