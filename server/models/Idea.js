import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    type: {
      type: String,
      enum: ["video", "script", "hook", "transition", "concept", "other"],
      default: "video",
    },
    tags: [String],
    status: {
      type: String,
      enum: ["draft", "in_progress", "used", "archived"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Idea", ideaSchema);
