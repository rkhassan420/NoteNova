import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./register.css";
import { resetPassword } from "../services/authService";
import { validateResetForm, extractServerError } from "../utils/validators";

const ResetPass = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state?.username;

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // ── Client-side validation ─────────────────────────────────────────────
    const validationErrors = validateResetForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ username, password: formData.password });
      setMessage("Password reset successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(extractServerError(err) || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wraper">
      <div className="register-container">
        <h2>Reset Password</h2>
        <p className="forgot-title">
          Set a new password for <b>{username}</b>
        </p>

        <form onSubmit={handleSubmit}>
          <input
            className="new-pass"
            type="password"
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}

          {message && <p className="error">{message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPass;