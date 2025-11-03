import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs"); // ✅ public route
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <h1 className="text-xl">Loading blogs...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-indigo-400">
        All Blogs
      </h1>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          No blogs available yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-gray-800 rounded-lg shadow-lg p-5 hover:shadow-indigo-500/20 transition-all"
            >
              {blog.image && (
                <img
                  src={`http://localhost:5000${blog.image}`}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              <h2 className="text-2xl font-semibold text-blue-400 mb-2">
                {blog.title}
              </h2>

              <p className="text-gray-300 text-sm mb-3">
                {blog.content.substring(0, 150)}...
              </p>

              <p className="text-gray-500 text-xs mb-4">
                 By {blog.author?.name || "Unknown"}
              </p>

              <Link
                to={`/blog/${blog._id}`}
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Read More →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
