import express from "express";
import { getStats } from "../controllers/adminController.js";
import { protect,adminOnly} from "../middleware/authMiddleware.js";
import { getAllUsers, rejectUser, unrejectUser } from "../controllers/adminController.js";

const router = express.Router();
router.get("/stats", protect, getStats);
router.get("/users", protect, adminOnly, getAllUsers);
router.put("/users/reject/:id", protect, adminOnly, rejectUser);
router.put("/users/unreject/:id", protect, adminOnly, unrejectUser);

export default router;
