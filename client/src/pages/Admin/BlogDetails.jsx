import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  
  useEffect(() => {
    async function fetchBlog() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/blogs/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBlog(res.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    }
    fetchBlog();
  }, [id]);

  
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
        likes: (prev.likes || 0) + 1
      }));
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  
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
        comments: [...(prev.comments || []), res.data.comment]
      }));

      setComment("");
      setMessage("Comment added!");
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("Error adding comment:", err);
      setMessage("Failed to add comment.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!blog)
    return (
      <div className="flex justify-center items-center min-h-screen text-white bg-gray-900">
        Loading blog...
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
    
      <aside className="w-64 bg-[#0f172a] flex flex-col justify-between py-6 px-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-400 mb-8 pl-2">BlogSpace</h1>
          <nav className="flex flex-col space-y-4 pl-2">
            <Link to="/admin/dashboard" className="hover:text-indigo-400">Dashboard</Link>
            <Link to="/admin/myblogs" className="hover:text-indigo-400">My Blogs</Link>
            <Link to="/admin/createblog" className="hover:text-indigo-400">Create Blog</Link>
            <Link to="/admin/users" className="hover:text-indigo-400">User Management</Link>
            <Link to="/admin/blogmanagement" className="hover:text-indigo-400">Blog Management</Link>
            <Link to="/admin/profile" className="hover:text-indigo-400">Profile</Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 mt-10 rounded-lg"
        >
          Logout
        </button>
      </aside>

 
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-blue-400 mb-3">{blog.title}</h1>
          <p className="text-gray-400 text-sm mb-4">
            By {blog.author?.username || "Admin"} on{" "}
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>

          <p className="text-gray-200 mb-6 whitespace-pre-line">{blog.content}</p>

      
          <div className="flex gap-6 text-gray-300 text-lg mb-4">
            <button onClick={handleLike} className="flex items-center gap-2 hover:text-red-400 transition">
              ❤️ <span>{blog.likes || 0} Likes</span>
            </button>

            <div className="flex items-center gap-2 text-purple-300">
              💬 <span>{blog.comments?.length || 0} Comments</span>
            </div>
          </div>

          <hr className="border-gray-700 my-6" />

          <h2 className="text-xl font-semibold mb-2">Comments</h2>

          {blog.comments && blog.comments.length > 0 ? (
            blog.comments.map((c, i) => (
              <div key={i} className="bg-gray-700 p-4 rounded-md mt-3">
                <p className="font-semibold text-blue-300 mb-1">
                  {c.user?.username || c.user || "Anonymous"}
                </p>
                <p className="text-gray-100">{c.text}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No comments yet.</p>
          )}

          <form onSubmit={handleComment} className="mt-5">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 bg-gray-700 rounded-md text-white focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-3 rounded-md"
            >
              Add Comment
            </button>
            {message && <p className="text-sm text-gray-300 mt-2">{message}</p>}
          </form>
        </div>
      </main>
    </div>
  );
}
