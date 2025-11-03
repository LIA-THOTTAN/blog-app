
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserBlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    async function fetchBlog() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    }
    fetchBlog();
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/blogs/${id}/comment`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlog((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), res.data.comment],
      }));
      setComment("");
      setMessage("✅ Comment added!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Failed to add comment.");
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/blogs/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlog((prev) => ({
        ...prev,
        likes: (prev.likes || 0) + 1,
      }));
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100">
   
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col justify-between shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-center py-5 border-b border-gray-800 text-indigo-400 tracking-wide">
            BlogSpace
          </h2>
          <nav className="flex flex-col p-4 space-y-3 mt-2">
            <Link to="/user/dashboard" className="px-3 py-2 rounded-lg hover:bg-gray-800 transition">
              <span> Dashboard</span>
            </Link>
            <Link to="/user/myblogs" className="px-3 py-2 rounded-lg hover:bg-gray-800 transition">
              <span> My Blogs</span>
            </Link>
            <Link to="/user/createblog" className="px-3 py-2 rounded-lg hover:bg-gray-800 transition">
              <span> Create Blog</span>
            </Link>
            <Link to="/user/profile" className="px-3 py-2 rounded-lg hover:bg-gray-800 transition">
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
        <div className="max-w-4xl mx-auto">
       
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2"
          >
             Back
          </button>

          
          <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        
            {blog.image && (
              <img
                src={`http://localhost:5000${blog.image}`}
                alt={blog.title}
                className="w-full h-80 object-cover rounded-xl mb-6 border border-gray-600"
              />
            )}

    
            <h1 className="text-4xl font-bold text-blue-400 mb-4">{blog.title}</h1>

   
            <div className="flex items-center gap-4 text-gray-400 text-sm mb-6">
              <span> By {blog.author?.username || "Unknown"}</span>
              <span>•</span>
              <span>
                {new Date(blog.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

          
            <div className="text-gray-200 mb-6 whitespace-pre-line leading-relaxed text-lg">
              {blog.content}
            </div>

    
            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-700">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition"
              >
                <span className="text-xl">❤️</span>
                <span className="font-semibold">{blog.likes || 0} Likes</span>
              </button>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-xl">💬</span>
                <span className="font-semibold">
                  {blog.comments?.length || 0} Comments
                </span>
              </div>
            </div>

           
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-indigo-400">
                Comments
              </h2>

             
              {blog.comments && blog.comments.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {blog.comments.map((c, i) => (
                    <div
                      key={i}
                      className="bg-gray-700 p-4 rounded-lg border border-gray-600"
                    >
                      <p className="text-blue-400 font-semibold mb-1">
                        {c.user?.username || "Anonymous"}
                      </p>
                      <p className="text-gray-100 mb-2">{c.text}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 mb-6">
                  No comments yet. Be the first to comment!
                </p>
              )}

             
              <form onSubmit={handleComment} className="space-y-3">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows="3"
                  className="w-full p-3 bg-gray-700 rounded-lg text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                  >
                    Post Comment
                  </button>
                  {message && (
                    <p className="text-sm font-medium">{message}</p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}