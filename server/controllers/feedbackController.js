import Feedback from "../models/Feedback.js";
import { analyzeFeedback } from "../services/aiService.js";

// ========================================
// CREATE FEEDBACK + AI ANALYSIS
// ========================================
export const createFeedback = async (req, res) => {
  try {
    const {
      customerName,
      email,
      source,
      message,
      rating,
    } = req.body;

    // ========================================
    // VALIDATION
    // ========================================

    if (!customerName || !message) {
      return res.status(400).json({
        success: false,
        message:
          "Customer name and message are required",
      });
    }

    // ========================================
    // AI ANALYSIS
    // ========================================

    let aiResult;

    try {
      aiResult = await analyzeFeedback(message);

      console.log(
        "🤖 AI Analysis Result:",
        aiResult
      );
    } catch (aiError) {
      console.error(
        "❌ AI Analysis Failed:",
        aiError.message
      );

      // ========================================
      // FALLBACK VALUES
      // ========================================

      aiResult = {
        sentiment: "Neutral",
        category: "Other",
        priority: "Medium",
        theme: "General",
        summary: message.substring(0, 150),
      };
    }

    // ========================================
    // CREATE FEEDBACK
    // ========================================

    const feedback = await Feedback.create({
      customerName,
      email,
      source,
      message,
      rating,

      // ========================================
      // AI GENERATED DATA
      // ========================================

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

      // ========================================
      // USER
      // ========================================

      createdBy: req.user.userId,
      workspaceId: req.user.workspaceId,
    });

    // ========================================
    // RESPONSE
    // ========================================

    res.status(201).json({
      success: true,
      message: "Feedback created successfully",
      feedback,
    });

  } catch (error) {
    console.error(
      "❌ Create Feedback Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const ingestFeedback = async (req, res) => {
  try {
    const {
      customerName,
      email,
      source,
      message,
      rating,
    } = req.body;

    if (!customerName || !message || !source) {
      return res.status(400).json({
        success: false,
        message:
          "Customer name, source and message are required",
      });
    }

    let aiResult;

    try {
      aiResult = await analyzeFeedback(message);
    } catch (aiError) {
      console.error(
        "❌ Channel AI Analysis Failed:",
        aiError.message
      );

      aiResult = {
        sentiment: "Neutral",
        category: "Other",
        priority: "Medium",
        theme: "General",
        summary: message.substring(0, 150),
      };
    }

    const feedback = await Feedback.create({
      customerName,
      email: email || "",
      source,
      message,
      rating: rating ? Number(rating) : 5,

      status: "New",

      sentiment: aiResult.sentiment || "Neutral",
      category: aiResult.category || "Other",
      priority: aiResult.priority || "Medium",
      theme: aiResult.theme || "General",
      summary:
        aiResult.summary ||
        message.substring(0, 150),

      createdBy: req.user.userId,
      workspaceId: req.user.workspaceId,
    });

    return res.status(201).json({
      success: true,
      message: `${source} feedback ingested successfully`,
      feedback,
    });

  } catch (error) {
    console.error(
      "❌ Channel Ingestion Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to ingest feedback",
    });
  }
};
// ========================================
// GET ALL FEEDBACK
// WITH SEARCH + FILTERS
// ========================================
export const getFeedback = async (req, res) => {
  try {
    const {
      search,
      sentiment,
      category,
      priority,
      theme,
      source,
      status,
      rating,
      page = 1,
      limit = 10,
    } = req.query;
    
    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const skip = (pageNumber - 1) * limitNumber;
   

    // ========================================
    // BASE QUERY
    // ========================================

    const query = {
      workspaceId: req.user.workspaceId,
    };

    // ========================================
    // SEARCH
    // Search customer name, email and message
    // ========================================

    if (search && search.trim()) {
      const searchText = search.trim();

      query.$or = [
        {
          customerName: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          email: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          message: {
            $regex: searchText,
            $options: "i",
          },
        },
        {
          summary: {
            $regex: searchText,
            $options: "i",
          },
        },
      ];
    }

    // ========================================
    // SENTIMENT FILTER
    // ========================================

    if (sentiment && sentiment.trim()) {
      query.sentiment = sentiment.trim();
    }

    // ========================================
    // CATEGORY FILTER
    // ========================================

    if (category && category.trim()) {
      query.category = category.trim();
    }

    // ========================================
    // PRIORITY FILTER
    // ========================================

    if (priority && priority.trim()) {
      query.priority = priority.trim();
    }

    // ========================================
    // THEME FILTER
    // ========================================

    if (theme && theme.trim()) {
      query.theme = theme.trim();
    }

    // ========================================
    // SOURCE FILTER
    // ========================================

    if (source && source.trim()) {
      query.source = source.trim();
    }

    // ========================================
    // STATUS FILTER
    // ========================================

    if (status && status.trim()) {
      query.status = status.trim();
    }

    // ========================================
    // RATING FILTER
    // ========================================

    if (rating) {
      const ratingNumber = Number(rating);

      if (
        !Number.isNaN(ratingNumber) &&
        ratingNumber >= 1 &&
        ratingNumber <= 5
      ) {
        query.rating = ratingNumber;
      }
    }

    // ========================================
    // DEBUG
    // ========================================

    console.log(
      "🔎 Feedback Query:",
      query
    );

    // ========================================
    // GET FILTERED FEEDBACK
    // ========================================

    const [feedback, total] = await Promise.all([
      Feedback.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
    
      Feedback.countDocuments(query),
    ]);

    // ========================================
    // RESPONSE
    // ========================================

    res.status(200).json({
      success: true,
      count: feedback.length,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      hasNextPage: pageNumber < Math.ceil(total / limitNumber),
      hasPreviousPage: pageNumber > 1,
    
      filters: {
        search: search || "",
        sentiment: sentiment || "",
        category: category || "",
        priority: priority || "",
        theme: theme || "",
        source: source || "",
        status: status || "",
        rating: rating || "",
      },
    
      feedback,
    });

  } catch (error) {
    console.error(
      "❌ Get Feedback Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================
// GET SINGLE FEEDBACK
// ========================================
export const getSingleFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({
      _id: req.params.id,
      workspaceId: req.user.workspaceId,
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      feedback,
    });

  } catch (error) {
    console.error(
      "❌ Get Single Feedback Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ========================================
// GET FEEDBACK BY THEME
// ========================================
export const getFeedbackByTheme = async (req, res) => {
  try {
    const { theme } = req.query;

    // ========================================
    // VALIDATE THEME
    // ========================================

    if (!theme || !theme.trim()) {
      return res.status(400).json({
        success: false,
        message: "Theme is required",
      });
    }

    // ========================================
    // FIND THEME FEEDBACK
    // ========================================

    const feedback = await Feedback.find({
      workspaceId: req.user.workspaceId,
      theme: theme.trim(),
    }).sort({
      createdAt: -1,
    });

    // ========================================
    // RESPONSE
    // ========================================

    res.status(200).json({
      success: true,
      theme: theme.trim(),
      count: feedback.length,
      feedback,
    });

  } catch (error) {
    console.error(
      "❌ Get Feedback By Theme Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load theme feedback",
    });
  }
};

// ========================================
// UPDATE FEEDBACK
// ========================================
export const updateFeedback = async (req, res) => {
  try {
    console.log("🔥 UPDATE HIT");
    console.log("ID:", req.params.id);
    console.log("USER:", req.user);
    console.log("BODY:", req.body);

    const {
      customerName,
      email,
      source,
      message,
      rating,
      status,
      sentiment,
      category,
      priority,
      theme,
      summary,
    } = req.body;
    
    const feedback = await Feedback.findOneAndUpdate(
      {
        _id: req.params.id,
        workspaceId: req.user.workspaceId,
      },
      {
        customerName,
        email,
        source,
        message,
        rating,
        status,
        sentiment,
        category,
        priority,
        theme,
        summary,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    console.log("RESULT:", feedback);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feedback updated successfully",
      feedback,
    });

  } catch (error) {
    console.error("❌ UPDATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// DELETE FEEDBACK
// ========================================
export const deleteFeedback = async (req, res) => {
  try {
    const feedback =
      await Feedback.findOneAndDelete({
        _id: req.params.id,
        workspaceId: req.user.workspaceId
       
      });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });

  } catch (error) {
    console.error(
      "❌ Delete Feedback Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};