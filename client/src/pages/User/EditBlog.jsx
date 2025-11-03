import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTitle(res.data.title);
        setContent(res.data.content);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
          return;
        }
        toast.error("Failed to load blog");
      }
    };

    fetchBlog();
  }, [id, token, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/blogs/${id}`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Blog updated successfully ✅");
      navigate("/user/myblogs");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Unauthorized. Login again.");
        navigate("/login");
        return;
      }
      toast.error("Update failed ❌");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Blog deleted successfully 🗑️");
      navigate("/user/myblogs");
    } catch (error) {
      toast.error("Delete failed ❌");
    }
  };

  if (loading)
    return <p className="text-white text-center mt-10 text-xl">Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100">

      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col justify-between shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-center py-5 border-b border-gray-800 text-indigo-400 tracking-wide">
            BlogSpace
          </h2>
          <nav className="flex flex-col p-4 space-y-3 mt-2">
            <Link to="/user/dashboard" className="px-3 py-2 rounded-lg hover:bg-gray-800 transition">
              Dashboard
            </Link>
            <Link to="/user/myblogs" className="px-3 py-2 rounded-lg hover:bg-gray-800 transition">
              My Blogs
            </Link>
            <Link to="/user/createblog" className="px-3 py-2 rounded-lg hover:bg-gray-800 transition">
              Create Blog
            </Link>
            <Link to="/user/profile" className="px-3 py-2 rounded-lg hover:bg-gray-800 transition">
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

     
      <div className="flex-1 p-10">
        <h2 className="text-3xl font-semibold text-indigo-400 mb-6">Edit Blog</h2>

        <form onSubmit={handleUpdate} className="max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">

          <input
            type="text"
            value={title}
            placeholder="Blog Title"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none"
          />

          <textarea
            value={content}
            placeholder="Blog Content"
            rows={10}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none"
          ></textarea>

          <div className="flex gap-3">
            <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg font-semibold transition">
              Update Blog
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-600 hover:bg-red-500 py-2 rounded-lg font-semibold transition"
            >
              Delete Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
