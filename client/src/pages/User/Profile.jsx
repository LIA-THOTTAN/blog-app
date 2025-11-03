// client/src/pages/User/Profile.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function UserProfile() {
  const [user, setUser] = useState({ username: "", email: "" });
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

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
        username: res.data.user.username ?? prev.username,
        email: res.data.user.email ?? prev.email,
      }));

      // Update localStorage with new username
      const storedUser = JSON.parse(localStorage.getItem("user"));
      storedUser.username = res.data.user.username;
      localStorage.setItem("user", JSON.stringify(storedUser));

      setNewPassword("");
      setMessage("✅ Profile updated successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage(
        err?.response?.data?.message || "❌ Failed to update profile. Try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-100">
      {/* Sidebar */}
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
              className="px-3 py-2 rounded-lg hover:bg-gray-800 transition"
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
              className="px-3 py-2 rounded-lg bg-gray-800 transition"
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

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
          <h2 className="text-3xl font-bold text-center text-indigo-400 mb-6">
            My Profile
          </h2>

          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full text-4xl font-bold text-white shadow-lg">
              {user.username ? user.username[0].toUpperCase() : "U"}
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="text-gray-300 text-sm font-medium block mb-2">
                Name
              </label>
              <input
                type="text"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm font-medium block mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full p-3 rounded-md bg-gray-900 text-gray-400 border border-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-2">
                Email cannot be changed here.
              </p>
            </div>

            <div>
              <label className="text-gray-300 text-sm font-medium block mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter a new password (optional)"
                className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-2">
                Leave blank to keep current password
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition-all shadow-md"
            >
              Update Profile
            </button>

            {message && (
              <p className="text-center text-sm font-medium mt-3">{message}</p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}