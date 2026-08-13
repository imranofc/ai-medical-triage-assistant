import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

function Register() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [regEmail, setRegEmail] = useState("");
  const [regName, setRegName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPassword2, setRegPassword2] = useState("");

  const [termsAccepted, setTermsAccepted] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

 
  // FORM VALIDATION
 
  const validateForm = () => {
    const newErrors = {};

    const name = regName.trim();
    const email = regEmail.trim();
    const password = regPassword;
    const confirmPassword = regPassword2;

   
    // NAME VALIDATION
   
    if (!name) {
      newErrors.name = "Full name is required";
    } else if (name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (name.length > 50) {
      newErrors.name = "Name cannot exceed 50 characters";
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = "Name can only contain letters and spaces";
    }

   
    // EMAIL VALIDATION
   
    if (!email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

   
    // PASSWORD VALIDATION
   
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (password.length > 128) {
      newErrors.password = "Password cannot exceed 128 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password =
        "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/.test(password)) {
      newErrors.password =
        "Password must contain at least one special character";
    }

   
    // CONFIRM PASSWORD
   
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

   
    // TERMS
   
    if (!termsAccepted) {
      newErrors.terms =
        "You must accept the Terms of Service and Privacy Policy";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

 
  // SUBMIT
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form first
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
  
      const response = await fetch(
        "http://127.0.0.1:8000/api/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: regEmail.trim(),
            email: regEmail.trim(),
            password: regPassword,
            password2: regPassword2,
            first_name: regName.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          server:
            data.detail ||
            data.message ||
            "Registration failed. Please try again.",
        });

        return;
      }

      console.log("Registration successful:", data);

      // Successful registration
      navigate("/login");

      // Temporary success simulation
      console.log("Registration data:", {
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
      });

    } catch (error) {
      console.error("Registration error:", error);

      setErrors({
        server: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-circle"></div>

      <div className="auth-dot-pattern auth-dot-top"></div>
      <div className="auth-dot-pattern auth-dot-middle"></div>
      <div className="auth-dot-pattern auth-dot-bottom"></div>

      <main className="auth-layout">

        {/* ================= LEFT ================= */}
        <section className="auth-left">
          <div className="auth-left-content">
            <h1>Create your account</h1>

            <p className="auth-subtitle">
              Join MediAI and get personalized
              <br />
              AI-powered health assistance.
            </p>

            <div className="feature-list">

              <div className="feature">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 3L19 6V11C19 15.5 16.1 19.5 12 21C7.9 19.5 5 15.5 5 11V6L12 3Z"
                      fill="currentColor"
                    />

                    <path
                      d="M9.5 12L11 13.5L14.5 10"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div>
                  <h3>Secure &amp; Private</h3>
                  <p>Your data is encrypted and protected</p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M13.2 2L5 13H11L10.5 22L19 10.5H13L13.2 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                <div>
                  <h3>AI-Powered Insights</h3>
                  <p>Get intelligent health insights</p>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20.8 8.8C20.8 14.2 12 20 12 20C12 20 3.2 14.2 3.2 8.8C3.2 5.8 5.3 4 7.8 4C9.6 4 11 5 12 6.4C13 5 14.4 4 16.2 4C18.7 4 20.8 5.8 20.8 8.8Z"
                      fill="currentColor"
                    />

                    <path
                      d="M7.5 11H10L11.3 8.5L13.2 14.5L14.5 11H17"
                      stroke="white"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div>
                  <h3>Personalized Care</h3>
                  <p>Tailored recommendations for you</p>
                </div>
              </div>

            </div>
          </div>

          <div className="medical-art">
            <img
              src="/medical-illustration.svg"
              alt="Medical shield and stethoscope"
            />
          </div>

          <div className="privacy-badge">
            <span className="privacy-check">✓</span>
            <span>Private. Secure. Your data is protected.</span>
          </div>
        </section>

        {/* ================= REGISTER CARD ================= */}
        <section className="auth-card register-card">

          <div className="auth-card-heading">
            <h2>Create account</h2>

            <p>Sign up to get started with MediAI</p>
          </div>

          {/* ================= TABS ================= */}
          <div className="auth-tabs">

            <Link to="/login" className="auth-tab">
              Login
            </Link>

            <Link
              to="/register"
              className="auth-tab auth-tab-active"
            >
              Sign up
            </Link>

          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
            noValidate
          >

            {/* ================= NAME ================= */}
            <div className="form-field">

              <label htmlFor="register-name">
                Full name
              </label>

              <div className="input-box">

                <svg
                  className="input-svg"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="3.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <path
                    d="M5 20C5.7 16.6 8.2 14.8 12 14.8C15.8 14.8 18.3 16.6 19 20"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  id="register-name"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  value={regName}
                  onChange={(e) => {
                    setRegName(e.target.value);

                    if (errors.name) {
                      setErrors((prev) => ({
                        ...prev,
                        name: "",
                      }));
                    }
                  }}
                />

              </div>

              {errors.name && (
                <span className="form-error">
                  {errors.name}
                </span>
              )}

            </div>

            {/* ================= EMAIL ================= */}
            <div className="form-field">

              <label htmlFor="register-email">
                Email address
              </label>

              <div className="input-box">

                <svg
                  className="input-svg"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <path
                    d="M4 7L12 13L20 7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>

                <input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);

                    if (errors.email) {
                      setErrors((prev) => ({
                        ...prev,
                        email: "",
                      }));
                    }
                  }}
                />

              </div>

              {errors.email && (
                <span className="form-error">
                  {errors.email}
                </span>
              )}

            </div>

            {/* ================= PASSWORD ================= */}
            <div className="form-field">

              <label htmlFor="register-password">
                Password
              </label>

              <div className="input-box">

                <svg
                  className="input-svg"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <path
                    d="M8 10V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V10"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>

                <input
                  id="register-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  autoComplete="new-password"
                  value={regPassword}
                  onChange={(e) => {
                    setRegPassword(e.target.value);

                    if (errors.password) {
                      setErrors((prev) => ({
                        ...prev,
                        password: "",
                      }));
                    }
                  }}
                />

                <button
                  type="button"
                  className="password-button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "◉" : "◌"}
                </button>

              </div>

              {errors.password && (
                <span className="form-error">
                  {errors.password}
                </span>
              )}

            </div>

            {/* ================= CONFIRM PASSWORD ================= */}
            <div className="form-field">

              <label htmlFor="confirm-password">
                Confirm password
              </label>

              <div className="input-box">

                <svg
                  className="input-svg"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <path
                    d="M8 10V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V10"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>

                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  value={regPassword2}
                  onChange={(e) => {
                    setRegPassword2(e.target.value);

                    if (errors.confirmPassword) {
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: "",
                      }));
                    }
                  }}
                />

                <button
                  type="button"
                  className="password-button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? "◉" : "◌"}
                </button>

              </div>

              {errors.confirmPassword && (
                <span className="form-error">
                  {errors.confirmPassword}
                </span>
              )}

            </div>

            {/* ================= TERMS ================= */}
            <label className="register-terms">

              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);

                  if (errors.terms) {
                    setErrors((prev) => ({
                      ...prev,
                      terms: "",
                    }));
                  }
                }}
              />

              <span>
                I agree to the{" "}
                <Link to="/terms">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy">
                  Privacy Policy
                </Link>
              </span>

            </label>

            {errors.terms && (
              <span className="form-error terms-error">
                {errors.terms}
              </span>
            )}

            {/* ================= SERVER ERROR ================= */}
            {errors.server && (
              <div className="server-error">
                {errors.server}
              </div>
            )}

            {/* ================= SUBMIT ================= */}
            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Creating account..."
                  : "Create account"}
              </span>

              {!loading && (
                <span className="button-arrow">
                  →
                </span>
              )}
            </button>

          </form>

          {/* ================= DIVIDER ================= */}
          <div className="divider">

            <span></span>

            <p>or continue with</p>

            <span></span>

          </div>

          {/* ================= SOCIAL LOGIN ================= */}
          <div className="social-login">

            <button
              type="button"
              className="social-button"
            >
              <span className="google-logo">
                G
              </span>

              <span>Google</span>
            </button>

            <button
              type="button"
              className="social-button"
            >
              <span className="apple-text">
                ●
              </span>

              <span>Apple</span>
            </button>

          </div>

          {/* ================= LOGIN LINK ================= */}
          <p className="terms-text">
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>

        </section>

      </main>
    </div>
  );
}

export default Register;