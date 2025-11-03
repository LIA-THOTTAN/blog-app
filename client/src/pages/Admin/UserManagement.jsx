import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserX, UserCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const UserManagement = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const users = res.data;
      setActiveUsers(users.filter((u) => u.status === "active"));
      setRejectedUsers(users.filter((u) => u.status === "rejected"));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this user?")) return;
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/reject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };

  const handleUnreject = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/unreject/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (error) {
      console.error("Error restoring user:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full mx-auto mb-4"></div>
          Loading users...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-gray-100">
      {/* ✅ Sidebar */}
      <aside className="w-64 bg-[#0b1221] p-6 flex flex-col justify-between shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-indigo-400 mb-10">BlogSpace</h2>
          <nav className="space-y-5">
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
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-semibold transition"
        >
          Logout
        </button>
      </aside>

      {/* ✅ Main Content */}
      <main className="flex-1 p-8 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <h1 className="text-3xl font-bold text-indigo-400 mb-6">
          User Management
        </h1>

        {/* Active Users */}
        <div className="mb-10">
          <h2 className="text-2xl text-green-400 mb-3 flex items-center gap-2">
            <UserCheck /> Active Users
          </h2>
          <div className="overflow-x-auto bg-gray-800 border border-gray-700 rounded-xl">
            <table className="min-w-full text-left">
              <thead className="bg-gray-700 text-gray-300">
                <tr>
                  <th className="p-3">Username</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {activeUsers.length > 0 ? (
                  activeUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t border-gray-700 hover:bg-gray-700/40"
                    >
                      <td className="p-3">{user.username}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3 capitalize">{user.role}</td>
                      <td className="p-3">{user.status}</td>
                      <td className="p-3 text-center">
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleReject(user._id)}
                            className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-lg text-sm"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center text-gray-400 py-6 italic"
                    >
                      No active users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rejected Users */}
        <div>
          <h2 className="text-2xl text-red-400 mb-3 flex items-center gap-2">
            <UserX /> Rejected Users
          </h2>
          <div className="overflow-x-auto bg-gray-800 border border-gray-700 rounded-xl">
            <table className="min-w-full text-left">
              <thead className="bg-gray-700 text-gray-300">
                <tr>
                  <th className="p-3">Username</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {rejectedUsers.length > 0 ? (
                  rejectedUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t border-gray-700 hover:bg-gray-700/40"
                    >
                      <td className="p-3">{user.username}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3 capitalize">{user.role}</td>
                      <td className="p-3">{user.status}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleUnreject(user._id)}
                          className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded-lg text-sm"
                        >
                          Unreject
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center text-gray-400 py-6 italic"
                    >
                      No rejected users.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
