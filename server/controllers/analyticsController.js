import Feedback from "../models/Feedback.js";

// ========================================
// ANALYTICS OVERVIEW
// ========================================
export const getAnalyticsOverview = async (req, res) => {
  try {
    console.log("🔥 Analytics Controller Hit");

    // ========================================
    // GET CURRENT USER FEEDBACK
    // ========================================

    const feedback = await Feedback.find({
      workspaceId: req.user.workspaceId,
    }).sort({
      createdAt: -1,
    });

    const totalFeedback = feedback.length;

    // ========================================
    // AVERAGE RATING
    // ========================================

    const ratings = feedback
      .filter(
        (item) =>
          typeof item.rating === "number"
      )
      .map((item) => item.rating);

    const averageRating =
      ratings.length > 0
        ? (
            ratings.reduce(
              (sum, rating) => sum + rating,
              0
            ) / ratings.length
          ).toFixed(1)
        : "0.0";

    // ========================================
    // SENTIMENT
    // ========================================

    const sentiment = {
      positive: feedback.filter(
        (item) =>
          item.sentiment === "Positive"
      ).length,

      negative: feedback.filter(
        (item) =>
          item.sentiment === "Negative"
      ).length,

      neutral: feedback.filter(
        (item) =>
          item.sentiment === "Neutral"
      ).length,
    };

    // ========================================
    // CATEGORY
    // ========================================

    const category = {
      bug: feedback.filter(
        (item) =>
          item.category === "Bug"
      ).length,

      featureRequest: feedback.filter(
        (item) =>
          item.category === "Feature Request"
      ).length,

      complaint: feedback.filter(
        (item) =>
          item.category === "Complaint"
      ).length,

      praise: feedback.filter(
        (item) =>
          item.category === "Praise"
      ).length,

      other: feedback.filter(
        (item) =>
          item.category === "Other"
      ).length,
    };

    // ========================================
    // PRIORITY
    // ========================================

    const priority = {
      high: feedback.filter(
        (item) =>
          item.priority === "High"
      ).length,

      medium: feedback.filter(
        (item) =>
          item.priority === "Medium"
      ).length,

      low: feedback.filter(
        (item) =>
          item.priority === "Low"
      ).length,
    };

    // ========================================
    // SOURCE
    // ========================================

    const sources = {
      supportTicket: feedback.filter(
        (item) =>
          item.source === "Support Ticket"
      ).length,

      appReview: feedback.filter(
        (item) =>
          item.source === "App Review"
      ).length,

      survey: feedback.filter(
        (item) =>
          item.source === "Survey"
      ).length,

      salesNote: feedback.filter(
        (item) =>
          item.source === "Sales Note"
      ).length,

      other: feedback.filter(
        (item) =>
          item.source === "Other"
      ).length,
    };

    // ========================================
    // RATING DISTRIBUTION
    // ========================================

    const ratingsDistribution = {
      one: ratings.filter(
        (rating) =>
          rating === 1
      ).length,

      two: ratings.filter(
        (rating) =>
          rating === 2
      ).length,

      three: ratings.filter(
        (rating) =>
          rating === 3
      ).length,

      four: ratings.filter(
        (rating) =>
          rating === 4
      ).length,

      five: ratings.filter(
        (rating) =>
          rating === 5
      ).length,
    };

    // ========================================
    // THEME ANALYTICS
    // ========================================

    const themeMap = {};

    feedback.forEach((item) => {
      const theme =
        item.theme &&
        item.theme.trim()
          ? item.theme.trim()
          : "General";

      // ========================================
      // CREATE THEME OBJECT
      // ========================================

      if (!themeMap[theme]) {
        themeMap[theme] = {
          theme,
          count: 0,

          // Sentiment
          positive: 0,
          negative: 0,
          neutral: 0,

          // Priority
          highPriority: 0,
          mediumPriority: 0,
          lowPriority: 0,
        };
      }

      // ========================================
      // TOTAL MENTIONS
      // ========================================

      themeMap[theme].count += 1;

      // ========================================
      // SENTIMENT COUNT
      // ========================================

      if (
        item.sentiment === "Positive"
      ) {
        themeMap[theme].positive += 1;
      }

      if (
        item.sentiment === "Negative"
      ) {
        themeMap[theme].negative += 1;
      }

      if (
        item.sentiment === "Neutral"
      ) {
        themeMap[theme].neutral += 1;
      }

      // ========================================
      // PRIORITY COUNT
      // ========================================

      if (
        item.priority === "High"
      ) {
        themeMap[theme].highPriority += 1;
      }

      if (
        item.priority === "Medium"
      ) {
        themeMap[theme].mediumPriority += 1;
      }

      if (
        item.priority === "Low"
      ) {
        themeMap[theme].lowPriority += 1;
      }
    });

    // ========================================
    // TOP THEMES + ACTIONABLE ANALYSIS
    // ========================================

    const topThemes = Object.values(
      themeMap
    )
      .map((theme) => {

        // ========================================
        // DOMINANT SENTIMENT
        // ========================================

        let dominantSentiment = "Neutral";

        if (
          theme.positive > theme.negative &&
          theme.positive > theme.neutral
        ) {
          dominantSentiment = "Positive";
        } else if (
          theme.negative > theme.positive &&
          theme.negative > theme.neutral
        ) {
          dominantSentiment = "Negative";
        }

        // ========================================
        // DOMINANT PRIORITY
        // ========================================

        let priority = "Low";

        if (theme.highPriority > 0) {
          priority = "High";
        } else if (
          theme.mediumPriority > 0
        ) {
          priority = "Medium";
        } else if (
          theme.lowPriority > 0
        ) {
          priority = "Low";
        }

        // ========================================
        // ACTION REQUIRED
        // ========================================

        const actionRequired =
          theme.negative > 0 ||
          theme.highPriority > 0;

        // ========================================
        // RETURN THEME DATA
        // ========================================

        return {
          theme: theme.theme,

          // Total mentions
          mentions: theme.count,

          // Sentiment
          positive: theme.positive,
          negative: theme.negative,
          neutral: theme.neutral,
          dominantSentiment,

          // Priority
          highPriority:
            theme.highPriority,

          mediumPriority:
            theme.mediumPriority,

          lowPriority:
            theme.lowPriority,

          priority,

          // Action
          actionRequired,
        };
      })
      .sort(
        (a, b) =>
          b.mentions - a.mentions
      )
      .slice(0, 10);

    // ========================================
    // THEME TRENDS
    // ========================================

    const themeTrendMap = {};

    feedback.forEach((item) => {
      const theme =
        item.theme &&
        item.theme.trim()
          ? item.theme.trim()
          : "General";

      const date = new Date(
        item.createdAt
      )
        .toISOString()
        .split("T")[0];

      if (!themeTrendMap[date]) {
        themeTrendMap[date] = {};
      }

      if (
        !themeTrendMap[date][theme]
      ) {
        themeTrendMap[date][theme] = 0;
      }

      themeTrendMap[date][theme] += 1;
    });

    // ========================================
    // FORMAT THEME TRENDS
    // ========================================

    const themeTrends = Object.entries(
      themeTrendMap
    )
      .sort(
        ([dateA], [dateB]) =>
          new Date(dateA) -
          new Date(dateB)
      )
      .map(
        ([date, themes]) => ({
          date,
          themes,
        })
      );
    // ========================================
// TREND SPIKE DETECTION
// ========================================

const themeSpikes = [];

const SPIKE_THRESHOLD = 50; // 50% increase

const sortedTrendDates = Object.keys(
  themeTrendMap
).sort(
  (a, b) =>
    new Date(a) - new Date(b)
);

for (let i = 1; i < sortedTrendDates.length; i++) {
  const currentDate = sortedTrendDates[i];
  const previousDate = sortedTrendDates[i - 1];

  const currentThemes =
    themeTrendMap[currentDate] || {};

  const previousThemes =
    themeTrendMap[previousDate] || {};

  const allThemes = new Set([
    ...Object.keys(currentThemes),
    ...Object.keys(previousThemes),
  ]);

  for (const theme of allThemes) {
    const currentCount =
      currentThemes[theme] || 0;

    const previousCount =
      previousThemes[theme] || 0;

    // Ignore themes that did not exist previously
    if (previousCount === 0) {
      continue;
    }

    const increasePercent =
      ((currentCount - previousCount) /
        previousCount) *
      100;

    if (
      increasePercent >=
      SPIKE_THRESHOLD
    ) {
      themeSpikes.push({
        theme,
        date: currentDate,
        currentCount,
        previousCount,
        increasePercent:
          Number(increasePercent.toFixed(2)),
        spike: true,
      });
    }
  }
}
    

    // ========================================
    // TOTAL UNIQUE THEMES
    // ========================================

    const totalThemes =
      Object.keys(themeMap).length;

    // ========================================
    // RESPONSE
    // ========================================

    res.status(200).json({
      success: true,

      data: {
        // ========================================
        // EXISTING ANALYTICS
        // ========================================

        totalFeedback,

        averageRating,

        sentiment,

        category,

        priority,

        sources,

        ratingsDistribution,

        // ========================================
        // THEME ANALYTICS
        // ========================================

        themeAnalytics: {
          totalThemes,
          topThemes,
          trends: themeTrends,
          spikes: themeSpikes
        },
      },
    });

  } catch (error) {

    console.error(
      "❌ Analytics Error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        "Failed to load analytics",
    });
  }
};