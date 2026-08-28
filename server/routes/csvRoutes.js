import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  uploadFeedbackCSV,
} from "../controllers/csvController.js";

const router = express.Router();

// ========================================
// UPLOAD FEEDBACK CSV
// POST /api/csv/feedback
// ========================================

router.post(
  "/feedback",
  authMiddleware,
  upload.single("file"),
  uploadFeedbackCSV
);

export default router;