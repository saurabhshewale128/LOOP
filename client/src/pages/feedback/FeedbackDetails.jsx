import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import { useAuth } from "../../context/AuthContext";

const FeedbackDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const canEdit =
    user?.role === "admin" ||
    user?.role === "analyst";

  // ========================================
  // STATES
  // ========================================

  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // FETCH FEEDBACK
  // ========================================

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/feedback/${id}`
      );

      const data =
        response.data?.feedback;

      if (!data) {
        throw new Error(
          "Feedback not found"
        );
      }

      setFeedback(data);

    } catch (error) {

      console.error(
        "❌ Feedback Details Error:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to load feedback";

      setError(message);
      setFeedback(null);

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOAD
  // ========================================

  useEffect(() => {
    if (id) {
      fetchFeedback();
    }
  }, [id]);

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loading message="Loading feedback..." />
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

        <div className="w-full max-w-lg">

          <ErrorState
            message={error}
            onRetry={fetchFeedback}
          />

          <div className="text-center mt-4">

            <button
              type="button"
              onClick={() =>
                navigate("/feedback")
              }
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              ← Back to Feedback
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ========================================
  // NOT FOUND
  // ========================================

  if (!feedback) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center max-w-md w-full">

          <div className="text-5xl mb-4">
            📭
          </div>

          <h2 className="text-xl font-bold text-slate-900">
            Feedback Not Found
          </h2>

          <p className="text-slate-500 mt-2">
            The requested feedback could not be found.
          </p>

          

        </div>

      </div>
    );
  }

  // ========================================
  // SENTIMENT STYLE
  // ========================================

  const sentiment =
    feedback.sentiment ||
    "Neutral";

  const sentimentStyle =
    sentiment === "Positive"
      ? "bg-green-100 text-green-700 border-green-200"
      : sentiment === "Negative"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-yellow-100 text-yellow-700 border-yellow-200";

  const sentimentIcon =
    sentiment === "Positive"
      ? "😊"
      : sentiment === "Negative"
      ? "😞"
      : "😐";

  // ========================================
  // PRIORITY STYLE
  // ========================================

  const priority =
    feedback.priority ||
    "Medium";

  const priorityStyle =
    priority === "High"
      ? "bg-red-100 text-red-700 border-red-200"
      : priority === "Medium"
      ? "bg-orange-100 text-orange-700 border-orange-200"
      : "bg-green-100 text-green-700 border-green-200";

  const priorityIcon =
    priority === "High"
      ? "🔴"
      : priority === "Medium"
      ? "🟠"
      : "🟢";

  // ========================================
  // STATUS STYLE
  // ========================================

  const status =
    feedback.status ||
    "New";

  const statusStyle =
    status === "Resolved"
      ? "bg-green-100 text-green-700"
      : status === "Reviewed"
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700";

  // ========================================
  // DATE
  // ========================================

  const formattedDate =
    feedback.createdAt
      ? new Date(
          feedback.createdAt
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
      : "-";

  const formattedTime =
    feedback.createdAt
      ? new Date(
          feedback.createdAt
        ).toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      : "";

  // ========================================
  // UI
  // ========================================

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-8">

      <div className="max-w-6xl mx-auto">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6">

          <div>

            <button
              type="button"
              onClick={() =>
                navigate("/feedback")
              }
              className="text-blue-600 hover:text-blue-800 font-semibold mb-3 transition"
            >
              ← Back to Feedback
            </button>

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                💬
              </div>

              <div>

                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Feedback Details
                </h1>

                <p className="text-slate-500 mt-1">
                  Customer feedback and AI analysis
                </p>

              </div>

            </div>

          </div>


          {/* EDIT */}

          {canEdit && (
             <button
               type="button"
               onClick={() =>
               navigate(`/feedback/edit/${feedback._id}`)
             }
             className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-sm"
            >
              ✏️ Edit Feedback
            </button>
          )}
        </div>
        {/* ========================================
            MAIN GRID
        ======================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


          {/* ========================================
              CUSTOMER DETAILS
          ======================================== */}

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7">

            <div className="flex items-center gap-3 mb-7">

              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                👤
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Customer Feedback
                </h2>

                <p className="text-sm text-slate-500">
                  Customer and feedback information
                </p>

              </div>

            </div>


            {/* ========================================
                CUSTOMER INFO GRID
            ======================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-7">

              {/* CUSTOMER NAME */}

              <div>

                <p className="text-sm text-slate-500 mb-1">
                  Customer Name
                </p>

                <p className="font-semibold text-slate-900">
                  {feedback.customerName ||
                    "-"}
                </p>

              </div>


              {/* EMAIL */}

              <div>

                <p className="text-sm text-slate-500 mb-1">
                  Email
                </p>

                <p className="font-semibold text-slate-900 break-all">
                  {feedback.email ||
                    "-"}
                </p>

              </div>


              {/* SOURCE */}

              <div>

                <p className="text-sm text-slate-500 mb-1">
                  Feedback Source
                </p>

                <p className="font-semibold text-slate-900">
                  {feedback.source ||
                    "-"}
                </p>

              </div>


              {/* RATING */}

              <div>

                <p className="text-sm text-slate-500 mb-1">
                  Rating
                </p>

                <p className="font-semibold text-slate-900">
                  {feedback.rating
                    ? `⭐ ${feedback.rating}/5`
                    : "-"}
                </p>

              </div>


              {/* STATUS */}

              <div>

                <p className="text-sm text-slate-500 mb-2">
                  Status
                </p>

                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${statusStyle}`}
                >
                  {status ===
                    "Resolved"
                    ? "✅"
                    : status ===
                      "Reviewed"
                    ? "👀"
                    : "🆕"}

                  <span className="ml-1">
                    {status}
                  </span>
                </span>

              </div>


              {/* CREATED */}

              <div>

                <p className="text-sm text-slate-500 mb-1">
                  Created
                </p>

                <p className="font-semibold text-slate-900">
                  {formattedDate}
                </p>

                {formattedTime && (
                  <p className="text-xs text-slate-400 mt-1">
                    {formattedTime}
                  </p>
                )}

              </div>

            </div>


            {/* ========================================
                CUSTOMER MESSAGE
            ======================================== */}

            <div className="border-t border-slate-200 pt-6">

              <div className="flex items-center gap-2 mb-3">

                <span className="text-xl">
                  💬
                </span>

                <p className="font-semibold text-slate-900">
                  Customer Message
                </p>

              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">

                <p className="text-slate-700 leading-7 whitespace-pre-wrap">
                  {feedback.message ||
                    "No message available."}
                </p>

              </div>

            </div>

          </div>


          {/* ========================================
              AI ANALYSIS
          ======================================== */}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-7">

            {/* AI HEADER */}

            <div className="flex items-center gap-3 mb-7">

              <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
                🤖
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  AI Analysis
                </h2>

                <p className="text-sm text-slate-500">
                  Gemini-powered insights
                </p>

              </div>

            </div>


            {/* SENTIMENT */}

            <div className="mb-6">

              <p className="text-sm text-slate-500 mb-2">
                Sentiment
              </p>

              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${sentimentStyle}`}
              >
                <span>
                  {sentimentIcon}
                </span>

                {sentiment}
              </span>

            </div>


            {/* CATEGORY */}

            <div className="mb-6">

              <p className="text-sm text-slate-500 mb-2">
                Category
              </p>

              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                🏷️
                {feedback.category ||
                  "Other"}
              </span>

            </div>


            {/* PRIORITY */}

            <div className="mb-6">

              <p className="text-sm text-slate-500 mb-2">
                Priority
              </p>

              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${priorityStyle}`}
              >
                <span>
                  {priorityIcon}
                </span>

                {priority}
              </span>

            </div>


            {/* AI SUMMARY */}

            <div className="border-t border-slate-200 pt-6">

              <div className="flex items-center gap-2 mb-3">

                <span>
                  🧠
                </span>

                <p className="text-sm font-semibold text-slate-700">
                  AI Summary
                </p>

              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">

                <p className="text-slate-700 leading-7">
                  {feedback.summary ||
                    "No AI summary available."}
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* ========================================
            FOOTER ACTIONS
        ======================================== */}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">

          <button
            type="button"
            onClick={() =>
              navigate("/feedback")
            }
            className="flex-1 sm:flex-none border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-semibold transition"
          >
            ← Back to Feedback
          </button>

          {canEdit && (
            <button
              type="button"
              onClick={() =>
                navigate(`/feedback/edit/${feedback._id}`)
              }
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              ✏️ Edit Feedback
           </button>
         )}

        </div>

      </div>

    </div>
  );
};

export default FeedbackDetails;