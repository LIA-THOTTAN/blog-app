// client/src/pages/Admin/AdminDashboard.jsx

import React, { useEffect, useState } from "react";
import { Users, FileText, Shield, Activity } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalBlogs: 0,
  });
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
    const fetchDashboardData = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        const [statsRes, blogsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/blogs", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats(statsRes.data || {});
        setBlogs(blogsRes.data || []);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        if (err?.response?.status === 401) {
          alert("Session expired. Please login again.");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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

  const statCards = [
    {
      title: "Total Users",
      count: stats.totalUsers,
      icon: <Users size={28} />,
      color: "bg-blue-900 text-blue-300 border border-blue-700 hover:shadow-blue-700/40",
    },
    {
      title: "Total Admins",
      count: stats.totalAdmins,
      icon: <Shield size={28} />,
      color: "bg-blue-900 text-blue-300 border border-blue-700 hover:shadow-blue-700/40",
    },
    {
      title: "Total Blogs",
      count: stats.totalBlogs,
      icon: <FileText size={28} />,
      color: "bg-blue-900 text-blue-300 border border-blue-700 hover:shadow-blue-700/40",
    },
    {
      title: "Active Users",
      count: Math.max((stats.totalUsers || 0) - (stats.totalAdmins || 0), 0),
      icon: <Activity size={28} />,
      color: "bg-blue-900 text-blue-300 border border-blue-700 hover:shadow-blue-700/40",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col justify-between shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-center py-5 border-b border-gray-800 text-indigo-400 tracking-wide">
            BlogSpace
          </h2>
          <nav className="flex flex-col p-4 space-y-3 mt-2">
            <Link to="/admin" className="px-3 py-2 rounded-lg hover:bg-gray-800 transition">Dashboard</Link>
            <Link to="/admin/myblogs" className="px-3 py-2 rounded-lg hover:bg-gray-800 transition">My Blogs</Link>
            <Link to="/admin/createblog" className="px-3 py-2 rounded-lg hover:bg-gray-800 transition">Create Blog</Link>
            <Link to="/admin/users" className="px-3 py-2 rounded-lg hover:bg-gray-800 transition">User Management</Link>
            <Link to="/admin/blogmanagement" className="px-3 py-2 rounded-lg hover:bg-gray-800 transition">Blog Management</Link>
            <Link to="/admin/profile" className="px-3 py-2 rounded-lg hover:bg-gray-800 transition">Profile</Link>
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
        <h1 className="text-3xl font-semibold text-indigo-400 mb-2">Dashboard Overview</h1>
        <p className="text-gray-400 mb-6">
          Welcome back, <span className="font-semibold text-white">{user?.username || "Admin"}</span>
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((item, idx) => (
            <div
              key={idx}
              className={`${item.color} rounded-2xl p-5 shadow-lg hover:scale-105 transform transition flex items-center justify-between`}
            >
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-3xl font-bold mt-1">{item.count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* All Blogs */}
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">All Posted Blogs</h2>

        {blogs.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
            <p className="text-gray-400 text-lg">No blogs yet.</p>
            <Link to="/admin/createblog">
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
                onClick={() => navigate(`/admin/blog/${blog._id}`)}
              >
                {blog.image && (
                  <img
                    src={`http://localhost:5000${blog.image}`}
                    alt={blog.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}
                <h3 className="text-xl font-semibold text-indigo-300 mb-2">{blog.title}</h3>
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

                {/* ✅ Like & Comment Display */}
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

export default AdminDashboard;
