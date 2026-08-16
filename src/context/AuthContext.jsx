import { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("shaktishield_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem("shaktishield_user"); }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    setUser(data);
    return data;
  };

  const register = async (formData) => {
    const { data } = await authAPI.register(formData);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("shaktishield_token");
    localStorage.removeItem("shaktishield_user");
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  return <AuthContext.Provider value={{ user, login, register, logout, loading, isAdmin }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
