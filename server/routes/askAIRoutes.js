import express from "express";
import { askAI } from "../controllers/askAIController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/ask",
  authMiddleware,
  askAI
);

export default router;