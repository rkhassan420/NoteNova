import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./register.css";
import { verifyCode, forgotPassword } from "../services/authService";
import { validateVerifyCode, extractServerError } from "../utils/validators";

const VerifyCode = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state?.username;
  const email = location.state?.email;

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // ── Client-side validation ─────────────────────────────────────────────
    const codeError = validateVerifyCode(code);
    if (codeError) {
      setError(codeError);
      return;
    }

    setLoading(true);
    try {
      await verifyCode({ username, code });
      setMessage("Code verified successfully!");
      setTimeout(() => {
        navigate("/reset", { state: { username } });
      }, 1500);
    } catch (err) {
      setError(extractServerError(err) || "Invalid code, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setMessage("");
    setResending(true);
    try {
      await forgotPassword(username);
      setMessage("A new code has been sent to your email.");
    } catch (err) {
      setError("Failed to resend code. Please try again later.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="register-wraper">
      <div className="register-container">
        <h2>Verify Code</h2>

        <p className="forgot-title">
          Enter the 4-digit code sent to <b>{email}</b>. Code expires in 15 minutes.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="code"
            placeholder="Enter 4-digit code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (error) setError("");
            }}
            required
            maxLength={4}
            inputMode="numeric"
          />

          {error && <p className="error">{error}</p>}
          {message && <p className="error" style={{ color: "green" }}>{message}</p>}

          <div className="resend-container">
            <p className="resend-title">Don't receive code?</p>
            <p
              className="resend-btn"
              onClick={!resending ? handleResendCode : undefined}
              style={{ opacity: resending ? 0.5 : 1, cursor: resending ? "default" : "pointer" }}
            >
              {resending ? "Sending..." : "Resend"}
            </p>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyCode;