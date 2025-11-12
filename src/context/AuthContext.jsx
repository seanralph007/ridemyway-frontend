import { createContext, useEffect, useState } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      console.log("User authenticated:", res.data.user);
    } catch (err) {
      console.warn(
        "Failed to fetch user:",
        err.response?.data?.message || err.message
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    await api.post("/auth/login", { email, password });
    await fetchUser();
  };

  const signup = async (formData) => {
    await api.post("/auth/signup", formData);
    // await fetchUser();
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
