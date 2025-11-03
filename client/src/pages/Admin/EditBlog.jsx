import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchBlog() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const blog = res.data;
        setTitle(blog.title);
        setContent(blog.content);
        setImage(blog.image || "");
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    }

    fetchBlog();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/blogs/${id}`,
        { title, content, image },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Blog updated successfully!");
      setTimeout(() => navigate("/admin/myblogs"), 1500);
    } catch (err) {
      console.error("Error updating blog:", err);
      setMessage("❌ Failed to update blog.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] flex flex-col justify-between py-6 px-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-400 mb-8 pl-2">
            BlogSpace
          </h1>
          <nav className="flex flex-col space-y-4 pl-2">
            <Link to="/admin/dashboard" className="hover:text-indigo-400">
              Dashboard
            </Link>
            <Link to="/admin/myblogs" className="hover:text-indigo-400">
              My Blogs
            </Link>
            <Link to="/admin/create" className="hover:text-indigo-400">
              Create Blog
            </Link>
            <Link to="/admin/users" className="hover:text-indigo-400">
              User Management
            </Link>
            <Link to="/admin/blogs" className="hover:text-indigo-400">
              Blog Management
            </Link>
            <Link to="/admin/profile" className="hover:text-indigo-400">
              Profile
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 mt-10 rounded-lg"
        >
          Logout
        </button>
      </aside>

      {/* Edit Blog Form */}
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-blue-400 mb-6">Edit Blog</h2>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="8"
                className="w-full p-3 bg-gray-700 text-white rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Image URL (optional)</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-md"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
            >
              Update Blog
            </button>

            {message && (
              <p className="text-sm text-gray-300 mt-2">{message}</p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
