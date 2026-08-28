import Feedback from "../models/Feedback.js";
import { askFeedbackAI } from "../services/aiService.js";

// ========================================
// ASK AI
// ========================================

export const askAI = async (req, res) => {
  try {
    const { question } = req.body;

    // Validate question
    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // Get current user's feedback
    const feedback = await Feedback.find({
      workspaceId: req.user.workspaceId,
    }).sort({ createdAt: -1 });

    // No feedback
    if (feedback.length === 0) {
      return res.status(200).json({
        success: true,
        answer:
          "There is no customer feedback available yet.",
      });
    }

    // Ask Gemini
    const result = await askFeedbackAI(
      question.trim(),
      feedback
    );

    return res.status(200).json({
      success: true,
      question,
      answer: result.answer,
      citations: result.citations,
    });

  } catch (error) {
    console.error(
      "❌ Ask AI Controller Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to process AI question",
    });
  }
};