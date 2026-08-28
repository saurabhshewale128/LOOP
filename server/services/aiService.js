import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// ========================================
// GEMINI CLIENT
// ========================================

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env");
} else {
  console.log("✅ GEMINI_API_KEY loaded");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ========================================
// CLEAN JSON RESPONSE
// ========================================

const cleanJSON = (text) => {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
};

// ========================================
// GEMINI GENERATE WITH FALLBACK
// ========================================

const generateWithFallback = async (prompt) => {
  try {
    console.log("🤖 Trying Gemini 3.5 Flash...");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return response;

  } catch (primaryError) {

    console.error(
      "⚠️ Primary Gemini model failed:",
      primaryError.message
    );

    console.log(
      "🔄 Trying Gemini 3.5 Flash Lite..."
    );

    try {

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
      });

      return response;

    } catch (fallbackError) {

      console.error(
        "❌ Gemini fallback model also failed:",
        fallbackError.message
      );

      throw fallbackError;
    }
  }
};

// ========================================
// ANALYZE SINGLE FEEDBACK
// ========================================

export const analyzeFeedback = async (message) => {
  try {

    if (!message || !message.trim()) {
      throw new Error(
        "Feedback message is required"
      );
    }

    const prompt = `
You are an AI customer feedback analyst for LOOP.

Analyze the following customer feedback:

"${message}"

Return ONLY valid JSON in this exact format:

{
  "sentiment": "Positive | Negative | Neutral",
  "category": "Bug | Feature Request | Complaint | Praise | Other",
  "priority": "Low | Medium | High",
  "theme": "Short meaningful theme name",
  "summary": "Short summary of the feedback"
}

========================
THEME RULES
========================

- Create a short and meaningful theme based on the main topic.
- Use 2 to 4 words whenever possible.
- Similar feedback must use the same theme name.
- Keep theme names consistent.
- Do not create unnecessary variations.

Examples:

"The dashboard is very slow"
Theme: "Dashboard Performance"

"Dashboard takes too long to load"
Theme: "Dashboard Performance"

"Please add dark mode"
Theme: "Dark Mode"

"I want a dark theme"
Theme: "Dark Mode"

"App crashes when uploading large images"
Theme: "Image Upload"

"Application crashes while uploading image"
Theme: "Image Upload"

"I love this application"
Theme: "Overall Satisfaction"

========================
RULES
========================

- Do not add markdown.
- Do not add explanations.
- Return JSON only.
`;

    console.log(
      "🤖 Analyzing feedback with Gemini..."
    );

    const response =
      await generateWithFallback(prompt);

    const text = response.text?.trim();

    if (!text) {
      throw new Error(
        "Gemini returned an empty response"
      );
    }

    console.log(
      "🤖 Gemini Raw Response:",
      text
    );

    const cleanedText = cleanJSON(text);

    const result = JSON.parse(cleanedText);

    console.log(
      "🤖 AI Analysis Result:",
      result
    );

    return result;

  } catch (error) {

    console.error(
      "❌ AI Analysis Error:",
      error
    );

    throw error;
  }
};

// ========================================
// ASK AI ABOUT CUSTOMER FEEDBACK
// ========================================
export const askFeedbackAI = async (
  question,
  feedbackData
) => {
  try {
    if (!question || !question.trim()) {
      throw new Error("Question is required");
    }

    if (!Array.isArray(feedbackData)) {
      throw new Error(
        "Feedback data must be an array"
      );
    }

    if (feedbackData.length === 0) {
      return {
        answer:
          "There is no customer feedback available yet.",
        citations: [],
      };
    }

    // ========================================
    // PREPARE FEEDBACK DATA
    // ========================================

    const feedbackText = feedbackData
      .map(
        (item, index) => `
Feedback ${index + 1}:
ID: ${item._id}
Customer: ${item.customerName || "Unknown"}
Source: ${item.source || "Unknown"}
Message: ${item.message || "No message"}
Rating: ${item.rating ?? "Not given"}
Sentiment: ${item.sentiment || "Unknown"}
Category: ${item.category || "Unknown"}
Priority: ${item.priority || "Unknown"}
Theme: ${item.theme || "General"}
Summary: ${item.summary || "Not available"}
`
      )
      .join("\n");

    // ========================================
    // ASK LOOP PROMPT
    // ========================================

    const prompt = `
You are LOOP AI, a customer feedback intelligence assistant.

Answer the user's question using ONLY the customer feedback data provided below.

========================
CUSTOMER FEEDBACK DATA
========================

${feedbackText}

========================
USER QUESTION
========================

${question}

========================
RULES
========================

- Use ONLY the provided feedback data.
- Do not invent facts, customers, feedback, numbers, or sources.
- If the data does not contain enough information, clearly say so.
- Keep the answer concise and useful.
- Identify which feedback records support your answer.
- Citation IDs MUST be copied exactly from the provided feedback IDs.
- Only cite feedback that is actually relevant to the answer.

Return ONLY valid JSON in exactly this format:

{
  "answer": "Your answer based only on the provided feedback.",
  "citationIds": ["feedback_id_1", "feedback_id_2"]
}
`;

    console.log(
      "🤖 Sending grounded question to Gemini..."
    );

    const response =
      await generateWithFallback(prompt);

    const text = response.text?.trim();

    if (!text) {
      throw new Error(
        "Gemini returned an empty answer"
      );
    }

    console.log(
      "🤖 LOOP AI Raw Response:",
      text
    );

    const cleanedText = cleanJSON(text);

    const result = JSON.parse(cleanedText);

    const validIds = new Set(
      feedbackData.map(
        (item) => String(item._id)
      )
    );

    const citationIds = Array.isArray(
      result.citationIds
    )
      ? result.citationIds.filter((id) =>
          validIds.has(String(id))
        )
      : [];

    const citations = feedbackData
      .filter((item) =>
        citationIds.includes(
          String(item._id)
        )
      )
      .map((item) => ({
        id: String(item._id),
        customerName:
          item.customerName || "Unknown",
        source:
          item.source || "Unknown",
        message:
          item.message || "",
        rating:
          item.rating ?? null,
        sentiment:
          item.sentiment || "Unknown",
        theme:
          item.theme || "General",
      }));

    return {
      answer:
        result.answer ||
        "I could not generate an answer from the available feedback.",
      citations,
    };

  } catch (error) {
    console.error(
      "❌ Ask AI Error:",
      error
    );

    throw error;
  }
};
//========================================
// GENERATE VOICE OF CUSTOMER REPORT
// ========================================

