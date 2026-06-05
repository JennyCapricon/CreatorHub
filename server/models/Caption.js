import mongoose from "mongoose";

const captionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true },
    mood: { type: String, default: "" },
    audience: { type: String, default: "" },
    captions: [String],
    hooks: [String],
    povLines: [String],
    hashtags: [String],
    saved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Caption", captionSchema);
