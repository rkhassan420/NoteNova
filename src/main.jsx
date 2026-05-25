import React, { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Loading from "./page/loading.jsx";
import Error from "./page/error.jsx";
import { ThemeProvider } from "./theme/ThemeContext.jsx";
import ProtectedRoute from "./component/ProtectedRoute.jsx";
import AuthRoute from "./component/AuthRoute.jsx";
import { BottomNav } from "./page/header.jsx";

const Setting        = lazy(() => import("./page/setting.jsx"));
const NewNote        = lazy(() => import("./page/NewNote.jsx"));
const Register       = lazy(() => import("./component/register.jsx"));
const Login          = lazy(() => import("./component/login.jsx"));
const ForgotPassword = lazy(() => import("./component/forgotPassword.jsx"));
const VerifyCode     = lazy(() => import("./component/verify.jsx"));
const ResetPass      = lazy(() => import("./component/reset.jsx"));

// ── Global layout: BottomNav renders on every protected page ──────────────
const ProtectedLayout = () => (
  <>
    <Outlet />
    <BottomNav />
  </>
);

const router = createBrowserRouter([

  // ── Auth routes: redirect to "/" if already logged in ─────────────────
  {
    element: <AuthRoute />,
    children: [
      { path: "login",           element: <Login /> },
      { path: "register",        element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verify",          element: <VerifyCode /> },
      { path: "reset",           element: <ResetPass /> },
    ],
  },

  // ── Protected routes: BottomNav shown on all of these ─────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          { path: "/",               element: <App />,     errorElement: <Error /> },
          { path: "setting",         element: <Setting /> },
          { path: "New-Note",        element: <NewNote /> },
          { path: "/notes/:id/edit", element: <NewNote /> },
        ],
      },
    ],
  },

]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  </StrictMode>
);

// ── Register service worker for PWA / offline support ────────────────────
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("SW registered:", reg.scope))
      .catch((err) => console.error("SW registration failed:", err));
  });
}