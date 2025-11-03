// client/src/pages/User/UserDashboard.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        // ✅ Correct public endpoint for all blogs
        const response = await axios.get("http://localhost:5000/api/blogs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBlogs(response.data || []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        if (err?.response?.status === 401) {
          alert("Session expired. Please log in again.");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllBlogs();
  }, [navigate, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col justify-between shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-center py-5 border-b border-gray-800 text-indigo-400 tracking-wide">
            BlogSpace
          </h2>
          <nav className="flex flex-col p-4 space-y-3 mt-2">
            <Link
              to="/user/dashboard"
              className="px-3 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Dashboard
            </Link>
            <Link
              to="/user/myblogs"
              className="px-3 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              My Blogs
            </Link>
            <Link
              to="/user/createblog"
              className="px-3 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Create Blog
            </Link>
            <Link
              to="/user/profile"
              className="px-3 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Profile
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-500 py-2 rounded-lg font-semibold transition shadow-md"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-semibold text-indigo-400 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-400 mb-6">
          Welcome back,{" "}
          <span className="font-semibold text-white">
            {user?.username || "User"}
          </span>
        </p>

        <h2 className="text-2xl font-semibold text-blue-400 mb-4">
          All Blogs
        </h2>

        {blogs.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
            <p className="text-gray-400 text-lg">No blogs available yet.</p>
            <Link to="/user/createblog">
              <button className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition">
                Create Your First Blog
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-5 hover:shadow-lg hover:shadow-indigo-700/20 transition cursor-pointer"
                onClick={() => navigate(`/user/blog/${blog._id}`)}
              >
                {blog.image && (
                  <img
                    src={`http://localhost:5000${blog.image}`}
                    alt={blog.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}
                <h3 className="text-xl font-semibold text-indigo-300 mb-2">
                  {blog.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-3 mb-3">
                  {blog.content.slice(0, 120)}...
                </p>
                <div className="flex justify-between items-center text-gray-500 text-sm">
                  <span>By: {blog.author?.username || "Unknown"}</span>
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3 text-gray-400 text-sm">
                  <span>❤️ {blog.likes || 0} Likes</span>
                  <span>💬 {blog.comments?.length || 0} Comments</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
