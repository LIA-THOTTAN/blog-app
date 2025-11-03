// server/controllers/blogController.js
import Blog from "../models/blogModel.js";

// 🧩 Get a single blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "username email")
      .populate("comments.user", "username");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ❤ Like a blog post
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const alreadyLiked = blog.likedBy?.some(
      (id) => id.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      return res.status(400).json({ message: "Already liked this blog" });
    }

    blog.likes = (blog.likes || 0) + 1;
    blog.likedBy.push(req.user._id);
    await blog.save();

    res.json({ message: "Blog liked successfully", likes: blog.likes });
  } catch (err) {
    console.error("Error liking blog:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 💬 Add a comment
export const addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const comment = {
      user: req.user._id,
      text: req.body.text,
      username: req.user.username || "Anonymous",
      createdAt: new Date(),
    };

    blog.comments.push(comment);
    await blog.save();

    res.json({ message: "Comment added successfully", comment });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧡 Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✏ Update blog (used by both User & Admin)
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Check if user is author or admin
    if (
      blog.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to edit this blog" });
    }

    // Update title, content, and image
    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    if (req.file) {
      blog.image = `/uploads/${req.file.filename}`;
    }

    const updatedBlog = await blog.save();
    res.json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🗑 Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // only author or admin can delete
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this blog" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ message: "Server error" });
  }
};
