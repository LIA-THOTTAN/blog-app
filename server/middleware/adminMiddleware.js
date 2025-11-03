// server/middleware/adminMiddleware.js

/**
 * Middleware: Check if user is an admin
 * Must be used AFTER protect middleware
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};