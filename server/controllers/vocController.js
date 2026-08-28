import Feedback from "../models/Feedback.js";
import { generateVOCReport } from "../services/aiService.js";
import PDFDocument from "pdfkit";

// ========================================
// GENERATE VOC REPORT
// ========================================

export const generateVOC = async (req, res) => {
  try {
    console.log("🔥 VOC Controller Hit");

    // Get current user's feedback
    const feedback = await Feedback.find({
      createdBy: req.user.userId,
    }).sort({ createdAt: -1 });

    // No feedback
    if (feedback.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No customer feedback available",
        data: null,
      });
    }

    console.log(
      `📊 Found ${feedback.length} feedback records`
    );

    // Generate VOC report using Gemini
    const report = await generateVOCReport(feedback);

    return res.status(200).json({
      success: true,
      message: "VOC report generated successfully",
      data: report,
    });

  } catch (error) {
    console.error(
      "❌ VOC Controller Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to generate VOC report",
      error: error.message,
    });
  }
};
// ========================================
// GENERATE VOC PDF
// ========================================

export const generateVOCPDF = async (req, res) => {
  try {
    console.log("🔥 VOC PDF Controller Hit");

    // Get current user's feedback
    const feedback = await Feedback.find({
      createdBy: req.user.userId,
    }).sort({ createdAt: -1 });

    if (feedback.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No customer feedback available",
      });
    }

    console.log(
      `📊 Found ${feedback.length} feedback records for PDF`
    );

    // Generate AI VOC report
    const report =
      await generateVOCReport(feedback);

    // Create PDF
    const doc = new PDFDocument({
      margin: 50,
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="LOOP-VOC-Report.pdf"'
    );

    doc.pipe(res);

    // ========================================
    // TITLE
    // ========================================

    doc
      .fontSize(24)
      .text("LOOP Voice of Customer Report", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(11)
      .text(
        `Generated on: ${new Date().toLocaleString()}`,
        {
          align: "center",
        }
      );

    doc.moveDown(2);

    // ========================================
    // EXECUTIVE SUMMARY
    // ========================================

    doc
      .fontSize(16)
      .text("Executive Summary");

    doc.moveDown(0.5);

    doc
      .fontSize(11)
      .text(
        report.executiveSummary ||
          "No summary available."
      );

    doc.moveDown(1.5);

    // ========================================
    // SENTIMENT
    // ========================================

    doc
      .fontSize(16)
      .text("Sentiment Overview");

    doc.moveDown(0.5);

    const sentiment =
      report.sentimentOverview || {};

    doc
      .fontSize(11)
      .text(
        `Positive: ${sentiment.positive || 0}`
      )
      .text(
        `Negative: ${sentiment.negative || 0}`
      )
      .text(
        `Neutral: ${sentiment.neutral || 0}`
      )
      .text(
        `Overall: ${
          sentiment.overall || "Unknown"
        }`
      );

    doc.moveDown(1.5);

    // ========================================
    // TOP ISSUES
    // ========================================

    doc
      .fontSize(16)
      .text("Top Issues");

    doc.moveDown(0.5);

    const topIssues =
      report.topIssues || [];

    if (topIssues.length === 0) {
      doc
        .fontSize(11)
        .text("No major issues identified.");
    } else {
      topIssues.forEach((item) => {
        doc
          .fontSize(11)
          .text(
            `• ${item.issue} — ${item.mentions} mentions — ${item.priority} priority`
          );
      });
    }

    doc.moveDown(1.5);

    // ========================================
    // FEATURE REQUESTS
    // ========================================

    doc
      .fontSize(16)
      .text("Feature Requests");

    doc.moveDown(0.5);

    const featureRequests =
      report.featureRequests || [];

    if (featureRequests.length === 0) {
      doc
        .fontSize(11)
        .text("No feature requests identified.");
    } else {
      featureRequests.forEach((item) => {
        doc
          .fontSize(11)
          .text(
            `• ${item.feature} — ${item.mentions} mentions`
          );
      });
    }

    doc.moveDown(1.5);

    // ========================================
    // CUSTOMER STRENGTHS
    // ========================================

    doc
      .fontSize(16)
      .text("Customer Strengths");

    doc.moveDown(0.5);

    const strengths =
      report.customerStrengths || [];

    if (strengths.length === 0) {
      doc
        .fontSize(11)
        .text("No strengths identified.");
    } else {
      strengths.forEach((item) => {
        doc
          .fontSize(11)
          .text(`• ${item}`);
      });
    }

    doc.moveDown(1.5);

    // ========================================
    // RECOMMENDED ACTIONS
    // ========================================

    doc
      .fontSize(16)
      .text("Recommended Actions");

    doc.moveDown(0.5);

    const actions =
      report.recommendedActions || [];

    if (actions.length === 0) {
      doc
        .fontSize(11)
        .text("No recommended actions.");
    } else {
      actions.forEach((item) => {
        doc
          .fontSize(11)
          .text(
            `• ${item.action} — ${item.priority} priority`
          )
          .text(
            `  Reason: ${item.reason}`
          )
          .moveDown(0.5);
      });
    }

    // ========================================
    // END PDF
    // ========================================

    doc.end();

  } catch (error) {
    console.error(
      "❌ VOC PDF Error:",
      error
    );

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message:
          "Failed to generate VOC PDF",
      });
    }
  }
};