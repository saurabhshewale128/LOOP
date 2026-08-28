import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import Loading from "../../components/ui/Loading";

const AddFeedback = () => {
  const navigate = useNavigate();

  // ========================================
  // FORM STATE
  // ========================================

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    source: "App Review",
    message: "",
    rating: 5,
  });

  const [loading, setLoading] = useState(false);

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

    // Basic validation

    if (!formData.customerName.trim()) {
      toast.error("Customer name is required");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Feedback message is required");
      return;
    }

    if (formData.message.trim().length < 5) {
      toast.error(
        "Feedback message must contain at least 5 characters"
      );
      return;
    }

    try {
      setLoading(true);

      await api.post("/feedback", {
        ...formData,
        customerName: formData.customerName.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        rating: Number(formData.rating),
      });

      toast.success(
        "Feedback added successfully!"
      );

      navigate("/feedback");

    } catch (error) {
      console.error(
        "❌ Add Feedback Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to add feedback"
      );

    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loading message="Adding feedback..." />
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
              💬
            </div>

            <div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Add Feedback
              </h1>

              <p className="text-slate-500 mt-1">
                Add new customer feedback to LOOP
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
              Enter the customer's feedback details below.
            </p>

          </div>


          {/* Form */}

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
                placeholder="Enter customer name"
                disabled={loading}
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
                placeholder="customer@example.com"
                disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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

                  if (e.target.value.length <= 1000) {
                    handleChange(e);
                  }

                }}
                placeholder="Enter customer feedback..."
                rows="7"
                disabled={loading}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none resize-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100"
                required
              />

              <p className="text-xs text-slate-400 mt-2">
                Provide clear and meaningful customer feedback.
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
                disabled={loading}
                className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition disabled:opacity-50"
              >
                Cancel
              </button>


              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition shadow-sm"
              >
                {loading
                  ? "Adding..."
                  : "Add Feedback"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default AddFeedback;