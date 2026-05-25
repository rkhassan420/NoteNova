import "./setting.css";
import no_tick from "../assets/not_tick.png";
import tick from "../assets/tick.png";
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../theme/ThemeContext";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import { getViewMode, setViewMode as saveViewMode } from "../utils/storage";

const Setting = () => {
  const { user, logout, removeAccount, loading } = useAuth();
  const { theme, handleDarkTheme, handleLightTheme } = useContext(ThemeContext);
  const [viewMode, setViewMode] = useState(() => getViewMode());

  const handleListView = () => {
    setViewMode("list");
    saveViewMode("list");
  };

  const handleGridView = () => {
    setViewMode("grid");
    saveViewMode("grid");
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? All your notes will be permanently removed."
    );
    if (!confirmed) return;
    await removeAccount();
  };

  return (
    <div className="setting-container">

      {/* ── Account ── */}
      <div className="theme-container">
        <ul>
          {user ? (
            <li>
              <p>{user.username}</p>
              <Link to="" className="logout-btn" onClick={logout}>
                <p>Logout</p>
                <img title="logout" src="logout.png" alt="logout" />
              </Link>
            </li>
          ) : (
            <Link to="/login" className="login-btn">
              <li>
                <p>Login</p>
                <img
                  src={theme === "light-theme" ? "black-user.png" : "white-user.png"}
                  alt="user"
                />
              </li>
            </Link>
          )}
        </ul>
      </div>

      {/* ── Theme ── */}
      <p className="theme-title">Theme & Appearance</p>
      <div className="theme-container">
        <ul>
          <li onClick={handleLightTheme}>
            <p>Light</p>
            <img src={theme === "light-theme" ? tick : no_tick} alt="" />
          </li>
          <li onClick={handleDarkTheme}>
            <p>Dark</p>
            <img src={theme === "dark-theme" ? tick : no_tick} alt="" />
          </li>
        </ul>
      </div>

      {/* ── Layout style ── */}
      <p className="theme-title">Style</p>
      <div className="theme-container">
        <ul>
          <li onClick={handleListView}>
            <p>List</p>
            <img src={viewMode === "list" ? tick : no_tick} alt="" />
          </li>
          <li onClick={handleGridView}>
            <p>Grid</p>
            <img src={viewMode === "grid" ? tick : no_tick} alt="" />
          </li>
        </ul>
      </div>

      {/* ── Danger zone ── */}
      <div className="theme-container">
        <ul>
          <li onClick={!loading ? handleDeleteAccount : undefined}
              style={{ opacity: loading ? 0.5 : 1, cursor: loading ? "default" : "pointer" }}>
            <p>Delete Account</p>
            <img src="right.png" alt="" />
          </li>
        </ul>
      </div>

      {/* ── About ── */}
      <p className="theme-title">About</p>
      <div className="theme-container">
        <ul>
          <li>
            <p>&copy; 2025 Ali Hassan</p>
            <img src="note.png" alt="" />
          </li>
        </ul>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Setting;