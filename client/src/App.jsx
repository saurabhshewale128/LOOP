import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ========================================
// AUTH
// ========================================

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ========================================
// DASHBOARD
// ========================================

import Dashboard from "./pages/dashboard/Dashboard";

// ========================================
// PROTECTED ROUTE
// ========================================

import ProtectedRoute from "./routes/ProtectedRoute";

// ========================================
// LAYOUT
// ========================================

import Layout from "./components/layout/Layout";

// ========================================
// FEEDBACK
// ========================================

import FeedbackList from "./pages/feedback/FeedbackList";
import AddFeedback from "./pages/feedback/AddFeedback";
import EditFeedback from "./pages/feedback/EditFeedback";
import FeedbackDetails from "./pages/feedback/FeedbackDetails";

// ========================================
// ANALYTICS
// ========================================

import Analytics from "./pages/analytics/Analytics";

// ========================================
// AI
// ========================================

import AIFeatures from "./pages/ai/AIFeatures";
import AIInsights from "./pages/ai/AIInsights";
import AISummary from "./pages/ai/AISummary";

import AskAI from "./pages/AskAI";
import VOCReport from "./pages/VOCReport";


const App = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* ========================================
            DEFAULT
        ======================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


        {/* ========================================
            AUTH
        ======================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ========================================
            DASHBOARD
        ======================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* ========================================
            FEEDBACK
        ======================================== */}

        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <Layout>
                <FeedbackList />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback/add"
          element={
            <ProtectedRoute>
              <Layout>
                <AddFeedback />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback/edit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditFeedback />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback/view/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <FeedbackDetails />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* ========================================
            ANALYTICS
        ======================================== */}

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <Analytics />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* ========================================
            AI MAIN
        ======================================== */}

        <Route
          path="/ai"
          element={
            <ProtectedRoute>
              <Layout>
                <AIFeatures />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* ========================================
            AI INSIGHTS
        ======================================== */}

        <Route
          path="/ai/insights"
          element={
            <ProtectedRoute>
              <Layout>
                <AIInsights />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* ========================================
            AI SUMMARY
        ======================================== */}

        <Route
          path="/ai/summary"
          element={
            <ProtectedRoute>
              <Layout>
                <AISummary />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* ========================================
            VOC REPORT
        ======================================== */}

        <Route
          path="/ai/voc"
          element={
            <ProtectedRoute>
              <Layout>
                <VOCReport />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* ========================================
            ASK AI
        ======================================== */}

        <Route
          path="/ai/ask"
          element={
            <ProtectedRoute>
              <Layout>
                <AskAI />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* ========================================
            UNKNOWN ROUTE
        ======================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
};

export default App;