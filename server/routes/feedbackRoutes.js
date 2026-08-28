import express from "express";

import {
  createFeedback,
  ingestFeedback,
  getFeedback,
  getSingleFeedback,
  getFeedbackByTheme,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedbackController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// ========================================
// CREATE FEEDBACK
// POST /api/feedback
// ========================================

router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin", "analyst"),
  createFeedback
);

// ========================================
// SIMULATED CHANNEL INGESTION
// POST /api/feedback/ingest
// ========================================

router.post(
  "/ingest",
  authMiddleware,
  authorizeRoles("admin", "analyst"),
  ingestFeedback
);

// ========================================
// GET ALL FEEDBACK
// GET /api/feedback
// ========================================

router.get(
  "/",
  authMiddleware,
  getFeedback
);

// ========================================
// GET FEEDBACK BY THEME
// GET /api/feedback/theme?theme=Dashboard%20Performance
// ========================================

router.get(
  "/theme",
  authMiddleware,
  getFeedbackByTheme
);

// ========================================
// GET SINGLE FEEDBACK
// GET /api/feedback/:id
// ========================================

router.get(
  "/:id",
  authMiddleware,
  getSingleFeedback
);

// ========================================
// UPDATE FEEDBACK
// PUT /api/feedback/:id
// ========================================

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "analyst"),
  updateFeedback
);

// ========================================
// DELETE FEEDBACK
// DELETE /api/feedback/:id
// ========================================

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteFeedback
);

export default router;