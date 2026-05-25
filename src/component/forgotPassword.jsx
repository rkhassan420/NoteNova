import { useState } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import { validateUsername, extractServerError } from "../utils/validators";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // ── Client-side validation ─────────────────────────────────────────────
    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return;
    }

    setLoading(true);
    try {
      const data = await forgotPassword(username);
      setMessage("Reset code sent to your email.");
      setTimeout(() => {
        navigate("/verify", {
          state: { username, email: data.email },
        });
      }, 1500);
    } catch (err) {
      setError(extractServerError(err) || "This username is not registered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wraper">
      <div className="register-container">
        <h2>Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError("");
              }}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}
          {message && <p className="error" style={{ color: "green" }}>{message}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;