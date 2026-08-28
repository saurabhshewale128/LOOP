import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import Loading from "../../components/ui/Loading";

const EditFeedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ========================================
  // FORM STATE
  // ========================================

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    source: "Other",
    message: "",
    rating: 5,
    status: "New",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ========================================
  // FETCH FEEDBACK
  // ========================================

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);

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

        setFormData({
          customerName:
            data.customerName || "",
          email:
            data.email || "",
          source:
            data.source || "Other",
          message:
            data.message || "",
          rating:
            data.rating || 5,
          status:
            data.status || "New",
        });

      } catch (error) {
        console.error("❌ Update Feedback Error:", error);
        console.error("❌ Status:", error.response?.status);
        console.error("❌ Response:", error.response?.data);
        console.error("❌ URL:", error.config?.url);
        
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to update feedback"
        );

        navigate("/feedback");

      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFeedback();
    }
  }, [id, navigate]);

  // ========================================
  // HANDLE CHANGE
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // HANDLE SUBMIT
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ========================================
    // VALIDATION
    // ========================================

    if (!formData.customerName.trim()) {
      toast.error(
        "Customer name is required"
      );
      return;
    }

    if (!formData.message.trim()) {
      toast.error(
        "Feedback message is required"
      );
      return;
    }

    if (
      formData.message.trim().length < 5
    ) {
      toast.error(
        "Feedback message must contain at least 5 characters"
      );
      return;
    }

    try {
      setSaving(true);

      await api.put(
        `/feedback/${id}`,
        {
          ...formData,
          customerName:
            formData.customerName.trim(),
          email:
            formData.email.trim(),
          message:
            formData.message.trim(),
          rating:
            Number(formData.rating),
        }
      );

      toast.success(
        "Feedback updated successfully!"
      );

      navigate("/feedback");

    } catch (error) {

      console.error(
        "❌ Update Feedback Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update feedback"
      );

    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // INITIAL LOADING
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loading message="Loading feedback..." />
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-8">

      <div className="max-w-3xl mx-auto">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="mb-6">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
              ✏️
            </div>

            <div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Edit Feedback
              </h1>

              <p className="text-slate-500 mt-1">
                Update customer feedback information
              </p>

            </div>

          </div>

        </div>


        {/* ========================================
            FORM CARD
        ======================================== */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">

          {/* Card Header */}

          <div className="px-5 sm:px-8 py-5 border-b border-slate-200">

            <h2 className="text-lg font-semibold text-slate-900">
              Feedback Information
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Update the customer feedback details below.
            </p>

          </div>


          {/* ========================================
              FORM
          ======================================== */}

          <form
            onSubmit={handleSubmit}
            className="p-5 sm:p-8 space-y-6"
          >

            {/* ========================================
                CUSTOMER NAME
            ======================================== */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Customer Name
                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                disabled={saving}
                placeholder="Enter customer name"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100"
                required
              />

            </div>


            {/* ========================================
                EMAIL
            ======================================== */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Customer Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={saving}
                placeholder="customer@example.com"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100"
              />

            </div>


            {/* ========================================
                SOURCE + RATING
            ======================================== */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* SOURCE */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Feedback Source
                </label>

                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100"
                >

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


              {/* RATING */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Rating
                </label>

                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100"
                >

                  <option value="5">
                    ⭐ 5 - Excellent
                  </option>

                  <option value="4">
                    ⭐ 4 - Good
                  </option>

                  <option value="3">
                    ⭐ 3 - Average
                  </option>

                  <option value="2">
                    ⭐ 2 - Poor
                  </option>

                  <option value="1">
                    ⭐ 1 - Very Poor
                  </option>

                </select>

              </div>

            </div>


            {/* ========================================
                STATUS
            ======================================== */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Feedback Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={saving}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100"
              >

                <option value="New">
                  🆕 New
                </option>

                <option value="Reviewed">
                  👀 Reviewed
                </option>

                <option value="Resolved">
                  ✅ Resolved
                </option>

              </select>

            </div>


            {/* ========================================
                MESSAGE
            ======================================== */}

            <div>

              <div className="flex items-center justify-between mb-2">

                <label className="block text-sm font-semibold text-slate-700">
                  Feedback Message
                  <span className="text-red-500 ml-1">
                    *
                  </span>
                </label>

                <span className="text-xs text-slate-400">
                  {formData.message.length}/1000
                </span>

              </div>

              <textarea
                name="message"
                value={formData.message}
                onChange={(e) => {

                  if (
                    e.target.value.length <=
                    1000
                  ) {
                    handleChange(e);
                  }

                }}
                rows="7"
                disabled={saving}
                placeholder="Enter customer feedback..."
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none resize-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100"
                required
              />

              <p className="text-xs text-slate-400 mt-2">
                Update the feedback with clear and meaningful information.
              </p>

            </div>


            {/* ========================================
                BUTTONS
            ======================================== */}

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-3 border-t border-slate-200">

              {/* CANCEL */}

              <button
                type="button"
                onClick={() =>
                  navigate("/feedback")
                }
                disabled={saving}
                className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition disabled:opacity-50"
              >
                Cancel
              </button>


              {/* SAVE */}

              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition shadow-sm"
              >
                {saving
                  ? "Saving..."
                  : "💾 Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default EditFeedback;