export const generateVOCReport = async (
  feedbackData
) => {
  try {

    if (!Array.isArray(feedbackData)) {
      throw new Error(
        "Feedback data must be an array"
      );
    }

    if (feedbackData.length === 0) {
      throw new Error(
        "No customer feedback available for VOC report"
      );
    }

    // ========================================
    // PREPARE FEEDBACK DATA
    // ========================================

    const feedbackText = feedbackData
      .map(
        (item, index) => `
Feedback ${index + 1}:
Customer: ${item.customerName || "Unknown"}
Source: ${item.source || "Unknown"}
Message: ${item.message || "No message"}
Rating: ${item.rating ?? "Not given"}
Sentiment: ${item.sentiment || "Unknown"}
Category: ${item.category || "Unknown"}
Priority: ${item.priority || "Unknown"}
Theme: ${item.theme || "General"}
Summary: ${item.summary || "Not available"}
`
      )
      .join("\n");

    // ========================================
    // VOC PROMPT
    // ========================================

    const prompt = `
You are LOOP AI, a professional Voice-of-Customer intelligence assistant.

Analyze the following customer feedback data and generate a professional Voice-of-Customer report.

========================
CUSTOMER FEEDBACK DATA
========================

${feedbackText}

========================
REPORT REQUIREMENTS
========================

Return ONLY valid JSON.

Use exactly this structure:

{
  "executiveSummary": "Short overall summary of customer feedback",

  "sentimentOverview": {
    "positive": 0,
    "negative": 0,
    "neutral": 0,
    "overall": "Positive | Negative | Neutral | Mixed"
  },

  "topIssues": [
    {
      "issue": "Issue name",
      "mentions": 0,
      "priority": "High | Medium | Low"
    }
  ],

  "featureRequests": [
    {
      "feature": "Feature name",
      "mentions": 0
    }
  ],

  "customerStrengths": [
    "Positive point from customer feedback"
  ],

  "recommendedActions": [
    {
      "action": "Recommended action",
      "reason": "Why this action is recommended",
      "priority": "High | Medium | Low"
    }
  ]
}

========================
RULES
========================

- Use ONLY the provided customer feedback.
- Do not invent customer feedback.
- Do not assume information that is not present.
- Count sentiment accurately.
- Count repeated issues when possible.
- If there are no complaints or issues, return an empty topIssues array.
- If there are no feature requests, return an empty featureRequests array.
- If there are no positive points, return an empty customerStrengths array.
- If there are no recommended actions, return an empty recommendedActions array.
- Keep the report concise and professional.
- Return valid JSON only.
- Do not use markdown.
`;

    console.log(
      "🤖 Generating VOC Report..."
    );

    // ========================================
    // GEMINI WITH FALLBACK
    // ========================================

    const response =
      await generateWithFallback(prompt);

    // ========================================
    // READ RESPONSE
    // ========================================

    const text = response.text?.trim();

    if (!text) {
      throw new Error(
        "Gemini returned an empty VOC response"
      );
    }

    console.log(
      "🤖 VOC Raw Response:",
      text
    );

    // ========================================
    // CLEAN JSON
    // ========================================

    const cleanedText = cleanJSON(text);

    // ========================================
    // PARSE JSON
    // ========================================

    const report = JSON.parse(cleanedText);

    console.log(
      "🤖 VOC Report Generated Successfully"
    );

    return report;

  } catch (error) {

    console.error(
      "❌ VOC Report Error:",
      error
    );

    throw error;
  }
};