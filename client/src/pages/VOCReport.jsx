import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";

const VOCReport = () => {
  const navigate = useNavigate();

  // ========================================
  // STATES
  // ========================================

  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(true);

  const [regenerating, setRegenerating] =
    useState(false);

  const [downloadingPDF, setDownloadingPDF] =
    useState(false);

  const [error, setError] = useState("");

  // ========================================
  // FETCH VOC REPORT
  // ========================================

  const fetchVOCReport = async (
    showToast = false
  ) => {
    try {
      setError("");

      const token =
        localStorage.getItem("token");

      // ========================================
      // TOKEN CHECK
      // ========================================

      if (!token) {
        toast.error("Please login again");

        navigate("/login");

        return;
      }

      console.log(
        "🔥 Loading VOC Report..."
      );

      const response = await api.get(
        "/voc/report",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "✅ VOC Response:",
        response.data
      );

      // ========================================
      // API SUCCESS CHECK
      // ========================================

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to generate VOC report"
        );
      }

      // ========================================
      // NO FEEDBACK
      // ========================================

      if (!response.data?.data) {
        setReport(null);

        if (showToast) {
          toast.success(
            "VOC report checked successfully"
          );
        }

        return;
      }

      // ========================================
      // SET REPORT
      // ========================================

      setReport(
        response.data.data
      );

      if (showToast) {
        toast.success(
          "VOC report regenerated successfully"
        );
      }
    } catch (error) {
      console.error(
        "❌ VOC Report Error:",
        error.response?.data ||
          error.message
      );

      // ========================================
      // 401 SESSION EXPIRED
      // ========================================

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        toast.error(
          "Session expired. Please login again"
        );

        navigate("/login");

        return;
      }

      // ========================================
      // ERROR MESSAGE
      // ========================================

      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to generate VOC report";

      setError(message);

      setReport(null);

      toast.error(message);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);

        await fetchVOCReport(false);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [navigate]);

  // ========================================
  // REGENERATE VOC REPORT
  // ========================================

  const handleRegenerate = async () => {
    // Prevent duplicate requests
    if (regenerating) {
      return;
    }

    try {
      setRegenerating(true);

      setError("");

      await fetchVOCReport(true);
    } finally {
      setRegenerating(false);
    }
  };

  // ========================================
  // RETRY AFTER ERROR
  // ========================================

  const handleRetry = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      setError("");

      await fetchVOCReport(false);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // DOWNLOAD VOC PDF
  // ========================================

  const handleDownloadPDF = async () => {
    if (downloadingPDF) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      // ========================================
      // TOKEN CHECK
      // ========================================

      if (!token) {
        toast.error("Please login again");

        navigate("/login");

        return;
      }

      setDownloadingPDF(true);

      toast.loading(
        "Generating PDF...",
        {
          id: "voc-pdf",
        }
      );

      console.log(
        "📄 Downloading VOC PDF..."
      );

      const response = await api.get(
        "/voc/report/pdf",
        {
          responseType: "blob",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "✅ VOC PDF received"
      );

      const blob = new Blob(
        [response.data],
        {
          type: "application/pdf",
        }
      );

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "LOOP-VOC-Report.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        url
      );

      toast.success(
        "VOC PDF downloaded successfully",
        {
          id: "voc-pdf",
        }
      );
    } catch (error) {
      console.error(
        "❌ VOC PDF Download Error:",
        error.response?.data ||
          error.message
      );

      // ========================================
      // 401 SESSION EXPIRED
      // ========================================

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        toast.error(
          "Session expired. Please login again",
          {
            id: "voc-pdf",
          }
        );

        navigate("/login");

        return;
      }

      toast.error(
        "Failed to download VOC PDF",
        {
          id: "voc-pdf",
        }
      );
    } finally {
      setDownloadingPDF(false);
    }
  };

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
            Generating VOC Report...
          </h2>

          <p className="text-slate-500 mt-2">
            LOOP AI is analyzing your customer feedback
          </p>

          <div className="mt-6 w-72 h-3 bg-slate-200 rounded-full overflow-hidden mx-auto">

            <div className="h-full bg-blue-600 rounded-full animate-pulse w-2/3" />

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
            Unable to Generate VOC Report
          </h2>

          <p className="text-slate-500 mt-3 leading-6">
            {error}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">

            <button
              type="button"
              onClick={handleRetry}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-semibold transition"
            >
              🔄 Try Again
            </button>

            <button
              type="button"
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

        <div className="bg-white rounded-2xl shadow p-10 text-center max-w-lg w-full">

          <div className="text-6xl mb-5">
            📭
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            No Feedback Available
          </h2>

          <p className="text-slate-500 mt-3 leading-6">
            There is not enough customer feedback
            to generate a Voice-of-Customer report.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">

            <button
              type="button"
              onClick={() =>
                navigate("/feedback/add")
              }
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
            >
              ➕ Add Feedback
            </button>

            <button
              type="button"
              onClick={handleRetry}
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
  // SAFE REPORT DATA
  // ========================================

  const sentimentData =
    report.sentimentOverview || {};

  const positive = Number(
    sentimentData.positive || 0
  );

  const neutral = Number(
    sentimentData.neutral || 0
  );

  const negative = Number(
    sentimentData.negative || 0
  );

  const sentimentOverall =
    sentimentData.overall ||
    "Mixed";

  const topIssues = Array.isArray(
    report.topIssues
  )
    ? report.topIssues
    : [];

  const featureRequests =
    Array.isArray(
      report.featureRequests
    )
      ? report.featureRequests
      : [];

  const customerStrengths =
    Array.isArray(
      report.customerStrengths
    )
      ? report.customerStrengths
      : [];

  const recommendedActions =
    Array.isArray(
      report.recommendedActions
    )
      ? report.recommendedActions
      : [];

  // ========================================
  // SENTIMENT DATA
  // ========================================

  const sentimentValues = [
    {
      label: "Positive",
      value: positive,
      className: "bg-green-500",
      textClass: "text-green-700",
    },
    {
      label: "Neutral",
      value: neutral,
      className: "bg-yellow-500",
      textClass: "text-yellow-700",
    },
    {
      label: "Negative",
      value: negative,
      className: "bg-red-500",
      textClass: "text-red-700",
    },
  ];

  const sentimentTotal =
    sentimentValues.reduce(
      (sum, item) =>
        sum + item.value,
      0
    );

  // ========================================
  // MAX ISSUE MENTIONS
  // ========================================

  const maxIssueMentions = Math.max(
    ...topIssues.map(
      (issue) =>
        Number(
          issue?.mentions || 0
        )
    ),
    1
  );

  // ========================================
  // PRIORITY COUNTS
  // ========================================

  const priorityCounts =
    topIssues.reduce(
      (acc, issue) => {
        const priority =
          issue?.priority || "Low";

        if (priority === "High") {
          acc.high += 1;
        } else if (
          priority === "Medium"
        ) {
          acc.medium += 1;
        } else {
          acc.low += 1;
        }

        return acc;
      },
      {
        high: 0,
        medium: 0,
        low: 0,
      }
    );

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-8">

      <div className="max-w-6xl mx-auto">

        {/* ========================================
            BACK BUTTON
        ======================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

          <button
            type="button"
            onClick={() =>
              navigate("/ai")
            }
            className="text-blue-600 hover:text-blue-800 font-medium transition self-start"
          >
            ← Back to AI Features
          </button>

        </div>

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 sm:p-8 text-white mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <div className="flex items-center gap-3 mb-3">

                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                  🗣️
                </div>

                <div>

                  <h1 className="text-3xl font-bold">
                    Voice of Customer
                  </h1>

                  <p className="text-blue-100">
                    AI-powered customer feedback report
                  </p>

                </div>

              </div>

              <p className="text-blue-100 max-w-2xl leading-relaxed">
                LOOP AI analyzes customer feedback and
                identifies important issues, customer
                strengths, feature requests, and
                recommended actions.
              </p>

            </div>

            {/* ========================================
                ACTION BUTTONS
            ======================================== */}

            <div className="flex flex-col sm:flex-row md:flex-col items-center gap-3">

              <div className="text-6xl">
                🤖
              </div>

              <div className="flex flex-col sm:flex-row gap-3">

                {/* DOWNLOAD PDF */}

                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={downloadingPDF}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition shadow ${
                    downloadingPDF
                      ? "bg-white/50 text-blue-900 cursor-not-allowed"
                      : "bg-white text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  {downloadingPDF
                    ? "⏳ Downloading..."
                    : "📄 Download PDF"}
                </button>

                {/* REGENERATE */}

                <button
                  type="button"
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition shadow ${
                    regenerating
                      ? "bg-white/50 text-blue-900 cursor-not-allowed"
                      : "bg-white text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  {regenerating
                    ? "⏳ Regenerating..."
                    : "🔄 Regenerate Report"}
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* ========================================
            EXECUTIVE SUMMARY
        ======================================== */}

        <div className="bg-white rounded-2xl shadow p-5 sm:p-6 mb-6">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              📋
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Executive Summary
              </h2>

              <p className="text-sm text-slate-500">
                Overall customer feedback summary
              </p>

            </div>

          </div>

          <p className="text-slate-700 leading-relaxed">
            {report.executiveSummary ||
              "No executive summary available."}
          </p>

        </div>

        {/* ========================================
            SENTIMENT OVERVIEW
        ======================================== */}

        <div className="bg-white rounded-2xl shadow p-5 sm:p-6 mb-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                😊 Sentiment Overview
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Overall customer sentiment
              </p>

            </div>

            <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold w-fit">
              {sentimentOverall}
            </span>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* POSITIVE */}

            <div className="bg-green-50 border border-green-100 rounded-xl p-5">

              <div className="text-3xl mb-2">
                😊
              </div>

              <p className="text-sm text-green-700">
                Positive
              </p>

              <h3 className="text-3xl font-bold text-green-700 mt-1">
                {positive}
              </h3>

            </div>

            {/* NEUTRAL */}

            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5">

              <div className="text-3xl mb-2">
                😐
              </div>

              <p className="text-sm text-yellow-700">
                Neutral
              </p>

              <h3 className="text-3xl font-bold text-yellow-700 mt-1">
                {neutral}
              </h3>

            </div>

            {/* NEGATIVE */}

            <div className="bg-red-50 border border-red-100 rounded-xl p-5">

              <div className="text-3xl mb-2">
                😞
              </div>

              <p className="text-sm text-red-700">
                Negative
              </p>

              <h3 className="text-3xl font-bold text-red-700 mt-1">
                {negative}
              </h3>

            </div>

          </div>

        </div>

        {/* ========================================
            VISUAL INSIGHTS
        ======================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* SENTIMENT DISTRIBUTION */}

          <div className="bg-white rounded-2xl shadow p-5 sm:p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                📊
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Sentiment Distribution
                </h2>

                <p className="text-sm text-slate-500">
                  Customer sentiment breakdown
                </p>

              </div>

            </div>

            <div className="space-y-5">

              {sentimentValues.map(
                (item) => {

                  const percentage =
                    sentimentTotal > 0
                      ? Math.round(
                          (item.value /
                            sentimentTotal) *
                            100
                        )
                      : 0;

                  return (
                    <div
                      key={item.label}
                    >

                      <div className="flex items-center justify-between mb-2">

                        <span
                          className={`font-semibold ${item.textClass}`}
                        >
                          {item.label}
                        </span>

                        <span className="text-sm text-slate-500">
                          {item.value} (
                          {percentage}
                          %)
                        </span>

                      </div>

                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                        <div
                          className={`h-full ${item.className} rounded-full transition-all duration-700`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </div>

          {/* PRIORITY DISTRIBUTION */}

          <div className="bg-white rounded-2xl shadow p-5 sm:p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                ⚡
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Issue Priority
                </h2>

                <p className="text-sm text-slate-500">
                  Priority level of identified issues
                </p>

              </div>

            </div>

            <div className="grid grid-cols-3 gap-3">

              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">

                <p className="text-sm text-red-700">
                  High
                </p>

                <p className="text-3xl font-bold text-red-700 mt-1">
                  {priorityCounts.high}
                </p>

              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">

                <p className="text-sm text-orange-700">
                  Medium
                </p>

                <p className="text-3xl font-bold text-orange-700 mt-1">
                  {priorityCounts.medium}
                </p>

              </div>

              <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">

                <p className="text-sm text-green-700">
                  Low
                </p>

                <p className="text-3xl font-bold text-green-700 mt-1">
                  {priorityCounts.low}
                </p>

              </div>

            </div>

            {/* ISSUE BARS */}

            <div className="mt-6 space-y-4">

              {topIssues
                .slice(0, 5)
                .map(
                  (issue, index) => {

                    const mentions =
                      Number(
                        issue?.mentions || 0
                      );

                    const width =
                      Math.max(
                        8,
                        Math.round(
                          (mentions /
                            maxIssueMentions) *
                            100
                        )
                      );

                    return (
                      <div
                        key={index}
                      >

                        <div className="flex items-center justify-between gap-3 mb-1">

                          <span className="text-sm font-medium text-slate-700 truncate">
                            {issue?.issue ||
                              "Unknown issue"}
                          </span>

                          <span className="text-xs text-slate-500">
                            {mentions}
                          </span>

                        </div>

                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                            style={{
                              width: `${width}%`,
                            }}
                          />

                        </div>

                      </div>
                    );
                  }
                )}

              {topIssues.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">
                  No issues identified.
                </p>
              )}

            </div>

          </div>

        </div>

        {/* ========================================
            TOP ISSUES + FEATURE REQUESTS
        ======================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* TOP ISSUES */}

          <div className="bg-white rounded-2xl shadow p-5 sm:p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                ⚠️
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Top Issues
                </h2>

                <p className="text-sm text-slate-500">
                  Problems reported by customers
                </p>

              </div>

            </div>

            {topIssues.length > 0 ? (

              <div className="space-y-4">

                {topIssues.map(
                  (issue, index) => (

                    <div
                      key={index}
                      className="border border-slate-200 rounded-xl p-4"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <h3 className="font-semibold text-slate-900">
                            {issue?.issue ||
                              "Unknown issue"}
                          </h3>

                          <p className="text-sm text-slate-500 mt-1">

                            {Number(
                              issue?.mentions || 0
                            )}

                            {" "}
                            mention
                            {Number(
                              issue?.mentions || 0
                            ) !== 1
                              ? "s"
                              : ""}

                          </p>

                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                            issue?.priority ===
                            "High"
                              ? "bg-red-100 text-red-700"
                              : issue?.priority ===
                                "Medium"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {issue?.priority ||
                            "Low"}
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="text-center py-8">

                <div className="text-4xl mb-3">
                  ✅
                </div>

                <p className="text-slate-500">
                  No major issues reported.
                </p>

              </div>

            )}

          </div>

          {/* FEATURE REQUESTS */}

          <div className="bg-white rounded-2xl shadow p-5 sm:p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                💡
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Feature Requests
                </h2>

                <p className="text-sm text-slate-500">
                  Features requested by customers
                </p>

              </div>

            </div>

            {featureRequests.length > 0 ? (

              <div className="space-y-4">

                {featureRequests.map(
                  (feature, index) => {

                    const featureName =
                      typeof feature ===
                      "string"
                        ? feature
                        : feature?.feature ||
                          feature?.request ||
                          "Feature request";

                    const mentions =
                      typeof feature ===
                      "object"
                        ? Number(
                            feature?.mentions ||
                              0
                          )
                        : 0;

                    return (
                      <div
                        key={index}
                        className="border border-slate-200 rounded-xl p-4"
                      >

                        <div className="flex items-center justify-between gap-3">

                          <h3 className="font-semibold text-slate-900">
                            {featureName}
                          </h3>

                          {mentions > 0 && (

                            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold shrink-0">

                              {mentions}
                              {" "}
                              request
                              {mentions !== 1
                                ? "s"
                                : ""}

                            </span>

                          )}

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            ) : (

              <div className="text-center py-8">

                <div className="text-4xl mb-3">
                  📭
                </div>

                <p className="text-slate-500">
                  No feature requests found.
                </p>

              </div>

            )}

          </div>

        </div>

        {/* ========================================
            CUSTOMER STRENGTHS
        ======================================== */}

        <div className="bg-white rounded-2xl shadow p-5 sm:p-6 mb-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              💚
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Customer Strengths
              </h2>

              <p className="text-sm text-slate-500">
                What customers appreciate
              </p>

            </div>

          </div>

          {customerStrengths.length > 0 ? (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {customerStrengths.map(
                (strength, index) => (

                  <div
                    key={index}
                    className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3"
                  >

                    <span className="text-xl">
                      ✓
                    </span>

                    <p className="text-green-800">
                      {strength}
                    </p>

                  </div>

                )
              )}

            </div>

          ) : (

            <p className="text-slate-500">
              No positive strengths identified.
            </p>

          )}

        </div>

        {/* ========================================
            RECOMMENDED ACTIONS
        ======================================== */}

        <div className="bg-white rounded-2xl shadow p-5 sm:p-6 mb-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              🚀
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Recommended Actions
              </h2>

              <p className="text-sm text-slate-500">
                AI-generated improvement recommendations
              </p>

            </div>

          </div>

          {recommendedActions.length > 0 ? (

            <div className="space-y-4">

              {recommendedActions.map(
                (action, index) => (

                  <div
                    key={index}
                    className="border border-slate-200 rounded-xl p-5"
                  >

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">

                      <div className="flex-1">

                        <h3 className="font-bold text-slate-900">
                          {index + 1}.{" "}
                          {action?.action ||
                            "Recommended action"}
                        </h3>

                        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                          {action?.reason ||
                            "No reason provided."}
                        </p>

                      </div>

                      <span
                        className={`self-start px-3 py-1 rounded-full text-xs font-semibold ${
                          action?.priority ===
                          "High"
                            ? "bg-red-100 text-red-700"
                            : action?.priority ===
                              "Medium"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {action?.priority ||
                          "Low"}
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="text-center py-8">

              <div className="text-4xl mb-3">
                👍
              </div>

              <p className="text-slate-500">
                No immediate actions recommended.
              </p>

            </div>

          )}

        </div>

        {/* ========================================
            FOOTER
        ======================================== */}

        <div className="bg-slate-800 rounded-xl p-5 text-center text-slate-300">

          <p className="text-sm">
            🤖 This Voice-of-Customer report was
            generated by LOOP AI using customer
            feedback data.
          </p>

        </div>

      </div>

    </div>
  );
};

export default VOCReport;