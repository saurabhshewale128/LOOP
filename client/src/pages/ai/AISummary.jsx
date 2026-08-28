import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import Loading from "../../components/common/Loading";
import ErrorState from "../../components/common/ErrorState";

const AISummary = () => {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // LOAD ANALYTICS
  // ========================================

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      console.log("🧠 Loading AI Summary...");

      const response = await api.get(
        "/analytics/overview"
      );

      console.log(
        "✅ AI Summary Response:",
        response.data
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to load analytics"
        );
      }

      setAnalytics(
        response.data?.data || null
      );

    } catch (error) {
      console.error(
        "❌ AI Summary Error:",
        error.response?.data ||
          error.message
      );

      // ========================================
      // SESSION EXPIRED
      // ========================================

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.error("Session expired");

        navigate("/login");

        return;
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to load AI summary";

      setError(message);
      setAnalytics(null);

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    fetchAnalytics();
  }, [navigate]);

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

        <div className="text-center">

          <div className="text-6xl mb-5 animate-bounce">
            🤖
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Preparing AI Summary...
          </h2>

          <p className="text-slate-500 mt-2">
            LOOP AI is analyzing your customer feedback
          </p>

          <div className="w-72 h-3 bg-slate-200 rounded-full mt-6 overflow-hidden mx-auto">

            <div className="h-full w-1/2 bg-blue-500 rounded-full animate-pulse" />

          </div>

          <p className="text-xs text-slate-400 mt-4">
            This may take a few seconds...
          </p>

        </div>

      </div>
    );
  }

  // ========================================
  // ERROR STATE
  // ========================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

        <div className="bg-white rounded-2xl shadow p-10 text-center max-w-lg w-full">

          <div className="text-6xl mb-5">
            ⚠️
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Unable to Load AI Summary
          </h2>

          <p className="text-slate-500 mt-3">
            {error}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">

            <button
              onClick={fetchAnalytics}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
            >
              🔄 Try Again
            </button>

            <button
              onClick={() => navigate("/ai")}
              className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition"
            >
              ← Back to AI
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ========================================
  // NO DATA
  // ========================================

  if (!analytics) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

        <div className="bg-white rounded-2xl shadow p-10 text-center max-w-lg">

          <div className="text-6xl mb-5">
            📭
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            No Feedback Data
          </h2>

          <p className="text-slate-500 mt-3">
            Add customer feedback to generate an
            AI-powered summary.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">

            <button
              onClick={() =>
                navigate("/feedback/add")
              }
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
            >
              Add Feedback
            </button>

            <button
              onClick={fetchAnalytics}
              className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold transition"
            >
              🔄 Retry
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ========================================
  // DATA
  // ========================================

  const totalFeedback =
    analytics.totalFeedback ?? 0;

  const averageRating =
    analytics.averageRating ?? "0.0";

  const positive =
    analytics.sentiment?.positive ?? 0;

  const negative =
    analytics.sentiment?.negative ?? 0;

  const neutral =
    analytics.sentiment?.neutral ?? 0;

  const highPriority =
    analytics.priority?.high ?? 0;

  const mediumPriority =
    analytics.priority?.medium ?? 0;

  const lowPriority =
    analytics.priority?.low ?? 0;

  const featureRequests =
    analytics.category?.featureRequest ?? 0;

  const bugs =
    analytics.category?.bug ?? 0;

  const complaints =
    analytics.category?.complaint ?? 0;

  const praise =
    analytics.category?.praise ?? 0;

  // ========================================
  // SENTIMENT SUMMARY
  // ========================================

  let overallSentiment = "Neutral";

  if (
    positive > negative &&
    positive > neutral
  ) {
    overallSentiment = "Positive";
  } else if (
    negative > positive &&
    negative > neutral
  ) {
    overallSentiment = "Negative";
  }

  // ========================================
  // MAIN ISSUE
  // ========================================

  let mainIssue =
    "No major issue identified.";

  if (negative > 0) {

    if (bugs >= complaints) {

      mainIssue =
        "Technical bugs and application issues require attention.";

    } else {

      mainIssue =
        "Customer complaints should be reviewed and addressed.";

    }
  }

  // ========================================
  // SUMMARY TEXT
  // ========================================

  const summaryText =
    totalFeedback === 0
      ? "There is currently no customer feedback available for analysis."
      : `The platform has received ${totalFeedback} customer feedback ${
          totalFeedback === 1
            ? "response"
            : "responses"
        } with an average rating of ${averageRating}/5. Overall customer sentiment is ${overallSentiment.toLowerCase()}. ${
          positive
        } ${
          positive === 1
            ? "response is"
            : "responses are"
        } positive, ${neutral} ${
          neutral === 1
            ? "is"
            : "are"
        } neutral, and ${negative} ${
          negative === 1
            ? "is"
            : "are"
        } negative.`;

  // ========================================
  // RATING MESSAGE
  // ========================================

  let ratingMessage =
    "Customer satisfaction needs monitoring.";

  const numericRating =
    Number(averageRating);

  if (numericRating >= 4) {

    ratingMessage =
      "Customer satisfaction is strong.";

  } else if (numericRating >= 3) {

    ratingMessage =
      "Customer satisfaction is moderate.";

  } else if (numericRating > 0) {

    ratingMessage =
      "Customer satisfaction requires immediate attention.";

  }

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* ========================================
            HEADER
        ======================================== */}

        <button
          onClick={() => navigate("/ai")}
          className="mb-5 text-blue-600 hover:text-blue-800 font-medium transition"
        >
          ← Back to AI Features
        </button>

        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <div className="flex items-center gap-4 mb-4">

                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
                  🧠
                </div>

                <div>

                  <h1 className="text-3xl sm:text-4xl font-bold">
                    AI Summary
                  </h1>

                  <p className="text-blue-100 mt-1">
                    Customer feedback intelligence
                  </p>

                </div>

              </div>

              <p className="text-blue-50 text-base sm:text-lg max-w-3xl leading-8">
                LOOP AI summarizes your customer feedback
                and highlights sentiment, satisfaction,
                issues and business priorities.
              </p>

            </div>

            <div className="text-6xl sm:text-7xl">
              🤖
            </div>

          </div>

        </div>


        {/* ========================================
            REFRESH
        ======================================== */}

        <div className="flex justify-end mb-6">

          <button
            onClick={fetchAnalytics}
            className="px-5 py-2.5 bg-white border border-slate-200 shadow-sm rounded-lg text-slate-700 hover:bg-slate-50 font-semibold transition"
          >
            🔄 Refresh Summary
          </button>

        </div>


        {/* ========================================
            EXECUTIVE SUMMARY
        ======================================== */}

        <div className="bg-white rounded-2xl shadow p-5 sm:p-6 mb-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
              📋
            </div>

            <div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Executive Summary
              </h2>

              <p className="text-slate-500">
                Overall customer feedback overview
              </p>

            </div>

          </div>

          <p className="text-base sm:text-lg text-slate-700 leading-8">
            {summaryText}
          </p>

        </div>


        {/* ========================================
            KPI CARDS
        ======================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-blue-500">

            <p className="text-sm text-slate-500">
              Total Feedback
            </p>

            <h3 className="text-4xl font-bold text-slate-900 mt-2">
              {totalFeedback}
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Customer responses
            </p>

          </div>


          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-yellow-500">

            <p className="text-sm text-slate-500">
              Average Rating
            </p>

            <h3 className="text-4xl font-bold text-yellow-600 mt-2">
              ⭐ {averageRating}
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Out of 5
            </p>

          </div>


          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-green-500">

            <p className="text-sm text-slate-500">
              Overall Sentiment
            </p>

            <h3
              className={`text-3xl font-bold mt-2 ${
                overallSentiment === "Positive"
                  ? "text-green-600"
                  : overallSentiment === "Negative"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {overallSentiment}
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Based on feedback sentiment
            </p>

          </div>


          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-red-500">

            <p className="text-sm text-slate-500">
              High Priority
            </p>

            <h3 className="text-4xl font-bold text-red-600 mt-2">
              {highPriority}
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Issues requiring attention
            </p>

          </div>

        </div>


        {/* ========================================
            SENTIMENT OVERVIEW
        ======================================== */}

        <div className="bg-white rounded-2xl shadow p-5 sm:p-6 mb-6">

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5">
            😊 Sentiment Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <div className="bg-green-50 rounded-xl p-5">

              <p className="text-green-700 font-semibold">
                Positive
              </p>

              <p className="text-4xl font-bold text-green-600 mt-2">
                {positive}
              </p>

              <p className="text-sm text-green-700 mt-2">
                Positive customer feedback
              </p>

            </div>


            <div className="bg-yellow-50 rounded-xl p-5">

              <p className="text-yellow-700 font-semibold">
                Neutral
              </p>

              <p className="text-4xl font-bold text-yellow-600 mt-2">
                {neutral}
              </p>

              <p className="text-sm text-yellow-700 mt-2">
                Neutral customer feedback
              </p>

            </div>


            <div className="bg-red-50 rounded-xl p-5">

              <p className="text-red-700 font-semibold">
                Negative
              </p>

              <p className="text-4xl font-bold text-red-600 mt-2">
                {negative}
              </p>

              <p className="text-sm text-red-700 mt-2">
                Negative customer feedback
              </p>

            </div>

          </div>

        </div>


        {/* ========================================
            BUSINESS INSIGHTS
        ======================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* CUSTOMER SATISFACTION */}

          <div className="bg-white rounded-2xl shadow p-5 sm:p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-11 h-11 bg-yellow-100 rounded-xl flex items-center justify-center text-xl">
                ⭐
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Customer Satisfaction
                </h2>

                <p className="text-sm text-slate-500">
                  Rating analysis
                </p>

              </div>

            </div>

            <div className="bg-slate-50 rounded-xl p-5">

              <p className="text-4xl font-bold text-slate-900">
                {averageRating}/5
              </p>

              <p className="text-slate-600 mt-3">
                {ratingMessage}
              </p>

            </div>

          </div>


          {/* MAIN ISSUE */}

          <div className="bg-white rounded-2xl shadow p-5 sm:p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center text-xl">
                🚨
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Main Business Concern
                </h2>

                <p className="text-sm text-slate-500">
                  Area requiring attention
                </p>

              </div>

            </div>

            <div className="bg-red-50 rounded-xl p-5">

              <p className="text-slate-700 leading-7">
                {mainIssue}
              </p>

            </div>

          </div>

        </div>


        {/* ========================================
            CATEGORY SUMMARY
        ======================================== */}

        <div className="bg-white rounded-2xl shadow p-5 sm:p-6 mb-6">

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5">
            📊 Feedback Categories
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="bg-purple-50 rounded-xl p-5">

              <p className="text-purple-700 font-semibold">
                Feature Requests
              </p>

              <p className="text-3xl font-bold text-purple-600 mt-2">
                {featureRequests}
              </p>

            </div>


            <div className="bg-red-50 rounded-xl p-5">

              <p className="text-red-700 font-semibold">
                Bugs
              </p>

              <p className="text-3xl font-bold text-red-600 mt-2">
                {bugs}
              </p>

            </div>


            <div className="bg-orange-50 rounded-xl p-5">

              <p className="text-orange-700 font-semibold">
                Complaints
              </p>

              <p className="text-3xl font-bold text-orange-600 mt-2">
                {complaints}
              </p>

            </div>


            <div className="bg-green-50 rounded-xl p-5">

              <p className="text-green-700 font-semibold">
                Praise
              </p>

              <p className="text-3xl font-bold text-green-600 mt-2">
                {praise}
              </p>

            </div>

          </div>

        </div>


        {/* ========================================
            PRIORITY ANALYSIS
        ======================================== */}

        <div className="bg-white rounded-2xl shadow p-5 sm:p-6 mb-8">

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-5">
            🎯 Priority Analysis
          </h2>

          <div className="space-y-4">

            {/* HIGH */}

            <div>

              <div className="flex justify-between mb-2">

                <span className="font-medium text-red-700">
                  High Priority
                </span>

                <span className="font-bold">
                  {highPriority}
                </span>

              </div>

              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">

                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-500"
                  style={{
                    width:
                      totalFeedback > 0
                        ? `${Math.min(
                            (highPriority /
                              totalFeedback) *
                              100,
                            100
                          )}%`
                        : "0%",
                  }}
                />

              </div>

            </div>


            {/* MEDIUM */}

            <div>

              <div className="flex justify-between mb-2">

                <span className="font-medium text-orange-700">
                  Medium Priority
                </span>

                <span className="font-bold">
                  {mediumPriority}
                </span>

              </div>

              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">

                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{
                    width:
                      totalFeedback > 0
                        ? `${Math.min(
                            (mediumPriority /
                              totalFeedback) *
                              100,
                            100
                          )}%`
                        : "0%",
                  }}
                />

              </div>

            </div>


            {/* LOW */}

            <div>

              <div className="flex justify-between mb-2">

                <span className="font-medium text-green-700">
                  Low Priority
                </span>

                <span className="font-bold">
                  {lowPriority}
                </span>

              </div>

              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">

                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{
                    width:
                      totalFeedback > 0
                        ? `${Math.min(
                            (lowPriority /
                              totalFeedback) *
                              100,
                            100
                          )}%`
                        : "0%",
                  }}
                />

              </div>

            </div>

          </div>

        </div>


        {/* ========================================
            FOOTER
        ======================================== */}

        <div className="text-center text-sm text-slate-500 pb-6">
          🤖 Generated by LOOP AI using customer feedback analytics
        </div>

      </div>

    </div>
  );
};

export default AISummary;