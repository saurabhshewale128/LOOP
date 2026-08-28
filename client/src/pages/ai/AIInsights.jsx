import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import Loading from "../../components/common/Loading";
import ErrorState from "../../components/common/ErrorState";

// ========================================
// AI INSIGHTS
// ========================================

const AIInsights = () => {
  const navigate = useNavigate();

  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // LOAD VOC REPORT
  // ========================================

  const loadInsights = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      console.log("🤖 Loading AI Insights...");

      const response = await api.get("/voc/report", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(
        "✅ AI Insights Response:",
        response.data
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to generate AI insights"
        );
      }

      setReport(
        response.data?.data || null
      );

    } catch (error) {
      console.error(
        "❌ AI Insights Error:",
        error.response?.data ||
          error.message
      );

      // ========================================
      // 401 - SESSION EXPIRED
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

      // ========================================
      // ERROR MESSAGE
      // ========================================

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to load AI insights";

      setError(message);
      setReport(null);

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    loadInsights();
  }, [navigate]);

  // ========================================
  // RETRY
  // ========================================

  const handleRetry = () => {
    loadInsights();
  };

  // ========================================
  // DERIVED INSIGHTS
  // ========================================

  const insights = useMemo(() => {
    if (!report) {
      return {
        criticalIssues: [],
        recommendations: [],
        strengths: [],
        featureRequests: [],
      };
    }

    const topIssues =
      Array.isArray(report.topIssues)
        ? report.topIssues
        : [];

    const recommendations =
      Array.isArray(
        report.recommendedActions
      )
        ? report.recommendedActions
        : [];

    const strengths =
      Array.isArray(
        report.customerStrengths
      )
        ? report.customerStrengths
        : [];

    const featureRequests =
      Array.isArray(
        report.featureRequests
      )
        ? report.featureRequests
        : [];

    return {
      criticalIssues:
        topIssues.filter(
          (item) =>
            item?.priority === "High"
        ),

      recommendations,

      strengths,

      featureRequests,
    };
  }, [report]);

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
            Generating AI Insights...
          </h2>

          <p className="text-slate-500 mt-2">
            LOOP AI is analyzing customer feedback
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
            Unable to Load AI Insights
          </h2>

          <p className="text-slate-500 mt-3">
            {error}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">

            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
            >
              🔄 Try Again
            </button>

            <button
              onClick={() =>
                navigate("/ai")
              }
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
  // NO REPORT
  // ========================================

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

        <div className="bg-white rounded-2xl shadow p-10 text-center max-w-lg">

          <div className="text-6xl mb-5">
            📭
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            No AI Insights Available
          </h2>

          <p className="text-slate-500 mt-3">
            Add customer feedback first to generate
            AI-powered insights and recommendations.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">

            <button
              onClick={() =>
                navigate("/feedback")
              }
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              View Feedback
            </button>

            <button
              onClick={handleRetry}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition"
            >
              🔄 Retry
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">

      <div className="max-w-7xl mx-auto">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="mb-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <button
              onClick={() =>
                navigate("/ai")
              }
              className="text-blue-600 hover:text-blue-800 font-medium self-start"
            >
              ← Back to AI Features
            </button>

            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-slate-700 hover:bg-slate-50 font-semibold transition self-start sm:self-auto"
            >
              🔄 Regenerate
            </button>

          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg mt-5">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>

                <div className="flex items-center gap-4 mb-3">

                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                    💡
                  </div>

                  <div>

                    <h1 className="text-3xl sm:text-4xl font-bold">
                      AI Insights
                    </h1>

                    <p className="text-blue-100 mt-1">
                      Intelligent customer feedback analysis
                    </p>

                  </div>

                </div>

                <p className="text-blue-50 max-w-3xl text-base sm:text-lg">
                  LOOP AI analyzes customer feedback to
                  identify critical issues, customer strengths,
                  feature requests and recommended actions.
                </p>

              </div>

              <div className="text-6xl sm:text-7xl">
                🤖
              </div>

            </div>

          </div>

        </div>


        {/* ========================================
            EXECUTIVE INSIGHT
        ======================================== */}

        <div className="bg-white rounded-2xl shadow p-5 sm:p-6 mb-6">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
              🧠
            </div>

            <div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Executive Insight
              </h2>

              <p className="text-sm text-slate-500">
                AI-generated overview
              </p>

            </div>

          </div>

          <p className="text-slate-700 text-base sm:text-lg leading-8">
            {report.executiveSummary ||
              "No executive summary available."}
          </p>

        </div>


        {/* ========================================
            KPI CARDS
        ======================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

          {/* CRITICAL */}

          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-red-500">

            <p className="text-sm text-slate-500">
              Critical Issues
            </p>

            <p className="text-4xl font-bold text-red-600 mt-2">
              {insights.criticalIssues.length}
            </p>

            <p className="text-sm text-slate-500 mt-2">
              High priority problems
            </p>

          </div>


          {/* RECOMMENDATIONS */}

          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-orange-500">

            <p className="text-sm text-slate-500">
              Recommendations
            </p>

            <p className="text-4xl font-bold text-orange-600 mt-2">
              {insights.recommendations.length}
            </p>

            <p className="text-sm text-slate-500 mt-2">
              Suggested actions
            </p>

          </div>


          {/* STRENGTHS */}

          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-green-500">

            <p className="text-sm text-slate-500">
              Customer Strengths
            </p>

            <p className="text-4xl font-bold text-green-600 mt-2">
              {insights.strengths.length}
            </p>

            <p className="text-sm text-slate-500 mt-2">
              Positive signals
            </p>

          </div>


          {/* FEATURE REQUESTS */}

          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-purple-500">

            <p className="text-sm text-slate-500">
              Feature Requests
            </p>

            <p className="text-4xl font-bold text-purple-600 mt-2">
              {insights.featureRequests.length}
            </p>

            <p className="text-sm text-slate-500 mt-2">
              Customer requested features
            </p>

          </div>

        </div>


        {/* ========================================
            CRITICAL ISSUES
        ======================================== */}

        <div className="bg-white rounded-2xl shadow p-5 sm:p-6 mb-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center text-xl">
              🚨
            </div>

            <div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Critical Issues
              </h2>

              <p className="text-sm text-slate-500">
                Problems requiring immediate attention
              </p>

            </div>

          </div>


          {insights.criticalIssues.length > 0 ? (

            <div className="space-y-4">

              {insights.criticalIssues.map(
                (issue, index) => (

                  <div
                    key={index}
                    className="border border-red-100 bg-red-50 rounded-xl p-5"
                  >

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                      <div>

                        <h3 className="font-bold text-lg text-slate-900">
                          {issue.issue ||
                            "Critical issue"}
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                          {issue.mentions || 0} customer
                          mention(s)
                        </p>

                      </div>

                      <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-semibold text-sm w-fit">
                        High Priority
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">

              <div className="text-4xl mb-2">
                ✅
              </div>

              <p className="font-semibold text-green-800">
                No critical issues identified
              </p>

              <p className="text-sm text-green-700 mt-1">
                Customer feedback does not contain any
                high-priority issues.
              </p>

            </div>

          )}

        </div>


        {/* ========================================
            RECOMMENDATIONS
        ======================================== */}

        <div className="bg-white rounded-2xl shadow p-5 sm:p-6 mb-6">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center text-xl">
              🎯
            </div>

            <div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Recommended Actions
              </h2>

              <p className="text-sm text-slate-500">
                AI-suggested actions based on customer feedback
              </p>

            </div>

          </div>


          {insights.recommendations.length > 0 ? (

            <div className="space-y-5">

              {insights.recommendations.map(
                (item, index) => (

                  <div
                    key={index}
                    className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition"
                  >

                    <div className="flex items-start gap-4">

                      <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold shrink-0">
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">

                          <h3 className="text-lg font-bold text-slate-900">
                            {item.action ||
                              "Recommended action"}
                          </h3>

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                              item.priority ===
                              "High"
                                ? "bg-red-100 text-red-700"
                                : item.priority ===
                                  "Medium"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {item.priority ||
                              "Low"}
                          </span>

                        </div>

                        <p className="text-slate-600 mt-3 leading-7">
                          {item.reason ||
                            "No reason provided."}
                        </p>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="bg-slate-50 rounded-xl p-6 text-center text-slate-500">
              No recommendations available.
            </div>

          )}

        </div>


        {/* ========================================
            CUSTOMER STRENGTHS + FEATURE REQUESTS
        ======================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">


          {/* CUSTOMER STRENGTHS */}

          <div className="bg-white rounded-2xl shadow p-5 sm:p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center text-xl">
                💚
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Customer Strengths
                </h2>

                <p className="text-sm text-slate-500">
                  What customers like
                </p>

              </div>

            </div>


            {insights.strengths.length > 0 ? (

              <div className="space-y-3">

                {insights.strengths.map(
                  (strength, index) => (

                    <div
                      key={index}
                      className="flex gap-3 bg-green-50 rounded-xl p-4"
                    >

                      <span className="text-green-600 font-bold">
                        ✓
                      </span>

                      <p className="text-slate-700">
                        {strength}
                      </p>

                    </div>

                  )
                )}

              </div>

            ) : (

              <p className="text-slate-500">
                No customer strengths identified.
              </p>

            )}

          </div>


          {/* FEATURE REQUESTS */}

          <div className="bg-white rounded-2xl shadow p-5 sm:p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center text-xl">
                🚀
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Feature Requests
                </h2>

                <p className="text-sm text-slate-500">
                  What customers want next
                </p>

              </div>

            </div>


            {insights.featureRequests.length > 0 ? (

              <div className="space-y-3">

                {insights.featureRequests.map(
                  (request, index) => {

                    const text =
                      typeof request ===
                      "string"
                        ? request
                        : request?.request ||
                          request?.feature ||
                          request?.name ||
                          "Feature request";

                    return (
                      <div
                        key={index}
                        className="flex gap-3 bg-purple-50 rounded-xl p-4"
                      >

                        <span className="text-purple-600 font-bold">
                          ✦
                        </span>

                        <p className="text-slate-700">
                          {text}
                        </p>

                      </div>
                    );
                  }
                )}

              </div>

            ) : (

              <div className="bg-slate-50 rounded-xl p-5 text-center">

                <p className="text-slate-500">
                  No feature requests identified.
                </p>

              </div>

            )}

          </div>

        </div>


        {/* ========================================
            FOOTER
        ======================================== */}

        <div className="text-center text-sm text-slate-500 pb-6">
          🤖 Insights generated using LOOP AI
        </div>

      </div>

    </div>
  );
};

export default AIInsights;