import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "" },
    caption: { type: String, default: "" },
    platform: { type: String, enum: ["tiktok", "instagram", "both"], default: "tiktok" },
    scheduledDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["draft", "scheduled", "posted", "cancelled"],
      default: "draft",
    },
    mediaUrl: { type: String, default: "" },
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
