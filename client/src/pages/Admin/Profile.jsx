import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState({ username: "", email: "" });
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser({
          username: res.data.username || "",
          email: res.data.email || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
        setMessage("Failed to load profile. Please login again.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const payload = { username: user.username };
      if (newPassword && newPassword.trim().length > 0) {
        payload.newPassword = newPassword;
      }

      const res = await axios.put(
        "http://localhost:5000/api/profile",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser((prev) => ({
        ...prev,
        username: res.data.username ?? prev.username,
        email: res.data.email ?? prev.email,
      }));
      setNewPassword("");
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage(
        err?.response?.data?.message || "Failed to update profile. Try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
    
      <aside className="w-64 bg-[#0b1120] p-6 flex flex-col justify-between border-r border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-indigo-400 mb-8">BlogSpace</h1>

          <nav className="space-y-4">
            <Link
              to="/admin/dashboard"
              className="block text-gray-300 hover:text-white transition"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/myblogs"
              className="block text-gray-300 hover:text-white transition"
            >
              My Blogs
            </Link>
            <Link
              to="/admin/createblog"
              className="block text-gray-300 hover:text-white transition"
            >
              Create Blog
            </Link>
            <Link
              to="/admin/users"
              className="block text-gray-300 hover:text-white transition"
            >
              User Management
            </Link>
            <Link
              to="/admin/blogmanagement"
              className="block text-gray-300 hover:text-white transition"
            >
              Blog Management
            </Link>
            <Link
              to="/admin/profile"
              className="block text-gray-300 hover:text-white transition"
            >
              Profile
            </Link>
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

     
      <main className="flex-1 flex justify-center items-center p-8">
        <div className="bg-[#1e293b] p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-blue-400 mb-6">
            My Profile
          </h2>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 flex items-center justify-center bg-gray-700 rounded-full text-3xl font-bold text-white">
              {user.username ? user.username[0].toUpperCase() : "U"}
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm">Name</label>
              <input
                type="text"
                value={user.username}
                onChange={(e) =>
                  setUser({ ...user, username: e.target.value })
                }
                className="w-full p-3 mt-1 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm">Email Address</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full p-3 mt-1 rounded-md bg-gray-700 text-gray-300 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">
                Email cannot be changed here.
              </p>
            </div>

            <div>
              <label className="text-gray-300 text-sm">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter a new password (leave blank to keep current)"
                className="w-full p-3 mt-1 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition-all"
            >
              Update Profile
            </button>

            {message && (
              <p className="text-center text-sm text-gray-300 mt-3">{message}</p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
