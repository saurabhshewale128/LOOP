import { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Sidebar */}

      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />


      {/* Navbar */}

      <Navbar
        setIsOpen={setIsSidebarOpen}
      />


      {/* Main Content */}

      <main className="min-h-screen pt-16 md:ml-64">

        {children}

      </main>

    </div>
  );
};

export default Layout;