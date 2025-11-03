import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";

// ================= ADMIN COMPONENTS =================
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserManagement from "./pages/Admin/UserManagement";
import BlogManagement from "./pages/Admin/BlogManagement";
import AdminMyBlogs from "./pages/Admin/MyBlogs";
import AdminCreateBlog from "./pages/Admin/CreateBlog";
import AdminProfile from "./pages/Admin/Profile";
import AdminBlogDetails from "./pages/Admin/BlogDetails";
import AdminEditBlog from "./pages/Admin/EditBlog";   // ✅ Admin Edit Blog

// ================= USER COMPONENTS =================
import UserDashboard from "./pages/User/UserDashboard";
import UserMyBlogs from "./pages/User/MyBlogs";
import UserCreateBlog from "./pages/User/CreateBlog";
import UserProfile from "./pages/User/Profile";
import UserBlogDetails from "./pages/User/BlogDetails";
import UserEditBlog from "./pages/User/EditBlog";     // ✅ User Edit Blog

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/myblogs"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminMyBlogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/createblog"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminCreateBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blog/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminBlogDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blogmanagement"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <BlogManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/editblog/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminEditBlog /> {/* ✅ Admin page */}
            </ProtectedRoute>
          }
        />

        {/* ================= USER ROUTES ================= */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/myblogs"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserMyBlogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/createblog"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserCreateBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/blog/:id"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserBlogDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/editblog/:id"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserEditBlog /> {/* ✅ User page */}
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}
