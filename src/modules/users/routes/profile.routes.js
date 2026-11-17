import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createProfile,
  getAllProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
  searchProfiles,
} from "../controllers/profile.controller.js";

const router = Router();

// Create a new profile
router.post("/",authMiddleware, createProfile);

// Get all profiles
router.get("/",authMiddleware, getAllProfiles);

// Search profiles by name or email
router.get("/search", authMiddleware, searchProfiles);

// Get profile by ID
router.get("/:id", authMiddleware, getProfileById);

// Update profile by ID
router.put("/:id", authMiddleware, updateProfile);

// Delete profile by ID
router.delete("/:id", authMiddleware, deleteProfile);

export default router;
