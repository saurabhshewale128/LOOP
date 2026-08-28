import express from "express";

import { generateVOC, generateVOCPDF } from "../controllers/vocController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET VOC Report
router.get(
  "/report",
  authMiddleware,
  generateVOC
);
// GET VOC PDF

router.get(
  "/report/pdf",
  authMiddleware,
  generateVOCPDF
);

export default router;