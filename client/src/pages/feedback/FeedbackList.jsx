import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

import api from "../../services/api";
import Loading from "../../components/common/Loading";
import ErrorState from "../../components/common/ErrorState";

const FeedbackList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log("🔐 CURRENT USER:", user);
  // ========================================
  // ROLE-BASED PERMISSIONS
  // ========================================

  // Users can manage their own feedback.
  // Managers can edit feedback.
  // Admins have full access.
  const canEdit =
    user?.role === "admin" ||
    user?.role === "analyst";

  const canDelete =
    user?.role === "admin";

  // ========================================
  // STATE
  // ========================================

  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadingCSV, setUploadingCSV] = useState(false);

  // ========================================
  // FILTERS
  // ========================================

  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [themeFilter, setThemeFilter] = useState("All");

  // ========================================
  // GET FEEDBACK
  // ========================================

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/feedback");

      setFeedback(response.data.feedback || []);
    } catch (error) {
      console.error("❌ Feedback Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load feedback."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    fetchFeedback();
  }, []);

  // ========================================
  // DELETE
  // ========================================
  const handleCSVUpload = async (event) => {
    const file = event.target.files?.[0];
  
    if (!file

    ) return;
  
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please select a CSV file");
      event.target.value = "";
      return;
    }
  
    try {
      setUploadingCSV(true);
  
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await api.post(
        "/csv/feedback",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      toast.success(
        response.data.message ||
          "CSV imported successfully"
      );
  
      await fetchFeedback();
  
    } catch (error) {
      console.error(
        "❌ CSV Upload Error:",
        error
      );
  
      toast.error(
        error.response?.data?.message ||
          "Failed to upload CSV"
      );
  
    } finally {
      setUploadingCSV(false);
  
      // Same file पुन्हा select करता यावा
      event.target.value = "";
    }
  };

  // ========================================
// EXPORT FEEDBACK CSV
// ========================================

