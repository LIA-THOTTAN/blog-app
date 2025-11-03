
// server/routes/authRoutes.js
import express from "express";
import path from "path";
import multer from "multer";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  createBlog,
  getMyBlogs,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  getBlogById,
  likeBlog,
  addComment,
  getAllBlogs,
  updateBlog,
} from "../controllers/blogController.js";

const router = express.Router();

// 📸 Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// 🧾 Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// 📝 Blog routes
router.get("/blogs", protect, getAllBlogs);
router.post("/blogs", protect, upload.single("image"), createBlog);
router.get("/myblogs", protect, getMyBlogs);
router.get("/blogs/:id", protect, getBlogById);
router.put("/blogs/:id", protect, upload.single("image"), updateBlog);
router.put("/blogs/:id/like", protect, likeBlog);
router.post("/blogs/:id/comment", protect, addComment);

export default router;