import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const firstName =
    user?.name?.split(" ")[0] || "User";

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 md:p-8">

      <div className="max-w-7xl mx-auto">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                📊
              </div>

              <div>

                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  LOOP Dashboard
                </h1>

                <p className="text-slate-500 mt-1">
                  Customer Feedback Intelligence
                </p>

              </div>

            </div>

          </div>

          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">

            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {firstName.charAt(0).toUpperCase()}
            </div>

            <div className="hidden sm:block">

              <p className="text-sm font-semibold text-slate-900">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-slate-500">
                {user?.role || "User"}
              </p>

            </div>

          </div>

        </div>


        {/* ========================================
            WELCOME CARD
        ======================================== */}

        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 sm:p-8 mb-8 text-white">

          <div className="relative z-10">

            <p className="text-blue-100 text-sm font-medium mb-2">
              Welcome back 👋
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold">
              Hello, {firstName}!
            </h2>

            <p className="text-blue-100 mt-2 max-w-2xl">
              Manage customer feedback, analyze performance,
              and use AI-powered insights to understand your
              customers better.
            </p>

          </div>

          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />

          <div className="absolute right-10 -bottom-16 w-48 h-48 rounded-full bg-white/5" />

        </div>


        {/* ========================================
            MAIN FEATURES
        ======================================== */}

        <div className="mb-8">

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Overview
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Access the main LOOP modules
              </p>

            </div>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


            {/* ========================================
                FEEDBACK
            ======================================== */}

            <Link
              to="/feedback"
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition duration-200"
            >

              <div className="flex items-start justify-between">

                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                  💬
                </div>

                <span className="text-slate-300 group-hover:text-blue-600 text-xl transition">
                  →
                </span>

              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-5">
                Feedback
              </h3>

              <p className="text-slate-500 mt-2 leading-6">
                Manage customer feedback, ratings and reviews
                from one place.
              </p>

              <div className="mt-5 text-blue-600 font-semibold text-sm">
                View Feedback →
              </div>

            </Link>


            {/* ========================================
                ANALYTICS
            ======================================== */}

            <Link
              to="/analytics"
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition duration-200"
            >

              <div className="flex items-start justify-between">

                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
                  📊
                </div>

                <span className="text-slate-300 group-hover:text-green-600 text-xl transition">
                  →
                </span>

              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-5">
                Analytics
              </h3>

              <p className="text-slate-500 mt-2 leading-6">
                Analyze customer feedback with charts,
                trends and insights.
              </p>

              <div className="mt-5 text-green-600 font-semibold text-sm">
                View Analytics →
              </div>

            </Link>


            {/* ========================================
                AI
            ======================================== */}

            <Link
              to="/ai"
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition duration-200"
            >

              <div className="flex items-start justify-between">

                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
                  🤖
                </div>

                <span className="text-slate-300 group-hover:text-purple-600 text-xl transition">
                  →
                </span>

              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-5">
                AI Insights
              </h3>

              <p className="text-slate-500 mt-2 leading-6">
                Use AI to analyze sentiment and understand
                customer feedback.
              </p>

              <div className="mt-5 text-purple-600 font-semibold text-sm">
                Explore AI →
              </div>

            </Link>

          </div>

        </div>


        {/* ========================================
            QUICK ACTIONS
        ======================================== */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">

          <div className="mb-6">

            <h2 className="text-xl font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Quickly access frequently used features
            </p>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


            {/* ADD FEEDBACK */}

            <Link
              to="/feedback/add"
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition group"
            >

              <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center text-xl">
                ➕
              </div>

              <div>

                <h3 className="font-semibold text-slate-900 group-hover:text-blue-700">
                  Add Feedback
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Add customer feedback
                </p>

              </div>

            </Link>


            {/* VIEW FEEDBACK */}

            <Link
              to="/feedback"
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-green-300 hover:bg-green-50 transition group"
            >

              <div className="w-11 h-11 rounded-lg bg-green-100 flex items-center justify-center text-xl">
                📋
              </div>

              <div>

                <h3 className="font-semibold text-slate-900 group-hover:text-green-700">
                  View Feedback
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Manage all feedback
                </p>

              </div>

            </Link>


            {/* ANALYTICS */}

            <Link
              to="/analytics"
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition group"
            >

              <div className="w-11 h-11 rounded-lg bg-orange-100 flex items-center justify-center text-xl">
                📈
              </div>

              <div>

                <h3 className="font-semibold text-slate-900 group-hover:text-orange-700">
                  Analytics
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  View performance data
                </p>

              </div>

            </Link>


            {/* ASK AI */}

            <Link
              to="/ai/ask"
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition group"
            >

              <div className="w-11 h-11 rounded-lg bg-purple-100 flex items-center justify-center text-xl">
                🤖
              </div>

              <div>

                <h3 className="font-semibold text-slate-900 group-hover:text-purple-700">
                  Ask AI
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Ask feedback questions
                </p>

              </div>

            </Link>

          </div>

        </div>


        {/* ========================================
            AI TOOLS
        ======================================== */}

        <div>

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                AI Tools
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Explore LOOP's AI-powered customer intelligence
              </p>

            </div>

            <Link
              to="/ai"
              className="hidden sm:block text-sm text-blue-600 hover:text-blue-800 font-semibold"
            >
              View All →
            </Link>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">


            {/* AI INSIGHTS */}

            <Link
              to="/ai/insights"
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-lg hover:-translate-y-1 transition duration-200"
            >

              <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center text-xl mb-4">
                💡
              </div>

              <h3 className="font-bold text-slate-900">
                AI Insights
              </h3>

              <p className="text-sm text-slate-500 mt-2 leading-5">
                Discover intelligent insights from customer feedback.
              </p>

              <div className="mt-4 text-sm text-purple-600 font-semibold">
                Explore →
              </div>

            </Link>


            {/* AI SUMMARY */}

            <Link
              to="/ai/summary"
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-lg hover:-translate-y-1 transition duration-200"
            >

              <div className="w-11 h-11 rounded-xl bg-pink-100 flex items-center justify-center text-xl mb-4">
                🧠
              </div>

              <h3 className="font-bold text-slate-900">
                AI Summary
              </h3>

              <p className="text-sm text-slate-500 mt-2 leading-5">
                Get a quick AI-generated summary of customer feedback.
              </p>

              <div className="mt-4 text-sm text-pink-600 font-semibold">
                Generate Summary →
              </div>

            </Link>


            {/* VOC */}

            <Link
              to="/ai/voc"
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-lg hover:-translate-y-1 transition duration-200"
            >

              <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center text-xl mb-4">
                🗣️
              </div>

              <h3 className="font-bold text-slate-900">
                VOC Report
              </h3>

              <p className="text-sm text-slate-500 mt-2 leading-5">
                Generate Voice of Customer reports and insights.
              </p>

              <div className="mt-4 text-sm text-indigo-600 font-semibold">
                View VOC →
              </div>

            </Link>


            {/* ASK AI */}

            <Link
              to="/ai/ask"
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-lg hover:-translate-y-1 transition duration-200"
            >

              <div className="w-11 h-11 rounded-xl bg-cyan-100 flex items-center justify-center text-xl mb-4">
                💬
              </div>

              <h3 className="font-bold text-slate-900">
                Ask AI
              </h3>

              <p className="text-sm text-slate-500 mt-2 leading-5">
                Ask questions about your customer feedback.
              </p>

              <div className="mt-4 text-sm text-cyan-600 font-semibold">
                Ask Question →
              </div>

            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;