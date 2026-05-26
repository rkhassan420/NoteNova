import "./header.css";
import setting from "../assets/setting.png";
import white_setting from "../assets/white-setting.png";
import home from "../assets/home.png";
import white_home from "../assets/white-home.png";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../theme/ThemeContext";

const Header = ({ searchTerm, setSearchTerm }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark-theme";

  return (
    <header className="header">
      <h3 className="title">Notes</h3>
      <div className="right-side">
        <div className="search-wrapper">
          <input
            type="search"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link to="/setting" className="header-setting-link">
          <img
            title="Settings"
            src={isDark ? white_setting : setting}
            alt="Settings"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;

export const BottomNav = () => {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const isDark = theme === "dark-theme";

  return (
    <nav className="bottom-nav">
      <Link
        to="/"
        className={`bottom-nav-item ${location.pathname === "/" ? "active" : ""}`}
      >
        <img src={isDark ? white_home : home} alt="Home" />
        <span>Home</span>
      </Link>

      <Link to="/New-Note" className="bottom-nav-item bottom-nav-center">
        <div className="bottom-nav-plus">+</div>
      </Link>

      <Link
        to="/setting"
        className={`bottom-nav-item ${location.pathname === "/setting" ? "active" : ""}`}
      >
        <img src={isDark ? white_setting : setting} alt="Settings" />
        <span>Settings</span>
      </Link>
    </nav>
  );
};