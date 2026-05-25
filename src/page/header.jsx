import "./header.css";
import setting from "../assets/setting.png";
import white_setting from "../assets/white-setting.png";
import home from "../assets/home.png";
import white_home from "../assets/white-home.png";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../theme/ThemeContext";

// ── Top header: used on home page only ────────────────────────────────────
const Header = ({ searchTerm, setSearchTerm }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark-theme";

  return (
    <header className="header">
      <h3 className="title">Notes</h3>
      <div className="right-side">
        <input
          type="search"
          placeholder="Search notes"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* hide setting icon on mobile — bottom nav handles it */}
        <Link to="/setting" className="header-setting-link">
          <img
            title="Setting"
            src={isDark ? white_setting : setting}
            alt="Settings"
            height="30px"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;


// ── Bottom nav: exported separately, mounted once in main.jsx ─────────────
export const BottomNav = () => {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const isDark = theme === "dark-theme";

  return (
    <>
      {/* Desktop floating + button */}
      <Link to="/New-Note" className="create-btn-link desktop-fab">
        <button className="create-btn-float">+</button>
      </Link>

      {/* Mobile bottom nav */}
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
    </>
  );
};