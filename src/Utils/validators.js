// ── Individual field rules ─────────────────────────────────────────────────

export const validateUsername = (username) => {
  if (!username.trim()) return "Username is required.";
  if (username.trim().length < 3) return "Username must be at least 3 characters.";
  if (username.trim().length > 30) return "Username must be under 30 characters.";
  if (!/^[a-zA-Z0-9_]+$/.test(username))
    return "Username can only contain letters, numbers, and underscores.";
  return null;
};

export const validateEmail = (email) => {
  if (!email.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Please enter a valid email address.";
  return null;
};

export const validatePassword = (password) => {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  if (password.length > 128) return "Password is too long.";
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Please confirm your password.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return null;
};

export const validateVerifyCode = (code) => {
  if (!code.trim()) return "Verification code is required.";
  if (!/^\d{4}$/.test(code)) return "Code must be exactly 4 digits.";
  return null;
};

// ── Full form validators (return errors object) ────────────────────────────

export const validateLoginForm = ({ username, password }) => {
  const errors = {};
  const usernameError = validateUsername(username);
  const passwordError = validatePassword(password);
  if (usernameError) errors.username = usernameError;
  if (passwordError) errors.password = passwordError;
  return errors; // empty object = valid
};

export const validateRegisterForm = ({ username, email, password }) => {
  const errors = {};
  const usernameError = validateUsername(username);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  if (usernameError) errors.username = usernameError;
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  return errors;
};

export const validateResetForm = ({ password, confirmPassword }) => {
  const errors = {};
  const passwordError = validatePassword(password);
  const confirmError = validateConfirmPassword(password, confirmPassword);
  if (passwordError) errors.password = passwordError;
  if (confirmError) errors.confirmPassword = confirmError;
  return errors;
};

// ── Helper: extract first backend error from axios error ──────────────────
export const extractServerError = (error) => {
  if (!error.response?.data) return "Something went wrong. Please try again.";
  const data = error.response.data;
  if (typeof data === "string") return data;
  if (typeof data === "object") {
    const first = Object.values(data)[0];
    return Array.isArray(first) ? first[0] : String(first);
  }
  return "Something went wrong. Please try again.";
};