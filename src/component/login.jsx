import { useState } from "react";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../hooks/useAuth";
import { validateLoginForm } from "../utils/validators";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ── Client-side validation ─────────────────────────────────────────────
    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await login(formData);
  };

  return (
    <div className="register-wraper">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="register-container">
        <h2>Log In</h2>

        <form onSubmit={handleSubmit}>

          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
            >
              <img
                src={showPassword ? "eye.png" : "visible.png"}
                height="20px"
                alt={showPassword ? "Hide password" : "Show password"}
              />
            </button>
          </div>
          {errors.password && <p className="error">{errors.password}</p>}

          <p
            onClick={() => navigate("/forgot-password")}
            className="login-forgot-btn"
            style={{
              float: "inline-end",
              color: "gray",
              paddingRight: "5px",
              cursor: "pointer",
            }}
          >
            Forgot Password?
          </p>

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="reg-bottom">
          <p>Don't have an account?</p>
          <Link to="/register" id="reg-login">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;