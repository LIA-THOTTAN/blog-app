import User from "../models/User.js";
import Blog from "../models/blogModel.js";


export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalBlogs = await Blog.countDocuments();

    res.json({ totalUsers, totalAdmins, totalBlogs });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};


export const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.status = "rejected";
    await user.save();

    res.status(200).json({
      message: "User rejected successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error rejecting user",
      error: error.message,
    });
  }
};


export const unrejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.status = "active";
    await user.save();

    res.status(200).json({
      message: "User access restored successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error restoring user access",
      error: error.message,
    });
  }
};
