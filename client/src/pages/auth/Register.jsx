import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    workspaceName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =====================================
  // FORM VALIDATION
  // =====================================

  const validateForm = () => {
    const {
      name,
      workspaceName,
      email,
      password,
      confirmPassword,
    } = formData;

    // Name
    if (!name.trim()) {
      toast.error("Please enter your name");
      return false;
    }

    // Workspace
    if (!workspaceName.trim()) {
      toast.error("Please enter your workspace name");
      return false;
    }

    // Email
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Password length
    if (password.length < 12) {
      toast.error(
        "Password must be at least 12 characters"
      );
      return false;
    }

    // Uppercase
    if (!/[A-Z]/.test(password)) {
      toast.error(
        "Password must contain an uppercase letter"
      );
      return false;
    }

    // Lowercase
    if (!/[a-z]/.test(password)) {
      toast.error(
        "Password must contain a lowercase letter"
      );
      return false;
    }

    // Number
    if (!/[0-9]/.test(password)) {
      toast.error(
        "Password must contain a number"
      );
      return false;
    }

    // Special character
    if (
      !/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(
        password
      )
    ) {
      toast.error(
        "Password must contain a special character"
      );
      return false;
    }

    // Confirm password
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  // =====================================
  // REGISTER
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/register",
        {
          name: formData.name.trim(),
          workspaceName:
            formData.workspaceName.trim(),
          email: formData.email
            .trim()
            .toLowerCase(),
          password: formData.password,
        }
      );

      // =====================================
      // SAVE AUTH SESSION
      // =====================================

      const token = response.data?.token;
      const user = response.data?.user;
      
      if (!token || typeof token !== "string") {
        console.error("Invalid registration token:", response.data);
        throw new Error("Authentication token was not received");
      }
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      register(token, user);

      toast.success(
        "Workspace created successfully!"
      );

      // =====================================
      // DIRECT DASHBOARD
      // =====================================

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "❌ Registration Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // UI
  // =====================================

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8">

          <p className="text-sm font-semibold tracking-[0.25em] text-indigo-600 uppercase">
            LOOP
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-3">
            Create your LOOP workspace
          </h1>

          <p className="text-slate-500 mt-3 leading-relaxed">
            The account creator becomes the workspace
            administrator. Your company data remains
            isolated from every other workspace.
          </p>

        </div>

        {/* =====================================
            FORM
        ===================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* NAME */}

          <div>

            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Your name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              autoComplete="name"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />

          </div>

          {/* WORKSPACE */}

          <div>

            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Company or workspace name
            </label>

            <input
              type="text"
              name="workspaceName"
              value={formData.workspaceName}
              onChange={handleChange}
              placeholder="Acme Cloud"
              autoComplete="organization"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />

          </div>

          {/* EMAIL */}

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
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />

          </div>

          {/* PASSWORD */}

          <div>

            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              autoComplete="new-password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />

            <p className="text-xs text-slate-500 mt-2">
              Use at least 12 characters with
              uppercase, lowercase, number, and symbol.
            </p>

          </div>

          {/* CONFIRM PASSWORD */}

          <div>

            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Confirm password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              autoComplete="new-password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-950 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition"
          >
            {loading
              ? "Creating workspace..."
              : "Create workspace"}
          </button>

        </form>

        {/* =====================================
            LOGIN LINK
        ===================================== */}

        <p className="text-center text-sm text-slate-600 mt-6">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Sign in
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Register;