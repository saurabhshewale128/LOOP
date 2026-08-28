import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "🏠",
    },
    {
      name: "Feedback",
      path: "/feedback",
      icon: "💬",
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: "📊",
    },
    {
      name: "AI Features",
      path: "/ai",
      icon: "🤖",
    },
  ];

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsOpen(false);

    navigate("/login");
  };

  return (
    <>
      {/* ========================================
          MOBILE OVERLAY
      ======================================== */}

      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          h-screen
          w-64
          bg-slate-900
          text-white
          transition-transform
          duration-300
          ease-in-out

          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          md:translate-x-0
        `}
      >

        {/* ========================================
            LOGO
        ======================================== */}

        <div className="flex h-20 items-center justify-between border-b border-slate-700 px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-2xl">
              🔄
            </div>

            <div>

              <h1 className="text-xl font-bold">
                LOOP
              </h1>

              <p className="text-xs text-slate-400">
                Feedback Intelligence
              </p>

            </div>

          </div>

          {/* Mobile close */}

          <button
            onClick={closeSidebar}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
            aria-label="Close menu"
          >
            ✕
          </button>

        </div>


        {/* ========================================
            NAVIGATION
        ======================================== */}

        <nav className="h-[calc(100vh-145px)] overflow-y-auto p-4">

          {/* Main Menu */}

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main Menu
          </p>

          <div className="space-y-2">

            {menuItems.map((item) => (

              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >

                <span className="text-xl">
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>

              </NavLink>

            ))}

          </div>


          {/* ========================================
              AI TOOLS
          ======================================== */}

          <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            AI Tools
          </p>

          <div className="space-y-2">

            <NavLink
              to="/ai/insights"
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <span>💡</span>
              <span>AI Insights</span>
            </NavLink>


            <NavLink
              to="/ai/summary"
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-pink-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <span>🧠</span>
              <span>AI Summary</span>
            </NavLink>


            <NavLink
              to="/ai/voc"
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <span>🗣️</span>
              <span>VOC Report</span>
            </NavLink>


            <NavLink
              to="/ai/ask"
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-cyan-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <span>💬</span>
              <span>Ask AI</span>
            </NavLink>

          </div>

        </nav>


        {/* ========================================
            LOGOUT
        ======================================== */}

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700 bg-slate-900 p-4">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >

            <span className="text-xl">
              🚪
            </span>

            <span className="font-medium">
              Logout
            </span>

          </button>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;