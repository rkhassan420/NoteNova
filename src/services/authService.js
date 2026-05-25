import api from "./api";
import { saveAuth, clearAuth } from "../utils/storage";

// ── Register ───────────────────────────────────────────────────────────────
export const registerUser = async ({ username, email, password }) => {
  const { data } = await api.post("/register/", { username, email, password });
  return data;
};

// ── Login ──────────────────────────────────────────────────────────────────
export const loginUser = async ({ username, password }) => {
  const { data } = await api.post("/login/", { username, password });
  saveAuth(data);
  return data;
};

// ── Logout (client-side only) ──────────────────────────────────────────────
export const logoutUser = () => {
  clearAuth();
};

// ── Forgot password: sends reset code to email ────────────────────────────
export const forgotPassword = async (username) => {
  const { data } = await api.post("/forgot-password/", { username });
  return data; // returns { email }
};

// ── Verify reset code ─────────────────────────────────────────────────────
export const verifyCode = async ({ username, code }) => {
  const { data } = await api.post("/verify/", { username, code });
  return data;
};

// ── Reset password ────────────────────────────────────────────────────────
export const resetPassword = async ({ username, password }) => {
  const { data } = await api.post("/reset/", { username, password });
  return data;
};

// ── Delete account ────────────────────────────────────────────────────────
export const deleteAccount = async (userId) => {
  const { data } = await api.delete(`/users/${userId}/`);
  clearAuth();
  return data;
};