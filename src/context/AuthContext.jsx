import { createContext, useState, useEffect } from "react";
import authService from "../api/authService";

// Create context
export const AuthContext = createContext();

// AuthProvider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // holds logged-in user
  const [loading, setLoading] = useState(true); // initial loading state

  // Load user from backend on mount (session check)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authService.getCurrentUser();
        setUser(data.user || null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Login method
  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    setUser(data.user);
    return data;
  };

  // Signup method
  const signup = async (userData) => {
    const data = await authService.signup(userData);
    return data;
  };

  // Logout method
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  // Verify email with token and email
  const verifyEmail = async (token, email) => {
    const res = await api.get(
      `/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`
    );
    return res.data; // returns { message: "..." }
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    verifyEmail,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
