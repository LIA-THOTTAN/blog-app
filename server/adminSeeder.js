
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js"; 

dotenv.config();

export async function createAdminUser() {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("👑 Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin@123", 10);

    const admin = new User({
      username: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
    console.log("👉 Email: admin@gmail.com | Password: admin@123");
  } catch (err) {
    console.error("❌ Error creating admin:", err);
  }
}