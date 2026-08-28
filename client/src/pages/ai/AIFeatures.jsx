import { useNavigate } from "react-router-dom";

const AIFeatures = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="max-w-7xl mx-auto mb-8">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl">
            🤖
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              AI Features
            </h1>

            <p className="text-slate-500 mt-1">
              AI-powered customer feedback intelligence
            </p>
          </div>

        </div>

      </div>

      <div className="max-w-7xl mx-auto">

        {/* ========================================
            AI MODULES
        ======================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* ========================================
              AI INSIGHTS
          ======================================== */}

          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition">

            <div className="flex items-center gap-4 mb-5">

              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-3xl">
                💡
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  AI Insights
                </h2>

                <p className="text-sm text-slate-500">
                  Intelligent feedback analysis
                </p>

              </div>

            </div>

            <p className="text-slate-600 leading-relaxed">
              LOOP AI analyzes customer feedback and
              identifies critical issues, customer strengths,
              feature requests and recommended actions.
            </p>

            <button
              onClick={() => navigate("/ai/insights")}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            >
              View AI Insights →
            </button>

          </div>


          {/* ========================================
              VOC REPORT
          ======================================== */}

          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition">

            <div className="flex items-center gap-4 mb-5">

              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-3xl">
                🗣️
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Voice of Customer
                </h2>

                <p className="text-sm text-slate-500">
                  AI-powered customer report
                </p>

              </div>

            </div>

            <p className="text-slate-600 leading-relaxed">
              Generate a complete Voice of Customer report
              containing customer sentiment, major issues,
              strengths, feature requests and actions.
            </p>

            <button
              onClick={() => navigate("/ai/voc")}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
            >
              View VOC Report →
            </button>

          </div>


          {/* ========================================
              AI SUMMARY
          ======================================== */}

          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition">

            <div className="flex items-center gap-4 mb-5">

              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center text-3xl">
                🧠
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  AI Summary
                </h2>

                <p className="text-sm text-slate-500">
                  Customer feedback overview
                </p>

              </div>

            </div>

            <p className="text-slate-600 leading-relaxed">
              Get a concise overview of customer feedback
              including satisfaction, sentiment, categories
              and business priorities.
            </p>

            <button
              onClick={() => navigate("/ai/summary")}
              className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold transition"
            >
              View AI Summary →
            </button>

          </div>


          {/* ========================================
              SENTIMENT ANALYSIS
          ======================================== */}

          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition">

            <div className="flex items-center gap-4 mb-5">

              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-3xl">
                😊
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Sentiment Analysis
                </h2>

                <p className="text-sm text-slate-500">
                  Understand customer emotions
                </p>

              </div>

            </div>

            <p className="text-slate-600 leading-relaxed">
              Gemini AI automatically analyzes customer
              feedback and identifies whether feedback is
              Positive, Negative or Neutral.
            </p>

            <div className="flex flex-wrap gap-2 mt-5">

              <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                Positive
              </span>

              <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                Negative
              </span>

              <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">
                Neutral
              </span>

            </div>

          </div>


          {/* ========================================
              CATEGORY
          ======================================== */}

          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition">

            <div className="flex items-center gap-4 mb-5">

              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-3xl">
                🏷️
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Auto Categorization
                </h2>

                <p className="text-sm text-slate-500">
                  Automatically classify feedback
                </p>

              </div>

            </div>

            <p className="text-slate-600 leading-relaxed">
              AI identifies the main category of customer
              feedback and automatically classifies it for
              easier analysis.
            </p>

            <div className="flex flex-wrap gap-2 mt-5">

              <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                Bug
              </span>

              <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                Feature Request
              </span>

              <span className="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-700">
                Complaint
              </span>

              <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                Praise
              </span>

            </div>

          </div>


          {/* ========================================
              PRIORITY
          ======================================== */}

          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-xl transition">

            <div className="flex items-center gap-4 mb-5">

              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-3xl">
                ⚡
              </div>

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Priority Detection
                </h2>

                <p className="text-sm text-slate-500">
                  Identify important feedback
                </p>

              </div>

            </div>

            <p className="text-slate-600 leading-relaxed">
              AI evaluates customer feedback and assigns
              a priority level so teams can focus on the
              most important issues first.
            </p>

            <div className="flex gap-2 mt-5">

              <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                High
              </span>

              <span className="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-700">
                Medium
              </span>

              <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                Low
              </span>

            </div>

          </div>

        </div>


        {/* ========================================
            ASK AI
        ======================================== */}

        <div className="mt-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <div className="flex items-center gap-3 mb-3">

                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
                  💬
                </div>

                <h2 className="text-2xl md:text-3xl font-bold">
                  Ask AI
                </h2>

              </div>

              <p className="text-blue-100 max-w-2xl leading-relaxed">
                Ask questions about your customer feedback
                using natural language and get intelligent
                answers from your feedback data.
              </p>

            </div>

            <button
              onClick={() => navigate("/ai/ask")}
              className="bg-white text-blue-600 hover:bg-blue-50 px-7 py-3 rounded-xl font-bold transition shadow"
            >
              🤖 Ask AI →
            </button>

          </div>

        </div>


        {/* ========================================
            QUICK ACCESS
        ======================================== */}

        <div className="mt-8 bg-white rounded-2xl shadow p-6">

          <h2 className="text-2xl font-bold text-slate-900 mb-5">
            ⚡ Quick Access
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <button
              onClick={() => navigate("/ai/insights")}
              className="p-5 bg-blue-50 hover:bg-blue-100 rounded-xl text-left transition"
            >

              <div className="text-2xl mb-2">
                💡
              </div>

              <h3 className="font-bold text-slate-900">
                AI Insights
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                View important customer insights
              </p>

            </button>


            <button
              onClick={() => navigate("/ai/voc")}
              className="p-5 bg-indigo-50 hover:bg-indigo-100 rounded-xl text-left transition"
            >

              <div className="text-2xl mb-2">
                🗣️
              </div>

              <h3 className="font-bold text-slate-900">
                VOC Report
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                View Voice of Customer report
              </p>

            </button>


            <button
              onClick={() => navigate("/ai/summary")}
              className="p-5 bg-pink-50 hover:bg-pink-100 rounded-xl text-left transition"
            >

              <div className="text-2xl mb-2">
                🧠
              </div>

              <h3 className="font-bold text-slate-900">
                AI Summary
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                View customer feedback summary
              </p>

            </button>

          </div>

        </div>


        {/* ========================================
            FOOTER
        ======================================== */}

        <div className="text-center text-sm text-slate-500 py-8">
          🤖 LOOP AI — Customer Feedback Intelligence Platform
        </div>

      </div>

    </div>
  );
};

export default AIFeatures;