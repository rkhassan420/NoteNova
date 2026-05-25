import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  loginUser,
  logoutUser,
  registerUser,
  deleteAccount,
} from "../services/authService";
import { getStoredUser } from "../utils/storage";
import { extractServerError } from "../utils/validators";

const useAuth = () => {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const data = await loginUser(credentials);
      setUser(data.user);
      toast.success("Login successful!");
      navigate("/");
      return { success: true };
    } catch (error) {
      const message = extractServerError(error);
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // ── Register ─────────────────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      await registerUser(formData);
      return { success: true };
    } catch (error) {
      const message = extractServerError(error);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
    navigate("/login");
  }, [navigate]);

  // ── Delete account ───────────────────────────────────────────────────────
  const removeAccount = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      await deleteAccount(user.id);
      setUser(null);
      toast.success("Account deleted successfully!");
      navigate("/login");
    } catch (error) {
      const message = extractServerError(error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  return { user, loading, login, register, logout, removeAccount };
};

export default useAuth;