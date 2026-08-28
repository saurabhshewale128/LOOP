import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Get saved user immediately
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        localStorage.removeItem("user");
        return null;
      }
    }

    return null;
  });

  const [loading, setLoading] = useState(true);

  // =====================================
  // CHECK TOKEN
  // =====================================
  useEffect(() => {
    const token = localStorage.getItem("token");

    // No token = not logged in
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const checkUser = async () => {
      try {
        const response = await api.get("/auth/me");

        const currentUser = response.data.user;

        setUser(currentUser);

        localStorage.setItem(
          "user",
          JSON.stringify(currentUser)
        );
      } catch (error) {
        console.error(
          "Auth Check Error:",
          error.response?.data || error.message
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // =====================================
  // LOGIN
  // =====================================
  const login = (token, userData) => {
    localStorage.setItem("token", token);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  // =====================================
  // LOGOUT
  // =====================================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};