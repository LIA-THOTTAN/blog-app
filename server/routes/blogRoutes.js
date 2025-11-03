import express from 'express';
import { getBlogById, updateBlog,deleteBlog } from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

// Get single blog
router.get('/:id', getBlogById);

// Update blog
router.put('/:id', protect , updateBlog);


// Delete blog
router.delete('/:id', protect, deleteBlog);

export default router;
