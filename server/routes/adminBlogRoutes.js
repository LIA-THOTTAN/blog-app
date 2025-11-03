
import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  getAllBlogsAdmin,
  updateBlog,
  deleteBlog,
  deleteComment,
} from "../controllers/adminBlogController.js";

const router = express.Router();
router.use(protect, adminOnly);

router.get("/blogs", getAllBlogsAdmin);
router.put("/blogs/:id", updateBlog);
router.delete("/blogs/:id", deleteBlog);
router.delete("/blogs/:blogId/comments/:commentId", deleteComment);

export default router;