const handleExportCSV = () => {
  try {
    if (!feedback.length) {
      toast.error("No feedback available to export");
      return;
    }

    const headers = [
      "customerName",
      "email",
      "source",
      "message",
      "rating",
      "status",
      "sentiment",
      "category",
      "priority",
      "theme",
      "summary",
    ];

    const escapeCSV = (value) => {
      const text = String(value ?? "");
      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = feedback.map((item) =>
      headers
        .map((header) => escapeCSV(item[header]))
        .join(",")
    );

    const csvContent = [
      headers.join(","),
      ...rows,
    ].join("\n");

    const blob = new Blob(
      [csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "LOOP-feedback.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    toast.success(
      `${feedback.length} feedback records exported successfully`
    );
  } catch (error) {
    console.error("❌ CSV Export Error:", error);
    toast.error("Failed to export CSV");
  }
};
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this feedback?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/feedback/${id}`);

      setFeedback((prev) =>
        prev.filter((item) => item._id !== id)
      );

      toast.success("Feedback deleted successfully");
    } catch (error) {
      console.error(
        "❌ Delete Feedback Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete feedback"
      );
    }
  };

  // ========================================
  // DYNAMIC THEMES
  // ========================================

  const themes = useMemo(() => {
    const uniqueThemes = feedback
      .map((item) => item.theme)
      .filter(Boolean);

    return [...new Set(uniqueThemes)].sort();
  }, [feedback]);

  // ========================================
  // FILTER FEEDBACK
  // ========================================

  const filteredFeedback = useMemo(() => {
    return feedback.filter((item) => {
      const searchText = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !searchText ||
        item.customerName
          ?.toLowerCase()
          .includes(searchText) ||
        item.email
          ?.toLowerCase()
          .includes(searchText) ||
        item.message
          ?.toLowerCase()
          .includes(searchText) ||
        item.category
          ?.toLowerCase()
          .includes(searchText) ||
        item.summary
          ?.toLowerCase()
          .includes(searchText) ||
        item.theme
          ?.toLowerCase()
          .includes(searchText);

      const matchesSource =
        sourceFilter === "All" ||
        item.source === sourceFilter;

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      const matchesRating =
        ratingFilter === "All" ||
        Number(item.rating) === Number(ratingFilter);

      const matchesSentiment =
        sentimentFilter === "All" ||
        item.sentiment === sentimentFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        item.priority === priorityFilter;

      const matchesTheme =
        themeFilter === "All" ||
        item.theme === themeFilter;

      return (
        matchesSearch &&
        matchesSource &&
        matchesStatus &&
        matchesRating &&
        matchesSentiment &&
        matchesPriority &&
        matchesTheme
      );
    });
  }, [
    feedback,
    search,
    sourceFilter,
    statusFilter,
    ratingFilter,
    sentimentFilter,
    priorityFilter,
    themeFilter,
  ]);

  // ========================================
  // ACTIVE FILTER COUNT
  // ========================================

  const activeFilterCount = [
    search,
    sourceFilter !== "All",
    statusFilter !== "All",
    ratingFilter !== "All",
    sentimentFilter !== "All",
    priorityFilter !== "All",
    themeFilter !== "All",
  ].filter(Boolean).length;

  // ========================================
  // CLEAR FILTERS
  // ========================================

  const clearFilters = () => {
    setSearch("");
    setSourceFilter("All");
    setStatusFilter("All");
    setRatingFilter("All");
    setSentimentFilter("All");
    setPriorityFilter("All");
    setThemeFilter("All");
  };

  // ========================================
  // SENTIMENT STYLE
  // ========================================

  const getSentimentStyle = (sentiment) => {
    if (sentiment === "Positive") {
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (sentiment === "Negative") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  // ========================================
  // PRIORITY STYLE
  // ========================================

  const getPriorityStyle = (priority) => {
    if (priority === "High") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    if (priority === "Medium") {
      return "bg-orange-100 text-orange-700 border-orange-200";
    }

    if (priority === "Low") {
      return "bg-green-100 text-green-700 border-green-200";
    }

    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  // ========================================
  // STATUS STYLE
  // ========================================

  const getStatusStyle = (status) => {
    if (status === "New") {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }

    if (status === "Reviewed") {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }

    if (status === "Resolved") {
      return "bg-green-100 text-green-700 border-green-200";
    }

    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return <Loading message="Loading feedback..." />;
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={fetchFeedback}
      />
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-8">

      <div className="max-w-[1800px] mx-auto">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-7">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
              💬
            </div>

            <div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Customer Feedback
              </h1>

              <p className="text-slate-500 mt-1">
                Manage, review and analyze customer feedback
              </p>

            </div>

          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="csv-upload-input"
              type="file"
              accept=".csv,text/csv"
              onChange={handleCSVUpload}
              className="hidden"
            />

            <button
              onClick={fetchFeedback}
              className="w-full sm:w-auto border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
            >
              🔄 Refresh
            </button>

            <button
              onClick={() =>
              document.getElementById("csv-upload-input").click()
              }
              disabled={uploadingCSV}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-semibold transition shadow-sm flex items-center justify-center gap-2"
             >
              📥 {uploadingCSV ? "Uploading..." : "Import CSV"}
            </button>
            <button
               onClick={handleExportCSV}
               className="w-full sm:w-auto bg-slate-700 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-semibold transition shadow-sm flex items-center justify-center gap-2"
            >
              📤 Export CSV
            </button>

            <button
              onClick={() => navigate("/feedback/add")}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition shadow-sm flex items-center justify-center gap-2"
            >
              ➕ Add Feedback
            </button>


          </div>

        </div>


        {/* ========================================
            SUMMARY CARDS
        ======================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Total Feedback
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {feedback.length}
                </p>

              </div>

              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                💬
              </div>

            </div>

          </div>


          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Positive
                </p>

                <p className="text-2xl font-bold text-green-600 mt-1">
                  {
                    feedback.filter(
                      (item) =>
                        item.sentiment === "Positive"
                    ).length
                  }
                </p>

              </div>

              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                😊
              </div>

            </div>

          </div>


          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Negative
                </p>

                <p className="text-2xl font-bold text-red-600 mt-1">
                  {
                    feedback.filter(
                      (item) =>
                        item.sentiment === "Negative"
                    ).length
                  }
                </p>

              </div>

              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                😟
              </div>

            </div>

          </div>


          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  High Priority
                </p>

                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {
                    feedback.filter(
                      (item) =>
                        item.priority === "High"
                    ).length
                  }
                </p>

              </div>

              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                🔥
              </div>

            </div>

          </div>

        </div>


        {/* ========================================
            SEARCH & FILTERS
        ======================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Search & Filters
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Find specific customer feedback quickly
              </p>

            </div>

            {activeFilterCount > 0 && (
              <span className="inline-flex items-center w-fit bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-lg text-xs font-semibold">
                {activeFilterCount} active filter
                {activeFilterCount > 1 ? "s" : ""}
              </span>
            )}

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* SEARCH */}

            <div className="sm:col-span-2 lg:col-span-2">

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Feedback
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔎
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Customer, email, message, category, theme..."
                  className="w-full border border-slate-300 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />

              </div>

            </div>


            {/* SOURCE */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Source
              </label>

              <select
                value={sourceFilter}
                onChange={(e) =>
                  setSourceFilter(e.target.value)
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">
                  All Sources
                </option>

                <option value="Support Ticket">
                  Support Ticket
                </option>

                <option value="App Review">
                  App Review
                </option>

                <option value="Survey">
                  Survey
                </option>

                <option value="Sales Note">
                  Sales Note
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

            </div>


            {/* STATUS */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">
                  All Status
                </option>

                <option value="New">
                  New
                </option>

                <option value="Reviewed">
                  Reviewed
                </option>

                <option value="Resolved">
                  Resolved
                </option>
              </select>

            </div>


            {/* RATING */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Rating
              </label>

              <select
                value={ratingFilter}
                onChange={(e) =>
                  setRatingFilter(e.target.value)
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">
                  All Ratings
                </option>

                <option value="5">
                  ⭐ 5 Stars
                </option>

                <option value="4">
                  ⭐ 4 Stars
                </option>

                <option value="3">
                  ⭐ 3 Stars
                </option>

                <option value="2">
                  ⭐ 2 Stars
                </option>

                <option value="1">
                  ⭐ 1 Star
                </option>

              </select>

            </div>


            {/* SENTIMENT */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Sentiment
              </label>

              <select
                value={sentimentFilter}
                onChange={(e) =>
                  setSentimentFilter(e.target.value)
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">
                  All Sentiments
                </option>

                <option value="Positive">
                  😊 Positive
                </option>

                <option value="Negative">
                  😟 Negative
                </option>

                <option value="Neutral">
                  😐 Neutral
                </option>

              </select>

            </div>


            {/* PRIORITY */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Priority
              </label>

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value)
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">
                  All Priorities
                </option>

                <option value="High">
                  🔴 High
                </option>

                <option value="Medium">
                  🟠 Medium
                </option>

                <option value="Low">
                  🟢 Low
                </option>

              </select>

            </div>


            {/* THEME */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Theme
              </label>

              <select
                value={themeFilter}
                onChange={(e) =>
                  setThemeFilter(e.target.value)
                }
                className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">
                  All Themes
                </option>

                {themes.map((theme) => (
                  <option
                    key={theme}
                    value={theme}
                  >
                    {theme}
                  </option>
                ))}

              </select>

            </div>

          </div>


          {/* FILTER FOOTER */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5 pt-4 border-t border-slate-200">

            <p className="text-sm text-slate-500">

              Showing{" "}

              <span className="font-bold text-slate-800">
                {filteredFeedback.length}
              </span>

              {" "}of{" "}

              <span className="font-bold text-slate-800">
                {feedback.length}
              </span>

              {" "}feedback

            </p>


            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
              >
                Clear all filters
              </button>
            )}

          </div>

        </div>


        {/* ========================================
            EMPTY STATE
        ======================================== */}

        {filteredFeedback.length === 0 ? (

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">

            <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-3xl">
              🔍
            </div>

            <h2 className="text-xl font-bold text-slate-800 mt-5">
              No feedback found
            </h2>

            <p className="text-slate-500 mt-2">
              Try changing your search or filters.
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold"
            >
              Clear Filters
            </button>

          </div>

        ) : (

          <>

            {/* ========================================
                DESKTOP TABLE
            ======================================== */}

            <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

                <div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Feedback Records
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    {filteredFeedback.length} records displayed
                  </p>

                </div>

                <span className="text-sm text-slate-500">
                  Click a theme to view analytics
                </span>

              </div>


              <div className="overflow-x-auto">

                <table className="w-full min-w-[1500px]">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Customer
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Source
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Message
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Rating
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Sentiment
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Category
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Theme
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Priority
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                      <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredFeedback.map((item) => (

                      <tr
                        key={item._id}
                        className="border-t border-slate-100 hover:bg-slate-50 transition"
                      >

                        {/* CUSTOMER */}

                        <td className="px-6 py-5">

                          <p className="font-semibold text-slate-900">
                            {item.customerName}
                          </p>

                          <p className="text-sm text-slate-500 mt-1">
                            {item.email || "-"}
                          </p>

                        </td>


                        {/* SOURCE */}

                        <td className="px-6 py-5">

                          <span className="text-sm text-slate-700">
                            {item.source || "-"}
                          </span>

                        </td>


                        {/* MESSAGE */}

                        <td className="px-6 py-5 max-w-xs">

                          <p
                            className="truncate text-slate-700"
                            title={item.message}
                          >
                            {item.message || "-"}
                          </p>

                        </td>


                        {/* RATING */}

                        <td className="px-6 py-5">

                          {item.rating ? (

                            <span className="font-semibold text-slate-800">
                              ⭐ {item.rating}/5
                            </span>

                          ) : (
                            "-"
                          )}

                        </td>


                        {/* SENTIMENT */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold ${getSentimentStyle(
                              item.sentiment
                            )}`}
                          >
                            {item.sentiment || "Neutral"}
                          </span>

                        </td>


                        {/* CATEGORY */}

                        <td className="px-6 py-5">

                          <span className="inline-flex px-3 py-1 rounded-full border border-purple-200 bg-purple-100 text-purple-700 text-xs font-semibold">
                            {item.category || "Other"}
                          </span>

                        </td>


                        {/* THEME */}

                        <td className="px-6 py-5">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/analytics?theme=${encodeURIComponent(
                                  item.theme || "General"
                                )}`
                              )
                            }
                            className="inline-flex px-3 py-1 rounded-full border border-indigo-200 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-xs font-semibold transition"
                          >
                            {item.theme || "General"}
                          </button>

                        </td>


                        {/* PRIORITY */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold ${getPriorityStyle(
                              item.priority
                            )}`}
                          >
                            {item.priority || "Medium"}
                          </span>

                        </td>


                        {/* STATUS */}

                        <td className="px-6 py-5">

                          <span
                            className={`inline-flex px-3 py-1 rounded-full border text-xs font-semibold ${getStatusStyle(
                              item.status
                            )}`}
                          >
                            {item.status || "-"}
                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2">

                            <button
                              onClick={() =>
                                navigate(
                                  `/feedback/view/${item._id}`
                                )
                              }
                              className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm font-semibold"
                            >
                              View
                            </button>

                            {canEdit && (
                              <button
                                onClick={() =>
                                  navigate(
                                    `/feedback/edit/${item._id}`
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-semibold"
                              >
                                Edit
                              </button>
                            )}

                            {canDelete && (
                              <button
                                onClick={() =>
                                  handleDelete(item._id)
                                }
                                className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-sm font-semibold"
                              >
                                Delete
                              </button>
                            )}

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>


            {/* ========================================
                MOBILE / TABLET CARDS
            ======================================== */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-5">

              {filteredFeedback.map((item) => (

                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition"
                >

                  {/* CARD HEADER */}

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                          {item.customerName
                            ?.charAt(0)
                            ?.toUpperCase() || "C"}
                        </div>

                        <div className="min-w-0">

                          <h3 className="font-bold text-slate-900 truncate">
                            {item.customerName}
                          </h3>

                          <p className="text-sm text-slate-500 truncate">
                            {item.email || "-"}
                          </p>

                        </div>

                      </div>

                    </div>


                    <span
                      className={`shrink-0 px-3 py-1 rounded-full border text-xs font-semibold ${getPriorityStyle(
                        item.priority
                      )}`}
                    >
                      {item.priority || "Medium"}
                    </span>

                  </div>


                  {/* MESSAGE */}

                  <div className="mt-5">

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                      Customer Message
                    </p>

                    <div className="bg-slate-50 rounded-xl p-4">

                      <p className="text-sm text-slate-700 leading-relaxed">
                        {item.message || "-"}
                      </p>

                    </div>

                  </div>


                  {/* DETAILS */}

                  <div className="grid grid-cols-2 gap-4 mt-5">

                    <div>

                      <p className="text-xs text-slate-500">
                        Source
                      </p>

                      <p className="text-sm font-semibold text-slate-800 mt-1">
                        {item.source || "-"}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        Rating
                      </p>

                      <p className="text-sm font-semibold text-slate-800 mt-1">
                        {item.rating
                          ? `⭐ ${item.rating}/5`
                          : "-"}
                      </p>

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        Category
                      </p>

                      <span className="inline-flex mt-1 px-2.5 py-1 rounded-full border border-purple-200 bg-purple-100 text-purple-700 text-xs font-semibold">
                        {item.category || "Other"}
                      </span>

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        Sentiment
                      </p>

                      <span
                        className={`inline-flex mt-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${getSentimentStyle(
                          item.sentiment
                        )}`}
                      >
                        {item.sentiment || "Neutral"}
                      </span>

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        Status
                      </p>

                      <span
                        className={`inline-flex mt-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${getStatusStyle(
                          item.status
                        )}`}
                      >
                        {item.status || "-"}
                      </span>

                    </div>


                    <div>

                      <p className="text-xs text-slate-500">
                        Theme
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/analytics?theme=${encodeURIComponent(
                              item.theme || "General"
                            )}`
                          )
                        }
                        className="mt-1 inline-flex px-2.5 py-1 rounded-full border border-indigo-200 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-xs font-semibold transition"
                      >
                        {item.theme || "General"}
                      </button>

                    </div>

                  </div>


                  {/* ACTIONS */}

                  <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-200">

                    <button
                      onClick={() =>
                        navigate(
                          `/feedback/view/${item._id}`
                        )
                      }
                      className="flex-1 min-w-[80px] bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-2.5 rounded-lg font-semibold text-sm transition"
                    >
                      👁️ View
                    </button>

                    {canEdit && (
                      <button
                        onClick={() =>
                          navigate(
                            `/feedback/edit/${item._id}`
                          )
                        }
                        className="flex-1 min-w-[80px] bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2.5 rounded-lg font-semibold text-sm transition"
                      >
                        ✏️ Edit
                      </button>
                    )}

                    {canDelete && (
                      <button
                        onClick={() =>
                          handleDelete(item._id)
                        }
                        className="flex-1 min-w-[80px] bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2.5 rounded-lg font-semibold text-sm transition"
                      >
                        🗑️ Delete
                      </button>
                    )}

                  </div>

                </div>

              ))}

            </div>

          </>

        )}

      </div>

    </div>
  );
};

export default FeedbackList;