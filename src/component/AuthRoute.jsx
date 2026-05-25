import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../utils/storage";

// ── Blocks access to login/register if user is already logged in ──────────
// Usage: wrap auth routes with <AuthRoute /> in main.jsx
const AuthRoute = () => {
  const token = getAccessToken();
  return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default AuthRoute;