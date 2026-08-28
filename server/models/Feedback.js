import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    // ========================================
    // CUSTOMER INFORMATION
    // ========================================

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
    },

    source: {
      type: String,
      enum: [
        "Support Ticket",
        "App Review",
        "Survey",
        "Sales Note",
        "Other",
      ],
      default: "Other",
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    // ========================================
    // FEEDBACK STATUS
    // ========================================

    status: {
      type: String,
      enum: ["New", "Reviewed", "Resolved"],
      default: "New",
    },

    // ========================================
    // AI ANALYSIS
    // ========================================

    sentiment: {
      type: String,
      enum: ["Positive", "Negative", "Neutral"],
      default: "Neutral",
    },

    category: {
      type: String,
      enum: [
        "Bug",
        "Feature Request",
        "Complaint",
        "Praise",
        "Other",
      ],
      default: "Other",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    summary: {
      type: String,
      default: "",
      trim: true,
    },

    // ========================================
    // AI THEME
    // ========================================
    // Example:
    // "Dashboard Performance"
    // "Dark Mode"
    // "Image Upload"
    // "User Experience"

    theme: {
      type: String,
      default: "General",
      trim: true,
    },

    // ========================================
    // USER / WORKSPACE OWNER
    // ========================================
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model(
  "Feedback",
  feedbackSchema
);

export default Feedback;