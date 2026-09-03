import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // =====================================
  // HANDLE CHANGE
  // =====================================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =====================================
  // HANDLE LOGIN
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const token = response.data?.token;
      const user = response.data?.user;

      if (!token || typeof token !== "string") {
       console.error("Invalid token received:", response.data);
       throw new Error("Authentication token was not received");
      }

      localStorage.setItem("token", token);
     localStorage.setItem("user", JSON.stringify(user));

      login(token, user);

      toast.success("Login successful!");

      // Open requested page or dashboard
      const redirectTo =
        location.state?.from?.pathname || "/dashboard";

      navigate(redirectTo, {
        replace: true,
      });
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* =====================================
          LEFT BRANDING SECTION
      ===================================== */}

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#17132f] via-[#211b45] to-[#302866] text-white px-12 xl:px-16 py-12 flex-col justify-between">

        {/* Logo */}

        <div>

          <div className="flex items-center gap-4">

            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-[#17132f]">
                L
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-[0.2em]">
                LOOP
              </h2>

              <p className="text-xs text-indigo-200">
                Customer-feedback intelligence
              </p>
            </div>

          </div>

          {/* Main heading */}

          <div className="mt-16">

            <p className="text-sm font-bold tracking-[0.3em] text-indigo-300 uppercase">
              Close the loop
            </p>

            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.08] mt-8 max-w-xl">
              Turn scattered
              <br />
              feedback into the
              <br />
              next clear
              <br />
              decision.
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed mt-8 max-w-xl">
              LOOP gives product, support, and leadership
              teams one secure place to understand what
              customers are saying and why it matters.
            </p>

          </div>

          {/* Features */}

          <div className="mt-10 space-y-5">

            <div className="flex items-center gap-4">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                ✓
              </span>

              <span className="font-semibold text-slate-200">
                Private multi-tenant workspaces
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                ✓
              </span>

              <span className="font-semibold text-slate-200">
                Role-aware access from the first session
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                ✓
              </span>

              <span className="font-semibold text-slate-200">
                Evidence-backed customer intelligence
              </span>
            </div>

          </div>

        </div>

        {/* Footer */}

        <p className="text-sm text-slate-400">
          Build it like a product. Ship it like a professional.
        </p>

      </div>

      {/* =====================================
          RIGHT LOGIN SECTION
      ===================================== */}

      <div className="flex-1 flex items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* Login Card */}

          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8 sm:p-10">

            {/* Header */}

            <div className="mb-8">

              <p className="text-sm font-bold tracking-[0.25em] text-indigo-600 uppercase">
                Welcome back
              </p>

              <h2 className="text-3xl font-bold text-slate-950 mt-4">
                Sign in to LOOP
              </h2>

              <p className="text-slate-500 mt-3 leading-relaxed">
                Use your workspace account to continue to
                the protected application.
              </p>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Email */}

              <div>

                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Work email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3.5 text-slate-900 outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />

              </div>

              {/* Password */}

              <div>

                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3.5 text-slate-900 outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />

              </div>

              {/* Button */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#17132f] hover:bg-[#211b45] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

            </form>

            {/* Register */}

            <p className="text-center text-sm text-slate-500 mt-7">

              New to LOOP?{" "}

              <Link
                to="/register"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Create a workspace
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;