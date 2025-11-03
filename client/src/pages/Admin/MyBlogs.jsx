import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
          b._id === id
            ? { ...b, likes: (b.likes || 0) + 1, liked: true }
            : b
        )
      );
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
     
      <aside className="w-64 bg-[#0b1120] p-6 flex flex-col justify-between border-r border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-indigo-400 mb-8">BlogSpace</h1>

          <nav className="space-y-4">
            <Link to="/admin/dashboard" className="block text-gray-300 hover:text-white">Dashboard</Link>
            <Link to="/admin/myblogs" className="block text-gray-300 hover:text-white">My Blogs</Link>
            <Link to="/admin/createblog" className="block text-gray-300 hover:text-white">Create Blog</Link>
            <Link to="/admin/users" className="block text-gray-300 hover:text-white">User Management</Link>
            <Link to="/admin/blogmanagement" className="block text-gray-300 hover:text-white">Blog Management</Link>
            <Link to="/admin/profile" className="block text-gray-300 hover:text-white">Profile</Link>
          </nav>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-xl"
        >
          Logout
        </button>
      </aside>

     
      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">My Blogs</h2>

        {blogs.length === 0 ? (
          <p className="text-gray-400">No blogs found.</p>
        ) : (
          <div className="grid grid-cols-1 max-w-2xl gap-6">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
                
                
                {blog.image && (
                  <img
                    src={`http://localhost:5000${blog.image}`}
                    alt={blog.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}

                <div className="p-5">
               
                  <h3
                    className="text-xl font-bold text-blue-400 hover:underline cursor-pointer"
                    onClick={() => navigate(`/admin/blog/${blog._id}`)}
                  >
                    {blog.title}
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    By You on {new Date(blog.createdAt).toLocaleDateString()}
                  </p>

                
                  <p className="text-gray-300 mt-3">
                    {blog.content.length > 150
                      ? `${blog.content.slice(0, 150)}...`
                      : blog.content}
                  </p>

               
                  <div className="flex justify-between items-center mt-4 text-gray-400">
                    <div className="flex gap-6 items-center">
                      
                      
                      <button
                        onClick={() => handleLike(blog._id)}
                        className={`flex items-center gap-1 ${
                          blog.liked ? "text-red-500" : "hover:text-red-400"
                        }`}
                      >
                        ❤️ {blog.likes || 0}
                      </button>

                     
                      <button
                        onClick={() => navigate(`/admin/blog/${blog._id}`)}
                        className="flex items-center gap-1 hover:text-blue-400"
                      >
                        💬 {blog.comments?.length || 0} Comments
                      </button>
                    </div>

                    
                    <button
                      onClick={() => navigate(`/admin/editblog/${blog._id}`)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-lg text-sm font-medium"
                    >
                      ✏ Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
