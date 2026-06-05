import mongoose from "mongoose";

const trendSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    url: { type: String, default: "" },
    platform: { type: String, enum: ["tiktok", "instagram", "both"], default: "tiktok" },
    category: { type: String, default: "dance" },
    used: { type: Boolean, default: false },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Trend", trendSchema);
