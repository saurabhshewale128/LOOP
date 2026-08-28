import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";

import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";

const AskAI = () => {
  const navigate = useNavigate();

  // ========================================
  // STATES
  // ========================================

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [loading, setLoading] = useState(false);

  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");

  // ========================================
  // FETCH ANALYTICS
  // ========================================

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      setAnalyticsError("");

      const response = await api.get("/analytics/overview");

      console.log("📊 Analytics Response:", response.data);

      setAnalytics(response.data?.data || null);
    } catch (error) {
      console.error(
        "❌ Analytics Error:",
        error.response?.data || error.message
      );

      setAnalyticsError(
        error.response?.data?.message ||
          "Unable to load analytics."
      );
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // ========================================
  // ASK AI
  // ========================================

  const handleAskAI = async () => {
    // Prevent duplicate request
    if (loading) return;

    // Validate question
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    try {
      setLoading(true);
      setAnswer("");

      console.log("🚀 Sending Ask AI request...");
      console.log("❓ Question:", question.trim());

      const response = await api.post("/ai/ask", {
        question: question.trim(),
      });

      console.log("✅ Ask AI Response:", response);
      console.log("📦 Response Data:", response.data);

      // Backend currently returns:
      // {
      //   success: true,
      //   question: "...",
      //   answer: "..."
      // }

      const aiAnswer =
        response.data?.answer ||
        response.data?.data?.answer ||
        response.data?.data ||
        "";

      if (!aiAnswer) {
        throw new Error(
          "AI response was empty."
        );
      }

      setAnswer(aiAnswer);

      toast.success(
        "AI response generated!"
      );
    } catch (error) {
      console.error(
        "❌ Ask AI Error:",
        error
      );

      console.error(
        "❌ Error Response:",
        error.response?.data
      );

      console.error(
        "❌ Error Status:",
        error.response?.status
      );

      // Try to display answer if backend
      // returned one with an error response
      const fallbackAnswer =
        error.response?.data?.answer ||
        error.response?.data?.data?.answer;

      if (fallbackAnswer) {
        setAnswer(fallbackAnswer);

        toast.success(
          "AI response generated!"
        );
      } else {
        setAnswer("");

        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to get AI response"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // CLEAR ANSWER
  // ========================================

  const handleClear = () => {
    setQuestion("");
    setAnswer("");
  };

  // ========================================
  // SUGGESTED QUESTIONS
  // ========================================

  const suggestedQuestions = [
    "What are the most common complaints from customers?",
    "What features are customers requesting?",
    "What are the biggest problems customers are facing?",
    "How many customers reported bugs?",
    "What are the most critical issues?",
    "What do customers like most about the product?",
  ];

  // ========================================
  // COMPONENT
  // ========================================

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-8">

      <div className="max-w-4xl mx-auto">

        {/* ========================================
            BACK BUTTON
        ======================================== */}

        <button
          onClick={() => navigate("/ai")}
          className="mb-5 text-blue-600 hover:text-blue-800 font-medium transition"
        >
          ← Back to AI Features
        </button>


        {/* ========================================
            HEADER
        ======================================== */}

        <div className="bg-white rounded-xl shadow p-5 sm:p-6 mb-6">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
              🤖
            </div>

            <div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Ask AI
              </h1>

              <p className="text-slate-500 mt-1">
                Ask questions about your customer feedback
              </p>

            </div>

          </div>

        </div>


        {/* ========================================
            ANALYTICS ERROR
        ======================================== */}

        {analyticsError ? (

          <div className="bg-white rounded-xl shadow mb-6">

            <ErrorState
              message={analyticsError}
              onRetry={fetchAnalytics}
            />

          </div>

        ) : analyticsLoading ? (

          /* ========================================
              ANALYTICS LOADING
          ======================================== */

          <div className="bg-white rounded-xl shadow mb-6">

            <Loading
              message="Loading feedback insights..."
            />

          </div>

        ) : analytics ? (

          /* ========================================
              DYNAMIC INSIGHT CARDS
          ======================================== */

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

            {/* TOTAL FEEDBACK */}

            <div className="bg-white rounded-xl shadow p-5 border border-slate-100 hover:shadow-md transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Total Feedback
                  </p>

                  <h3 className="text-3xl font-bold text-slate-900 mt-1">
                    {analytics.totalFeedback ?? 0}
                  </h3>

                </div>

                <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
                  📊
                </div>

              </div>

            </div>


            {/* AVERAGE RATING */}

            <div className="bg-white rounded-xl shadow p-5 border border-slate-100 hover:shadow-md transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Average Rating
                  </p>

                  <h3 className="text-3xl font-bold text-slate-900 mt-1">

                    {analytics.averageRating ?? 0}

                    <span className="text-base text-slate-400 ml-1">
                      /5
                    </span>

                  </h3>

                </div>

                <div className="w-11 h-11 bg-yellow-100 rounded-xl flex items-center justify-center text-xl">
                  ⭐
                </div>

              </div>

            </div>


            {/* POSITIVE */}

            <div className="bg-white rounded-xl shadow p-5 border border-slate-100 hover:shadow-md transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Positive
                  </p>

                  <h3 className="text-3xl font-bold text-green-600 mt-1">
                    {analytics.sentiment?.positive ?? 0}
                  </h3>

                </div>

                <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center text-xl">
                  😊
                </div>

              </div>

            </div>


            {/* NEGATIVE */}

            <div className="bg-white rounded-xl shadow p-5 border border-slate-100 hover:shadow-md transition">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    Negative
                  </p>

                  <h3 className="text-3xl font-bold text-red-600 mt-1">
                    {analytics.sentiment?.negative ?? 0}
                  </h3>

                </div>

                <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center text-xl">
                  😞
                </div>

              </div>

            </div>

          </div>

        ) : null}


        {/* ========================================
            ASK AI CARD
        ======================================== */}

        <div className="bg-white rounded-xl shadow p-5 sm:p-6">

          {/* QUESTION LABEL */}

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Ask your question
          </label>


          {/* QUESTION INPUT */}

          <textarea
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            onKeyDown={(e) => {

              if (
                e.key === "Enter" &&
                (e.ctrlKey || e.metaKey)
              ) {
                handleAskAI();
              }

            }}
            placeholder="Example: What are the most common complaints from customers?"
            rows={5}
            disabled={loading}
            className="w-full border border-slate-300 rounded-lg p-4 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition disabled:bg-slate-100 disabled:cursor-not-allowed"
          />


          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-4">

            {question && !loading && (

              <button
                onClick={handleClear}
                className="w-full sm:w-auto border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-lg font-semibold transition"
              >
                Clear
              </button>

            )}


            <button
              onClick={handleAskAI}
              disabled={
                loading ||
                !question.trim()
              }
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >

              {loading ? (

                <>
                  <span className="animate-pulse">
                    🤔
                  </span>

                  Thinking...
                </>

              ) : (

                <>
                  <span>
                    🤖
                  </span>

                  Ask AI
                </>

              )}

            </button>

          </div>


          {/* ========================================
              LOADING MESSAGE
          ======================================== */}

          {loading && (

            <div className="mt-6">

              <Loading
                message="LOOP AI is analyzing your customer feedback..."
              />

            </div>

          )}


          {/* ========================================
              AI ANSWER
          ======================================== */}

          {!loading && answer && (

            <div className="mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

              {/* AI HEADER */}

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 sm:px-6 py-4">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xl shrink-0">
                    🤖
                  </div>

                  <div>

                    <h2 className="text-lg font-bold text-white">
                      LOOP AI Insights
                    </h2>

                    <p className="text-blue-100 text-sm">
                      Analysis based on your customer feedback
                    </p>

                  </div>

                </div>

              </div>


              {/* AI ANSWER CONTENT */}

              <div className="p-5 sm:p-6">

                <div className="flex items-start gap-3">

                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    💡
                  </div>


                  <div className="text-slate-700 leading-relaxed flex-1 min-w-0">

                    <ReactMarkdown
                      components={{

                        p: ({ children }) => (
                          <p className="mb-4">
                            {children}
                          </p>
                        ),

                        strong: ({ children }) => (
                          <strong className="font-bold text-slate-900">
                            {children}
                          </strong>
                        ),

                        ul: ({ children }) => (
                          <ul className="list-disc ml-6 mb-4 space-y-2">
                            {children}
                          </ul>
                        ),

                        ol: ({ children }) => (
                          <ol className="list-decimal ml-6 mb-4 space-y-2">
                            {children}
                          </ol>
                        ),

                        li: ({ children }) => (
                          <li className="pl-1">
                            {children}
                          </li>
                        ),

                        h1: ({ children }) => (
                          <h1 className="text-2xl font-bold text-slate-900 mb-4">
                            {children}
                          </h1>
                        ),

                        h2: ({ children }) => (
                          <h2 className="text-xl font-bold text-slate-900 mb-3">
                            {children}
                          </h2>
                        ),

                        h3: ({ children }) => (
                          <h3 className="text-lg font-bold text-slate-900 mb-2">
                            {children}
                          </h3>
                        ),

                      }}
                    >
                      {answer}
                    </ReactMarkdown>

                  </div>

                </div>

              </div>


              {/* AI FOOTER */}

              <div className="border-t border-slate-100 px-5 sm:px-6 py-3 bg-slate-50">

                <p className="text-xs text-slate-500">
                  🤖 Generated by LOOP AI using your customer feedback data
                </p>

              </div>

            </div>

          )}

        </div>


        {/* ========================================
            SUGGESTED QUESTIONS
        ======================================== */}

        <div className="bg-white rounded-xl shadow p-5 sm:p-6 mt-6">

          <h2 className="text-lg font-bold text-slate-900 mb-4">
            💡 Suggested Questions
          </h2>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            {suggestedQuestions.map((item) => (

              <button
                key={item}
                onClick={() => {

                  setQuestion(item);
                  setAnswer("");

                }}
                disabled={loading}
                className="text-left border border-slate-200 hover:border-blue-400 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-3 text-sm text-slate-700 transition"
              >
                {item}
              </button>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
};

export default AskAI;