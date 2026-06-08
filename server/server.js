import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

import authRoutes from "./routes/auth.js";
import captionRoutes from "./routes/captions.js";
import ideaRoutes from "./routes/ideas.js";
import postRoutes from "./routes/posts.js";
import trendRoutes from "./routes/trends.js";
import analyticsRoutes from "./routes/analytics.js";
import linkinbioRoutes from "./routes/linkinbio.js";

const app = express();

app.use(cors());
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
}

app.use("/api/auth", authRoutes);
app.use("/api/captions", captionRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/trends", trendRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/linkinbio", linkinbioRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "CreatorHub API is running", mode: global.USE_MEMORY_STORE ? "memory" : "mongodb" });
});

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    global.USE_MEMORY_STORE = false;
    app.listen(PORT, HOST, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.log("Falling back to in-memory store (data will not persist)");
    global.USE_MEMORY_STORE = true;
    app.listen(PORT, HOST, () => console.log(`Server running on port ${PORT} (in-memory mode)`));
  });
