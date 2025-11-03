import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("image", image);

      await axios.post("http://localhost:5000/api/blogs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("✅ Blog created successfully!");
      setTitle("");
      setContent("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create blog.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-gray-100">
     
      <aside className="w-64 bg-[#0b1221] p-6 flex flex-col justify-between shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-indigo-400 mb-10">
            BlogSpace
          </h2>
          <nav className="space-y-5">
            <Link
              to="/admin/dashboard"
              className="block text-gray-300 hover:text-white transition"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/myblogs"
              className="block text-gray-300 hover:text-white transition"
            >
              My Blogs
            </Link>
            <Link
              to="/admin/createblog"
              className="block text-gray-300 hover:text-white transition"
            >
              Create Blog
            </Link>
            <Link
              to="/admin/users"
              className="block text-gray-300 hover:text-white transition"
            >
              User Management
            </Link>
            <Link
              to="/admin/blogmanagement"
              className="block text-gray-300 hover:text-white transition"
            >
              Blog Management
            </Link>
            <Link
              to="/admin/profile"
              className="block text-gray-300 hover:text-white transition"
            >
              Profile
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-semibold transition"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 flex items-center justify-center p-10 bg-[#0f172a]">
        <div className="w-full max-w-lg bg-gray-800 p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">
            Create New Blog
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
            />

            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="6"
              required
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
            />

            <div>
              <label className="block mb-2 text-gray-300">
                Cover Image (Upload)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 rounded-lg w-full object-cover"
              />
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-semibold"
            >
              CREATE
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-gray-300 font-medium">
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateBlog;
