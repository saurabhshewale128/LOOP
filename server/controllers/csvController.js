import { parse } from "csv-parse/sync";
import Feedback from "../models/Feedback.js";
import { analyzeFeedback } from "../services/aiService.js";
// ========================================
// UPLOAD FEEDBACK CSV
// ========================================
export const uploadFeedbackCSV = async (req, res) => {
  try {
    // ========================================
    // CHECK FILE
    // ========================================
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    // ========================================
    // READ CSV
    // ========================================
    const csvText = req.file.buffer.toString("utf-8");

    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (!records.length) {
      return res.status(400).json({
        success: false,
        message: "CSV file is empty",
      });
    }

    // ========================================
    // PROCESS CSV RECORDS
    // ========================================
    const feedbackData = [];

    for (const row of records) {
      // Skip invalid rows
      if (!row.customerName || !row.message) {
        continue;
      }

      const customerName = row.customerName.trim();
      const email = row.email?.trim() || "";
      const source = row.source?.trim() || "CSV Import";
      const message = row.message.trim();

      const rating = row.rating
        ? Number(row.rating)
        : 5;

      // ========================================
      // AI ANALYSIS
      // ========================================
      let aiResult;

      try {
        aiResult = await analyzeFeedback(message);

        console.log(
          `🤖 AI Analysis completed for: ${customerName}`
        );

      } catch (aiError) {
        console.error(
          `❌ AI Analysis failed for ${customerName}:`,
          aiError.message
        );

        // Fallback values
        aiResult = {
          sentiment: "Neutral",
          category: "Other",
          priority: "Medium",
          theme: "General",
          summary: message.substring(0, 150),
        };
      }

      // ========================================
      // PREPARE FEEDBACK
      // ========================================
      feedbackData.push({
        customerName,
        email,
        source,
        message,
        rating,

        status: "New",

        sentiment:
          aiResult.sentiment || "Neutral",

        category:
          aiResult.category || "Other",

        priority:
          aiResult.priority || "Medium",

        theme:
          aiResult.theme || "General",

        summary:
          aiResult.summary ||
          message.substring(0, 150),

        createdBy: req.user.userId,
        workspaceId: req.user.workspaceId,
      });
    }

    // ========================================
    // VALIDATION
    // ========================================
    if (!feedbackData.length) {
      return res.status(400).json({
        success: false,
        message:
          "No valid feedback records found in CSV",
      });
    }

    // ========================================
    // SAVE TO MONGODB
    // ========================================
    const feedback =
      await Feedback.insertMany(feedbackData);

    // ========================================
    // SUCCESS
    // ========================================
    return res.status(201).json({
      success: true,
      message: `${feedback.length} feedback records imported successfully`,
      count: feedback.length,
      feedback,
    });

  } catch (error) {
    console.error(
      "❌ CSV Upload Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};