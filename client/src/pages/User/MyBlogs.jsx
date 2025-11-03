
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function UserMyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    async function fetchMyBlogs() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/myblogs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs.");
      }
    }
    fetchMyBlogs();
  }, []);

  const handleLike = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/blogs/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, likes: (b.likes || 0) + 1 } : b
        )
      );
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100">
     
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
              <span> Dashboard</span>
            </Link>
            <Link
              to="/user/myblogs"
              className="px-3 py-2 rounded-lg bg-gray-800 transition"
            >
              <span> My Blogs</span>
            </Link>
            <Link
              to="/user/createblog"
              className="px-3 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              <span> Create Blog</span>
            </Link>
            <Link
              to="/user/profile"
              className="px-3 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              <span> Profile</span>
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

      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-3xl font-semibold text-indigo-400 mb-6">My Blogs</h2>

        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        {blogs.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
            <p className="text-gray-400 text-lg">You haven't created any blogs yet.</p>
            <button
              onClick={() => navigate("/user/createblog")}
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition"
            >
              Create Your First Blog
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-md hover:shadow-lg transition-all"
              >
              
                {blog.image && (
                  <img
                    src={`http://localhost:5000${blog.image}`}
                    alt={blog.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}

             
                <h3
                  className="text-xl font-semibold text-blue-400 hover:underline cursor-pointer"
                  onClick={() => navigate(`/user/blog/${blog._id}`)}
                >
                  {blog.title}
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  By {blog.author?.username || "You"} on{" "}
                  {new Date(blog.createdAt).toLocaleDateString()}
                </p>

                
                <p className="text-gray-300 mt-3">
                  {blog.content.length > 100
                    ? `${blog.content.slice(0, 100)}...`
                    : blog.content}
                </p>

                
                <div className="flex justify-between items-center mt-4 text-gray-400">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleLike(blog._id)}
                      className="flex items-center gap-1 hover:text-red-400 transition"
                    >
                      ❤️ {blog.likes || 0}
                    </button>

                    <button
                      onClick={() => navigate(`/user/blog/${blog._id}`)}
                      className="hover:text-blue-400 transition"
                    >
                      💬 {blog.comments?.length || 0} Comments
                    </button>
                  </div>

                
                  <button
                    onClick={() => navigate(`/user/editblog/${blog._id}`)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all"
                  >
                    ✏️ Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
