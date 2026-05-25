import { useState } from "react";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { validateRegisterForm } from "../utils/validators";

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    if (serverMessage) setServerMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");

    // ── Client-side validation ─────────────────────────────────────────────
    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await register(formData);

    if (result.success) {
      setServerMessage("✅ Registration successful!");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setServerMessage(`❌ ${result.message}`);
    }
  };

  return (
    <div className="register-wraper">
      <div className="register-container">
        <h2>Create Account</h2>

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

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
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

          {serverMessage && <p className="error">{serverMessage}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="reg-bottom">
          <p>Already have an account?</p>
          <Link to="/login" id="reg-login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;