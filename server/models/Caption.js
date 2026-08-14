import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    type: { type: String, default: "" },
    label: { type: String, default: "" },
    text: { type: String, required: true },
    onScreen: [String],
  },
  { _id: false }
);

const captionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, default: "" },
    niche: { type: String, default: "" },
    platform: { type: String, default: "instagram" },
    contentType: { type: String, default: "auto" },
    tone: { type: String, default: "casual" },
    audience: { type: String, default: "everyone" },
    count: { type: Number, default: 1 },
    posts: [postSchema],
    hashtags: [String],
    saved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Caption", captionSchema);