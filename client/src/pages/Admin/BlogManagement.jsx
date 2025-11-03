
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/admin/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data) ? res.data : res.data.blogs ?? [];
      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      alert("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      alert("Blog deleted successfully!");
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert(err.response?.data?.message || "Failed to delete blog");
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog._id);
    setEditTitle(blog.title || "");
    setEditContent(blog.content || "");
  };

  const handleUpdateBlog = async (id) => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert("Title and content cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/admin/blogs/${id}`,
        { title: editTitle, content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

  
      const updated = res.data && res.data._id ? res.data : res.data.blog ?? res.data;

      setBlogs((prev) => prev.map((b) => (b._id === id ? updated : b)));
      setEditingBlog(null);
      setEditTitle("");
      setEditContent("");
      alert("Blog updated successfully!");
    } catch (err) {
      console.error("Error updating blog:", err);
      alert(err.response?.data?.message || "Failed to update blog");
    }
  };

  const handleDeleteComment = async (blogId, commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/admin/blogs/${blogId}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBlogs((prev) =>
        prev.map((blog) =>
          blog._id === blogId
            ? { ...blog, comments: (blog.comments || []).filter((c) => c._id !== commentId) }
            : blog
        )
      );

      alert("Comment deleted successfully!");
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert(err.response?.data?.message || "Failed to delete comment");
    }
  };

  useEffect(() => {
    fetchBlogs();
    
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
     
      <aside className="w-64 bg-[#0b0f19] flex flex-col justify-between border-r border-gray-800 shadow-xl">
        <div>
          <h2 className="text-2xl font-extrabold text-indigo-400 px-6 py-6">BlogSpace</h2>
          <nav className="flex flex-col space-y-4 px-6">
            <Link to="/admin/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
            <Link to="/admin/myblogs" className="text-gray-300 hover:text-white transition">My Blogs</Link>
            <Link to="/admin/createblog" className="text-gray-300 hover:text-white transition">Create Blog</Link>
            <Link to="/admin/users" className="text-gray-300 hover:text-white transition">User Management</Link>
            <Link to="/admin/blog-management" className="text-white font-semibold transition">Blog Management</Link>
            <Link to="/admin/profile" className="text-gray-300 hover:text-white transition">Profile</Link>
          </nav>
        </div>

        <div className="p-6 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-semibold transition shadow-md">
            Logout
          </button>
        </div>
      </aside>

    
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-indigo-400">Blog Management</h2>
          <div className="text-gray-400">
            Total Blogs: <span className="font-bold text-white">{blogs.length}</span>
          </div>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
            <p className="text-gray-400 text-lg">No blogs available.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-md">
                {blog.image && (
                  <img
                    src={blog.image.startsWith("http") ? blog.image : `http://localhost:5000${blog.image}`}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                {editingBlog === blog._id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 bg-gray-700 rounded-md text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows="4"
                      className="w-full p-2 bg-gray-700 rounded-md text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateBlog(blog._id)}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md font-semibold transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingBlog(null);
                          setEditTitle("");
                          setEditContent("");
                        }}
                        className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md font-semibold transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-indigo-400 mb-2">{blog.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">
                      By: {blog.author?.username || "Unknown"} | {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Invalid Date"}
                    </p>
                    <p className="text-gray-300 mb-4 line-clamp-3">{blog.content}</p>
                    <div className="flex gap-4 text-sm text-gray-400 mb-4">
                      <span>❤ {blog.likes || 0} Likes</span>
                      <span>💬 {blog.comments?.length || 0} Comments</span>
                    </div>

                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={() => handleEditBlog(blog)}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md font-semibold transition"
                      >
                        Delete
                      </button>
                    </div>

                    {blog.comments?.length > 0 && (
                      <div className="mt-4 bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <p className="font-semibold text-gray-300 mb-3 flex items-center gap-2">💬 Comments ({blog.comments.length})</p>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {blog.comments.map((c) => (
                            <div key={c._id} className="flex justify-between items-start bg-gray-800 p-3 rounded-md border border-gray-700">
                              <div className="flex-1">
                                <p className="text-sm text-gray-200 mb-1">{c.text}</p>
                                <p className="text-xs text-gray-400">- {c.username || (c.user?.username) || "Anonymous"} | {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}</p>
                              </div>
                              <button
                                onClick={() => handleDeleteComment(blog._id, c._id)}
                                className="text-red-400 hover:text-red-600 ml-2 text-lg"
                                title="Delete comment"
                              >
                                ✖
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
