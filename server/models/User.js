import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firebaseUid: { type: String },
    name: { type: String, default: "" },
    username: { type: String, unique: true, sparse: true },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    plan: { type: String, enum: ["free", "premium"], default: "free" },
    linkinbio: {
      profilePic: { type: String, default: "" },
      bio: { type: String, default: "" },
      links: [
        {
          title: String,
          url: String,
          id: String,
        },
      ],
      socialLinks: {
        instagram: { type: String, default: "" },
        tiktok: { type: String, default: "" },
        youtube: { type: String, default: "" },
        twitter: { type: String, default: "" },
      },
      theme: { type: String, default: "dark" },
    },
    preferences: {
      darkMode: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
