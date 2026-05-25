import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../utils/storage";

// ── Blocks access to any route if user is not logged in ───────────────────
// Usage: wrap protected routes with <ProtectedRoute /> in main.jsx
const ProtectedRoute = () => {
  const token = getAccessToken();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;