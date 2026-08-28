import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";

import { Doughnut, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // THEME DRILL-DOWN
  // ========================================

  const [searchParams, setSearchParams] =
    useSearchParams();

  const [themeFeedback, setThemeFeedback] =
    useState([]);

  const [selectedTheme, setSelectedTheme] =
    useState("");

  const [themeLoading, setThemeLoading] =
    useState(false);

  const [showThemeModal, setShowThemeModal] =
    useState(false);

  // ========================================
  // CHART FILTER DRILL-DOWN
  // ========================================

  const [filterFeedback, setFilterFeedback] =
    useState([]);

  const [selectedFilterType, setSelectedFilterType] =
    useState("");

  const [selectedFilterValue, setSelectedFilterValue] =
    useState("");

  const [filterLoading, setFilterLoading] =
    useState(false);

  const [showFilterModal, setShowFilterModal] =
    useState(false);

  // ========================================
  // FETCH ANALYTICS
  // ========================================

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/analytics/overview"
      );

      console.log(
        "Analytics:",
        response.data
      );

      setAnalytics(response.data.data);
    } catch (error) {
      console.error(
        "Analytics Error:",
        error.response?.data ||
          error.message
      );

      const message =
        error.response?.data?.message ||
        "Failed to load analytics";

      setError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // ========================================
  // FETCH FEEDBACK BY THEME
  // ========================================

  const handleThemeClick = async (theme) => {
    if (!theme) return;

    try {
      setSelectedTheme(theme);
      setThemeLoading(true);
      setShowThemeModal(true);

      setSearchParams(
        { theme },
        { replace: false }
      );

      const response = await api.get(
        "/feedback/theme",
        {
          params: { theme },
        }
      );

      setThemeFeedback(
        response.data.feedback || []
      );
    } catch (error) {
      console.error(
        "Theme Feedback Error:",
        error.response?.data ||
          error.message
      );

      setThemeFeedback([]);

      toast.error(
        error.response?.data?.message ||
          "Failed to load theme feedback"
      );
    } finally {
      setThemeLoading(false);
    }
  };

  // ========================================
  // OPEN THEME FROM URL
  // ========================================

  useEffect(() => {
    const themeFromUrl =
      searchParams.get("theme");

    if (themeFromUrl) {
      handleThemeClick(themeFromUrl);
    }
  }, []);

  // ========================================
  // CLOSE THEME MODAL
  // ========================================

  const closeThemeModal = () => {
    setShowThemeModal(false);
    setSelectedTheme("");
    setThemeFeedback([]);

    searchParams.delete("theme");

    setSearchParams(searchParams, {
      replace: true,
    });
  };

  // ========================================
  // FETCH FEEDBACK BY CHART FILTER
  // ========================================

  const handleFilterClick = async (
    filterType,
    filterValue
  ) => {
    if (
      !filterType ||
      filterValue === undefined ||
      filterValue === null ||
      filterValue === ""
    ) {
      return;
    }

    try {
      setSelectedFilterType(filterType);
      setSelectedFilterValue(String(filterValue));
      setFilterLoading(true);
      setShowFilterModal(true);

      const response = await api.get(
        "/feedback",
        {
          params: {
            [filterType]: filterValue,
          },
        }
      );

      setFilterFeedback(
        response.data.feedback || []
      );
    } catch (error) {
      console.error(
        "Chart Filter Error:",
        error.response?.data ||
          error.message
      );

      setFilterFeedback([]);

      toast.error(
        error.response?.data?.message ||
          "Failed to load filtered feedback"
      );
    } finally {
      setFilterLoading(false);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <Loading message="Loading analytics..." />
    );
  }

  // ========================================
  // ERROR STATE
  // ========================================

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={fetchAnalytics}
      />
    );
  }

  // ========================================
  // NO DATA
  // ========================================

  if (!analytics) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h2 className="text-xl font-semibold">
            No analytics data available
          </h2>
        </div>
      </div>
    );
  }

  // ========================================
  // SENTIMENT CHART
  // ========================================

  const sentimentData = {
    labels: [
      "Positive",
      "Negative",
      "Neutral",
    ],

    datasets: [
      {
        label: "Feedback",

        data: [
          analytics.sentiment.positive,
          analytics.sentiment.negative,
          analytics.sentiment.neutral,
        ],

        backgroundColor: [
          "#22c55e",
          "#ef4444",
          "#eab308",
        ],

        borderColor: [
          "#16a34a",
          "#dc2626",
          "#ca8a04",
        ],

        borderWidth: 1,
      },
    ],
  };

  // ========================================
  // CATEGORY CHART
  // ========================================

  const categoryData = {
    labels: [
      "Bug",
      "Feature Request",
      "Complaint",
      "Praise",
      "Other",
    ],

    datasets: [
      {
        label: "Feedback",

        data: [
          analytics.category.bug,
          analytics.category.featureRequest,
          analytics.category.complaint,
          analytics.category.praise,
          analytics.category.other,
        ],

        backgroundColor: [
          "#ef4444",
          "#8b5cf6",
          "#f97316",
          "#22c55e",
          "#64748b",
        ],

        borderColor: [
          "#dc2626",
          "#7c3aed",
          "#ea580c",
          "#16a34a",
          "#475569",
        ],

        borderWidth: 1,
      },
    ],
  };

  // ========================================
  // PRIORITY CHART
  // ========================================

  const priorityData = {
    labels: [
      "High",
      "Medium",
      "Low",
    ],

    datasets: [
      {
        label: "Feedback",

        data: [
          analytics.priority.high,
          analytics.priority.medium,
          analytics.priority.low,
        ],

        backgroundColor: [
          "#ef4444",
          "#f97316",
          "#22c55e",
        ],

        borderColor: [
          "#dc2626",
          "#ea580c",
          "#16a34a",
        ],

        borderWidth: 1,
      },
    ],
  };

  // ========================================
  // SOURCE CHART
  // ========================================

  const sourceData = {
    labels: [
      "Support Ticket",
      "App Review",
      "Survey",
      "Sales Note",
      "Other",
    ],

    datasets: [
      {
        label: "Feedback",

        data: [
          analytics.sources.supportTicket,
          analytics.sources.appReview,
          analytics.sources.survey,
          analytics.sources.salesNote,
          analytics.sources.other,
        ],

        backgroundColor: [
          "#3b82f6",
          "#8b5cf6",
          "#14b8a6",
          "#f59e0b",
          "#64748b",
        ],

        borderColor: [
          "#2563eb",
          "#7c3aed",
          "#0f766e",
          "#d97706",
          "#475569",
        ],

        borderWidth: 1,
      },
    ],
  };

  // ========================================
  // RATING CHART
  // ========================================

  const ratingData = {
    labels: [
      "1 Star",
      "2 Stars",
      "3 Stars",
      "4 Stars",
      "5 Stars",
    ],

    datasets: [
      {
        label: "Ratings",

        data: [
          analytics.ratingsDistribution.one,
          analytics.ratingsDistribution.two,
          analytics.ratingsDistribution.three,
          analytics.ratingsDistribution.four,
          analytics.ratingsDistribution.five,
        ],

        backgroundColor: [
          "#ef4444",
          "#f97316",
          "#eab308",
          "#84cc16",
          "#22c55e",
        ],

        borderColor: [
          "#dc2626",
          "#ea580c",
          "#ca8a04",
          "#65a30d",
          "#16a34a",
        ],

        borderWidth: 1,
      },
    ],
  };

  // ========================================
  // THEME DATA
  // ========================================

  const themeAnalytics =
    analytics.themeAnalytics || {
      totalThemes: 0,
      topThemes: [],
      trends: [],
      spikes: [],
    };

  const topThemes =
    themeAnalytics.topThemes || [];

  const spikes =
    themeAnalytics.spikes || [];

  // ========================================
  // TOP THEMES BAR CHART
  // ========================================

  const themeData = {
    labels: topThemes.map(
      (item) => item.theme
    ),

    datasets: [
      {
        label: "Feedback Count",

        data: topThemes.map(
          (item) =>
            item.mentions ??
            item.count ??
            0
        ),

        backgroundColor: "#6366f1",
        borderColor: "#4f46e5",

        borderWidth: 1,
      },
    ],
  };

  // ========================================
  // THEME TREND DATA
  // ========================================

  const trendDates =
    themeAnalytics.trends?.map(
      (item) => item.date
    ) || [];

  const themeNames = [
    ...new Set(
      (themeAnalytics.trends || []).flatMap(
        (item) =>
          Object.keys(item.themes || {})
      )
    ),
  ];

  const themeTrendDatasets =
    themeNames.map((theme) => ({
      label: theme,

      data: trendDates.map((date) => {
        const trend =
          themeAnalytics.trends.find(
            (item) =>
              item.date === date
          );

        return (
          trend?.themes?.[theme] || 0
        );
      }),

      borderWidth: 2,

      tension: 0.3,
    }));

  const themeTrendData = {
    labels: trendDates,

    datasets: themeTrendDatasets,
  };

  // ========================================
  // CHART OPTIONS
  // ========================================

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        enabled: true,
      },
    },

    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          precision: 0,
        },
      },

      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // ========================================
  // THEME BAR CHART OPTIONS
  // ========================================

  const themeBarOptions = {
    ...barOptions,

    onClick: (event, elements) => {
      if (!elements || elements.length === 0)
        return;

      const index = elements[0].index;
      const theme =
        topThemes[index]?.theme;

      if (theme) {
        handleThemeClick(theme);
      }
    },

    onHover: (event, elements) => {
      if (event?.native?.target) {
        event.native.target.style.cursor =
          elements && elements.length > 0
            ? "pointer"
            : "default";
      }
    },
  };

  const lineOptions = {
    responsive: true,

    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },

    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          precision: 0,
        },
      },
    },
  };

  // ========================================
  // THEME TREND CHART OPTIONS
  // ========================================

  const themeLineOptions = {
    ...lineOptions,

    onClick: (event, elements) => {
      if (!elements || elements.length === 0)
        return;

      const datasetIndex =
        elements[0].datasetIndex;

      const theme =
        themeTrendDatasets[
          datasetIndex
        ]?.label;

      if (theme) {
        handleThemeClick(theme);
      }
    },

    onHover: (event, elements) => {
      if (event?.native?.target) {
        event.native.target.style.cursor =
          elements && elements.length > 0
            ? "pointer"
            : "default";
      }
    },
  };

  // ========================================
  // CHART CLICK OPTIONS
  // ========================================

  const sentimentChartOptions = {
    plugins: {
      legend: {
        position: "top",
      },
    },

    onClick: (event, elements) => {
      if (!elements || elements.length === 0)
        return;

      const index = elements[0].index;

      const value =
        sentimentData.labels[index];

      handleFilterClick(
        "sentiment",
        value
      );
    },

    onHover: (event, elements) => {
      if (event?.native?.target) {
        event.native.target.style.cursor =
          elements && elements.length > 0
            ? "pointer"
            : "default";
      }
    },
  };

  const categoryChartOptions = {
    ...barOptions,

    onClick: (event, elements) => {
      if (!elements || elements.length === 0)
        return;

      const index = elements[0].index;

      const value =
        categoryData.labels[index];

      handleFilterClick(
        "category",
        value
      );
    },

    onHover: (event, elements) => {
      if (event?.native?.target) {
        event.native.target.style.cursor =
          elements && elements.length > 0
            ? "pointer"
            : "default";
      }
    },
  };

  const priorityChartOptions = {
    ...barOptions,

    onClick: (event, elements) => {
      if (!elements || elements.length === 0)
        return;

      const index = elements[0].index;

      const value =
        priorityData.labels[index];

      handleFilterClick(
        "priority",
        value
      );
    },

    onHover: (event, elements) => {
      if (event?.native?.target) {
        event.native.target.style.cursor =
          elements && elements.length > 0
            ? "pointer"
            : "default";
      }
    },
  };

  const sourceChartOptions = {
    ...barOptions,

    onClick: (event, elements) => {
      if (!elements || elements.length === 0)
        return;

      const index = elements[0].index;

      const value =
        sourceData.labels[index];

      handleFilterClick(
        "source",
        value
      );
    },

    onHover: (event, elements) => {
      if (event?.native?.target) {
        event.native.target.style.cursor =
          elements && elements.length > 0
            ? "pointer"
            : "default";
      }
    },
  };

  const ratingChartOptions = {
    ...barOptions,

    onClick: (event, elements) => {
      if (!elements || elements.length === 0)
        return;

      const index = elements[0].index;

      const value =
        ratingData.labels[index];

      handleFilterClick(
        "rating",
        String(value).replace(
          /[^0-9]/g,
          ""
        )
      );
    },

    onHover: (event, elements) => {
      if (event?.native?.target) {
        event.native.target.style.cursor =
          elements && elements.length > 0
            ? "pointer"
            : "default";
      }
    },
  };

  // ========================================
  // CLOSE FILTER MODAL
  // ========================================

  const closeFilterModal = () => {
    setShowFilterModal(false);
    setSelectedFilterType("");
    setSelectedFilterValue("");
    setFilterFeedback([]);
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">

      {/* ========================================
          ANALYTICS HEADER
      ======================================== */}

      <div className="mb-8">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                📊
              </div>

              <div>

                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Analytics Dashboard
                </h1>

                <p className="text-slate-500 mt-1">
                  Customer feedback intelligence and AI-powered insights
                </p>

              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={fetchAnalytics}
            disabled={loading}
            className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl font-semibold shadow-sm transition disabled:opacity-50"
          >
            <span
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            >
              🔄
            </span>

            {loading
              ? "Refreshing..."
              : "Refresh Analytics"}
          </button>

        </div>

      </div>

      {/* ========================================
          STAT CARDS
      ======================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        {/* TOTAL FEEDBACK */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Total Feedback
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                {analytics.totalFeedback ?? 0}
              </h2>

            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
              💬
            </div>

          </div>

          <div className="mt-4">

            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Customer Responses
            </span>

          </div>

        </div>

        {/* AVERAGE RATING */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Average Rating
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                ⭐ {analytics.averageRating ?? 0}
              </h2>

            </div>

            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center text-2xl">
              ⭐
            </div>

          </div>

          <div className="mt-4">

            <div className="flex items-center justify-between text-xs mb-1">

              <span className="text-slate-500">
                Overall satisfaction
              </span>

              <span className="font-semibold text-slate-700">
                / 5
              </span>

            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">

              <div
                className="h-full bg-yellow-400 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    ((Number(
                      analytics.averageRating
                    ) || 0) /
                      5) *
                      100,
                    100
                  )}%`,
                }}
              />

            </div>

          </div>

        </div>

        {/* POSITIVE FEEDBACK */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Positive Feedback
              </p>

              <h2 className="text-3xl font-bold text-green-600 mt-2">
                {analytics.sentiment?.positive ?? 0}
              </h2>

            </div>

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
              😊
            </div>

          </div>

          <div className="mt-4">

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
              ↑ Positive Sentiment
            </span>

          </div>

        </div>

        {/* NEGATIVE FEEDBACK */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Negative Feedback
              </p>

              <h2 className="text-3xl font-bold text-red-600 mt-2">
                {analytics.sentiment?.negative ?? 0}
              </h2>

            </div>

            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-2xl">
              ⚠️
            </div>

          </div>

          <div className="mt-4">

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
              ⚡ Needs Attention
            </span>

          </div>

        </div>

      </div>

      {/* ========================================
          AI INSIGHTS SUMMARY
      ======================================== */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7 mb-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
              🤖
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                AI Insights
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Automatically generated insights from customer feedback
              </p>

            </div>

          </div>

          <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-xs font-semibold">
            ✨ AI Powered
          </span>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* NEUTRAL FEEDBACK */}

          <div className="group bg-slate-50 border border-slate-200 rounded-xl p-5 hover:bg-white hover:shadow-md transition">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Neutral Feedback
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-2">
                  {analytics.sentiment?.neutral ?? 0}
                </p>

              </div>

              <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-lg">
                😐
              </div>

            </div>

            <p className="text-sm text-slate-500 mt-4 leading-5">
              Feedback currently classified as neutral sentiment.
            </p>

            <div className="mt-4 h-1.5 bg-slate-200 rounded-full overflow-hidden">

              <div
                className="h-full bg-slate-500 rounded-full"
                style={{
                  width: `${
                    analytics.totalFeedback
                      ? Math.min(
                          ((analytics.sentiment?.neutral ?? 0) /
                            analytics.totalFeedback) *
                            100,
                          100
                        )
                      : 0
                  }%`,
                }}
              />

            </div>

          </div>

          {/* FEATURE REQUESTS */}

          <div className="group bg-purple-50 border border-purple-100 rounded-xl p-5 hover:bg-white hover:shadow-md transition">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-purple-600">
                  Feature Requests
                </p>

                <p className="text-3xl font-bold text-purple-700 mt-2">
                  {analytics.category?.featureRequest ?? 0}
                </p>

              </div>

              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-lg">
                💡
              </div>

            </div>

            <p className="text-sm text-purple-600 mt-4 leading-5">
              Customers requesting new features or improvements.
            </p>

            <div className="mt-4 h-1.5 bg-purple-100 rounded-full overflow-hidden">

              <div
                className="h-full bg-purple-600 rounded-full"
                style={{
                  width: `${
                    analytics.totalFeedback
                      ? Math.min(
                          ((analytics.category?.featureRequest ?? 0) /
                            analytics.totalFeedback) *
                            100,
                          100
                        )
                      : 0
                  }%`,
                }}
              />

            </div>

          </div>

          {/* MEDIUM PRIORITY */}

          <div className="group bg-orange-50 border border-orange-100 rounded-xl p-5 hover:bg-white hover:shadow-md transition">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-orange-600">
                  Medium Priority
                </p>

                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {analytics.priority?.medium ?? 0}
                </p>

              </div>

              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-lg">
                🟠
              </div>

            </div>

            <p className="text-sm text-orange-600 mt-4 leading-5">
              Feedback requiring attention but not immediately critical.
            </p>

            <div className="mt-4 h-1.5 bg-orange-100 rounded-full overflow-hidden">

              <div
                className="h-full bg-orange-500 rounded-full"
                style={{
                  width: `${
                    analytics.totalFeedback
                      ? Math.min(
                          ((analytics.priority?.medium ?? 0) /
                            analytics.totalFeedback) *
                            100,
                          100
                        )
                      : 0
                  }%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>

      {/* ================================= */}
      {/* CUSTOMER THEMES */}
      {/* ================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* TOP THEMES LIST */}

        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                📊 Top Customer Themes
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Most common topics identified from feedback
              </p>

            </div>

            <div className="bg-blue-50 px-4 py-2 rounded-lg">

              <p className="text-xs text-slate-500">
                Total Themes
              </p>

              <p className="text-xl font-bold text-blue-600">
                {themeAnalytics.totalThemes}
              </p>

            </div>

          </div>

          {topThemes.length === 0 ? (

            <div className="text-center py-10">

              <div className="text-4xl mb-3">
                📭
              </div>

              <p className="text-slate-500">
                No themes available yet.
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Create feedback to generate AI themes.
              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {topThemes.map(
                (item, index) => (

                  <button
                    type="button"
                    key={`${item.theme}-${index}`}
                    onClick={() =>
                      handleThemeClick(item.theme)
                    }
                    className="w-full text-left border border-slate-200 rounded-lg p-4 hover:bg-blue-50 hover:border-blue-400 transition cursor-pointer"
                    title={`View feedback for ${item.theme}`}
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                          {index + 1}
                        </div>

                        <div>

                          <p className="font-semibold text-slate-800">
                            {item.theme}
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            {item.mentions ?? item.count ?? 0} feedback{" "}
                            {(item.mentions ?? item.count ?? 0) === 1
                              ? "mention"
                              : "mentions"}
                          </p>

                        </div>

                      </div>

                      <div className="text-right">

                        <p className="text-lg font-bold text-slate-900">
                          {item.mentions ?? item.count ?? 0}
                        </p>

                        <p className="text-xs text-slate-400">
                          mentions
                        </p>

                      </div>

                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">

                      {item.positive > 0 && (
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                          Positive: {item.positive}
                        </span>
                      )}

                      {item.negative > 0 && (
                        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                          Negative: {item.negative}
                        </span>
                      )}

                      {item.neutral > 0 && (
                        <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                          Neutral: {item.neutral}
                        </span>
                      )}

                    </div>

                  </button>

                )
              )}

            </div>

          )}

        </div>

        {/* TOP THEMES BAR CHART */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold text-slate-900 mb-2">
          Theme Frequency
          </h2>

          <p className="text-sm text-slate-500 mb-4">
           Number of feedback entries per theme
          </p>

          {topThemes.length === 0 ? (

          <div className="h-56 flex items-center justify-center text-slate-400">
            No theme data available
          </div>

          ) : (

        <div className="h-64 w-full">
        <Bar
          data={themeData}
          options={{
          ...themeBarOptions,
          maintainAspectRatio: false,
          responsive: true,
         }}
        />
      </div>

        )}

      </div>
      </div>

      {/* ================================= */}
      {/* DETECTED SPIKES */}
      {/* ================================= */}

      {spikes.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center text-xl">
                🚨
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Detected Spikes
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Themes showing a significant increase in feedback
                </p>

              </div>

            </div>

            <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
              {spikes.length} Spike
              {spikes.length > 1 ? "s" : ""}
            </span>

          </div>

          <div className="space-y-4">

            {spikes.map(
              (spike, index) => (

                <button
                  type="button"
                  key={`${spike.theme}-${spike.date}-${index}`}
                  onClick={() =>
                    handleThemeClick(
                      spike.theme
                    )
                  }
                  className="w-full text-left border border-red-200 rounded-xl p-5 bg-red-50 hover:bg-red-100 hover:border-red-300 transition"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                      <h3 className="font-bold text-slate-900">
                        {spike.theme}
                      </h3>

                      <p className="text-sm text-slate-600 mt-1">
                        Spike detected on{" "}
                        {spike.date}
                      </p>

                    </div>

                    <span className="text-red-700 font-bold text-lg">
                      ↑ {spike.increasePercent}%
                    </span>

                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">

                    <div className="bg-white rounded-lg p-3 border border-red-100">

                      <span className="text-xs text-slate-500">
                        Previous Count
                      </span>

                      <p className="text-lg font-bold text-slate-900 mt-1">
                        {spike.previousCount}
                      </p>

                    </div>

                    <div className="bg-white rounded-lg p-3 border border-red-100">

                      <span className="text-xs text-slate-500">
                        Current Count
                      </span>

                      <p className="text-lg font-bold text-slate-900 mt-1">
                        {spike.currentCount}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center justify-between mt-4">

                    <span className="text-sm font-semibold text-red-600">
                      ⚡ Review this theme
                    </span>

                    <span className="text-red-600 font-bold">
                      →
                    </span>

                  </div>

                </button>

              )
            )}

          </div>

        </div>
      )}

      {/* ================================= */}
      {/* ACTION REQUIRED */}
      {/* ================================= */}

      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <div className="flex items-center gap-3 mb-6">

          <span className="text-2xl">
            ⚠️
          </span>

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              Action Required
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Themes that require attention based on AI analysis
            </p>

          </div>

        </div>

        {topThemes.filter(
          (item) => item.actionRequired
        ).length === 0 ? (

          <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center">

            <div className="text-4xl mb-3">
              ✅
            </div>

            <p className="font-semibold text-green-700">
              No immediate action required
            </p>

            <p className="text-sm text-green-600 mt-1">
              All customer themes are currently under control.
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {topThemes
              .filter(
                (item) => item.actionRequired
              )
              .map((item, index) => (

                <button
                  type="button"
                  key={`${item.theme}-action-${index}`}
                  onClick={() =>
                    handleThemeClick(
                      item.theme
                    )
                  }
                  className="w-full text-left border border-red-200 bg-red-50 rounded-xl p-5 hover:bg-red-100 hover:border-red-300 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                        ⚠️
                      </div>

                      <div>

                        <h3 className="font-bold text-slate-900">
                          {item.theme}
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                          {item.mentions ?? item.count ?? 0}{" "}
                          {(item.mentions ?? item.count ?? 0) === 1
                            ? "feedback"
                            : "feedbacks"}
                        </p>

                      </div>

                    </div>

                    <div className="flex flex-wrap gap-2">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.dominantSentiment === "Negative"
                            ? "bg-red-200 text-red-700"
                            : item.dominantSentiment === "Positive"
                            ? "bg-green-200 text-green-700"
                            : "bg-yellow-200 text-yellow-700"
                        }`}
                      >
                        {item.dominantSentiment ||
                          "Neutral"}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.priority === "High"
                            ? "bg-red-200 text-red-700"
                            : item.priority === "Medium"
                            ? "bg-orange-200 text-orange-700"
                            : "bg-green-200 text-green-700"
                        }`}
                      >
                        {item.priority || "Low"} Priority
                      </span>

                    </div>

                  </div>

                  <div className="mt-4 bg-white rounded-lg p-4 border border-red-100">

                    <p className="text-sm font-semibold text-slate-700">
                      Why attention is required?
                    </p>

                    <div className="flex flex-wrap gap-3 mt-3 text-sm">

                      {item.negative > 0 && (
                        <span className="text-red-600">
                          🔴 {item.negative} negative feedback
                        </span>
                      )}

                      {item.highPriority > 0 && (
                        <span className="text-red-600">
                          🚨 {item.highPriority} high priority
                        </span>
                      )}

                      {item.mediumPriority > 0 && (
                        <span className="text-orange-600">
                          🟠 {item.mediumPriority} medium priority
                        </span>
                      )}

                    </div>

                  </div>

                  <div className="flex items-center justify-between mt-4">

                    <span className="text-sm font-medium text-red-600">
                      ⚡ Review this theme
                    </span>

                    <span className="text-red-600 font-bold">
                      →
                    </span>

                  </div>

                </button>

              ))}

          </div>

        )}

      </div>

      {/* ================================= */}
      {/* THEME TRENDS */}
      {/* ================================= */}

      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <div className="mb-6">

          <h2 className="text-xl font-bold text-slate-900">
            📈 Theme Trends
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Track how customer themes change over time
          </p>

        </div>

        {themeTrendDatasets.length === 0 ? (

          <div className="text-center py-12">

            <div className="text-4xl mb-3">
              📈
            </div>

            <p className="text-slate-500">
              Not enough theme trend data yet.
            </p>

            <p className="text-sm text-slate-400 mt-1">
              Create feedback on different dates to see trends.
            </p>

          </div>

        ) : (

          <div className="w-full overflow-x-auto">

            <div className="min-w-[700px]">

              <Line
                data={themeTrendData}
                options={themeLineOptions}
              />

            </div>

          </div>

        )}

      </div>

      {/* ================================= */}
      {/* EXISTING CHARTS */}
      {/* ================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* SENTIMENT */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Sentiment Distribution
          </h2>

          <div className="max-w-sm mx-auto">

            <Doughnut
              data={sentimentData}
              options={sentimentChartOptions}
            />

          </div>

        </div>

        {/* CATEGORY */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Feedback Categories
          </h2>

          <div className="h-72">

            <Bar
              data={categoryData}
              options={categoryChartOptions}
            />

          </div>

        </div>

        {/* PRIORITY */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Priority Distribution
          </h2>

          <div className="h-72">

            <Bar
              data={priorityData}
              options={priorityChartOptions}
            />

          </div>

        </div>

        {/* SOURCE */}

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Feedback Sources
          </h2>

          <div className="h-72">

            <Bar
              data={sourceData}
              options={sourceChartOptions}
            />

          </div>

        </div>

        {/* RATINGS */}

        <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">

          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Rating Distribution
          </h2>

          <div className="h-72">

            <Bar
              data={ratingData}
              options={ratingChartOptions}
            />

          </div>

        </div>

      </div>

      {/* ================================= */}
      {/* CHART FILTER FEEDBACK MODAL */}
      {/* ================================= */}

      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl">

            <div className="flex items-center justify-between px-6 py-5 border-b">

              <div>

                <p className="text-sm text-slate-500">
                  Filtered Feedback
                </p>

                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedFilterValue}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {filterFeedback.length} feedback{" "}
                  {filterFeedback.length === 1
                    ? "entry"
                    : "entries"}{" "}
                  found
                </p>

              </div>

              <button
                type="button"
                onClick={closeFilterModal}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xl transition"
                aria-label="Close filtered feedback"
              >
                ✕
              </button>

            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-125px)]">

              {filterLoading ? (

                <div className="py-16 text-center">

                  <div className="text-4xl mb-3">
                    ⏳
                  </div>

                  <p className="text-slate-500">
                    Loading feedback...
                  </p>

                </div>

              ) : filterFeedback.length === 0 ? (

                <div className="py-16 text-center">

                  <div className="text-4xl mb-3">
                    📭
                  </div>

                  <p className="font-semibold text-slate-800">
                    No feedback found
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    No feedback matches this filter.
                  </p>

                </div>

              ) : (

                <div className="space-y-4">

                  {filterFeedback.map(
                    (item) => (

                      <div
                        key={item._id}
                        className="border border-slate-200 rounded-xl p-5 hover:bg-slate-50 transition"
                      >

                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                          <div>

                            <h3 className="font-semibold text-slate-900">
                              {item.customerName ||
                                "Unknown Customer"}
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                              {item.email ||
                                "No email"}
                            </p>

                          </div>

                          <div className="flex flex-wrap gap-2">

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                item.sentiment ===
                                "Negative"
                                  ? "bg-red-100 text-red-700"
                                  : item.sentiment ===
                                    "Positive"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {item.sentiment ||
                                "Neutral"}
                            </span>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                                "Medium"}
                            </span>

                          </div>

                        </div>

                        <p className="text-slate-700 mt-4">
                          {item.message ||
                            "No message"}
                        </p>

                        {item.summary && (
                          <div className="mt-4 bg-blue-50 rounded-lg p-4">

                            <p className="text-xs font-semibold text-blue-700 uppercase">
                              AI Summary
                            </p>

                            <p className="text-sm text-slate-700 mt-1">
                              {item.summary}
                            </p>

                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 mt-4">

                          <span className="px-3 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                            {item.source ||
                              "Other"}
                          </span>

                          <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                            {item.category ||
                              "Other"}
                          </span>

                          <span className="px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">
                            {item.theme ||
                              "General"}
                          </span>

                          {item.rating && (
                            <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                              ⭐ {item.rating}/5
                            </span>
                          )}

                          <span className="px-3 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                            {item.status ||
                              "New"}
                          </span>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </div>

        </div>
      )}

      {/* ================================= */}
      {/* THEME FEEDBACK MODAL */}
      {/* ================================= */}

      {showThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl">

            <div className="flex items-center justify-between px-6 py-5 border-b">

              <div>

                <p className="text-sm text-slate-500">
                  Theme Feedback
                </p>

                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedTheme}
                </h2>

              </div>

              <button
                type="button"
                onClick={closeThemeModal}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xl transition"
                aria-label="Close theme feedback"
              >
                ✕
              </button>

            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-90px)]">

              {themeLoading ? (

                <div className="py-16 text-center">

                  <div className="text-4xl mb-3">
                    ⏳
                  </div>

                  <p className="text-slate-500">
                    Loading theme feedback...
                  </p>

                </div>

              ) : themeFeedback.length === 0 ? (

                <div className="py-16 text-center">

                  <div className="text-4xl mb-3">
                    📭
                  </div>

                  <p className="font-semibold text-slate-800">
                    No feedback found
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    There is no feedback available for this theme.
                  </p>

                </div>

              ) : (

                <div className="space-y-4">

                  {themeFeedback.map(
                    (item) => (

                      <div
                        key={item._id}
                        className="border border-slate-200 rounded-xl p-5 hover:bg-slate-50 transition"
                      >

                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                          <div>

                            <h3 className="font-semibold text-slate-900">
                              {item.customerName ||
                                "Unknown Customer"}
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                              {item.email ||
                                "No email"}
                            </p>

                          </div>

                          <div className="flex flex-wrap gap-2">

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                item.sentiment ===
                                "Negative"
                                  ? "bg-red-100 text-red-700"
                                  : item.sentiment ===
                                    "Positive"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {item.sentiment ||
                                "Neutral"}
                            </span>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                                "Medium"}
                            </span>

                          </div>

                        </div>

                        <p className="text-slate-700 mt-4">
                          {item.message ||
                            "No message"}
                        </p>

                        {item.summary && (
                          <div className="mt-4 bg-blue-50 rounded-lg p-4">

                            <p className="text-xs font-semibold text-blue-700 uppercase">
                              AI Summary
                            </p>

                            <p className="text-sm text-slate-700 mt-1">
                              {item.summary}
                            </p>

                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 mt-4">

                          <span className="px-3 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                            {item.source ||
                              "Other"}
                          </span>

                          <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                            {item.category ||
                              "Other"}
                          </span>

                          {item.rating && (
                            <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                              ⭐ {item.rating}/5
                            </span>
                          )}

                          <span className="px-3 py-1 rounded-full text-xs bg-slate-100 text-slate-700">
                            {item.status ||
                              "New"}
                          </span>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Analytics;