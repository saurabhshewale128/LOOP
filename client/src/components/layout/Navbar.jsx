import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();

  // ========================================
  // PAGE TITLES
  // ========================================

  const pageTitles = {
    "/dashboard": {
      title: "Dashboard",
      subtitle: "Customer Feedback Intelligence",
    },

    "/feedback": {
      title: "Feedback",
      subtitle: "Manage customer feedback",
    },

    "/feedback/add": {
      title: "Add Feedback",
      subtitle: "Create new customer feedback",
    },

    "/analytics": {
      title: "Analytics",
      subtitle: "Customer feedback analytics",
    },

    "/ai": {
      title: "AI Features",
      subtitle: "AI-powered feedback intelligence",
    },

    "/ai/insights": {
      title: "AI Insights",
      subtitle: "Intelligent customer feedback analysis",
    },

    "/ai/summary": {
      title: "AI Summary",
      subtitle: "Customer feedback summary",
    },

    "/ai/voc": {
      title: "VOC Report",
      subtitle: "Voice of Customer analysis",
    },

    "/ai/ask": {
      title: "Ask AI",
      subtitle: "Ask questions about customer feedback",
    },
  };

  // ========================================
  // CURRENT PAGE
  // ========================================

  let currentPage =
    pageTitles[location.pathname];

  // ========================================
  // DYNAMIC FEEDBACK ROUTES
  // ========================================

  if (
    !currentPage &&
    location.pathname.startsWith(
      "/feedback/edit"
    )
  ) {
    currentPage = {
      title: "Edit Feedback",
      subtitle: "Update customer feedback",
    };
  }

  if (
    !currentPage &&
    location.pathname.startsWith(
      "/feedback/view"
    )
  ) {
    currentPage = {
      title: "Feedback Details",
      subtitle: "View customer feedback",
    };
  }

  // ========================================
  // DEFAULT PAGE
  // ========================================

  if (!currentPage) {
    currentPage = {
      title: "LOOP",
      subtitle: "Feedback Intelligence",
    };
  }

  // ========================================
  // USER
  // ========================================

  const userName =
    user?.name ||
    user?.username ||
    "User";

  const userInitial =
    userName.charAt(0).toUpperCase();

  // ========================================
  // UI
  // ========================================

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-white border-b border-slate-200 shadow-sm md:ml-64">

      <div className="h-full px-4 sm:px-6 flex items-center justify-between">

        {/* ========================================
            LEFT SIDE
        ======================================== */}

        <div className="flex items-center gap-3 min-w-0">

          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={() =>
              setIsOpen(true)
            }
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-slate-700 hover:bg-slate-100 transition"
            aria-label="Open menu"
          >
            <span className="text-2xl">
              ☰
            </span>
          </button>

          {/* PAGE TITLE */}

          <div className="min-w-0">

            <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
              {currentPage.title}
            </h1>

            <p className="hidden sm:block text-xs text-slate-500 truncate">
              {currentPage.subtitle}
            </p>

          </div>

        </div>

        {/* ========================================
            RIGHT SIDE
        ======================================== */}

        <div className="flex items-center gap-3">

          {/* USER INFORMATION */}

          <div className="hidden sm:flex items-center gap-3">

            <div className="text-right">

              <p className="text-sm font-semibold text-slate-800">
                {userName}
              </p>

              <p className="text-xs text-slate-500">
                {user?.role || "User"}
              </p>

            </div>

            {/* AVATAR */}

            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
              {userInitial}
            </div>

          </div>

          {/* MOBILE AVATAR */}

          <div className="sm:hidden w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {userInitial}
          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;