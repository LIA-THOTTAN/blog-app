import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { createAdminUser } from "./adminSeeder.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminBlogRoutes from "./routes/adminBlogRoutes.js";
import blogRoutes from './routes/blogRoutes.js';
import path from "path";

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());


app.use("/api", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminBlogRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use('/api/blogs', blogRoutes);
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");
    await createAdminUser();
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
