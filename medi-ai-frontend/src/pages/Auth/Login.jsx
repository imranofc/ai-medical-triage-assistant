import React, { useState } from "react";
import { Link, } from "react-router-dom";
import "./Auth.css";
import API_URL from "../../config";

function Login() {

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    const email = loginEmail.trim();

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!loginPassword) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginEmail.trim(),
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          general: data.detail || "Invalid email or password",
        });

        return;
      }

      localStorage.setItem("access_token", data.access);

      localStorage.setItem("refresh_token", data.refresh);

      window.location.href = "/new-consultation/"
      
    } catch (error) {
      console.error("Login error:", error);

      setErrors({
        general: "Unable to connect to server",
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
        {/* ================= LEFT SIDE ================= */}
        <section className="auth-left">
          <div className="auth-left-content">
            <h1>Login to your account</h1>

            <p className="auth-subtitle">
              Welcome back! Please login to continue
              <br />
              to your health assistant.
            </p>

            <div className="feature-list">
              <div className="feature">
                <div className="feature-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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

          {/* Medical Illustration */}
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

        {/* ================= RIGHT SIDE ================= */}
        <section className="auth-card">
          <div className="auth-card-heading">
            <h2>Welcome back</h2>

            <p>Login to continue to MediAI</p>
          </div>

          {/* Tabs */}
          <div className="auth-tabs">
            <Link to="/login" className="auth-tab auth-tab-active">
              Login
            </Link>

            <Link to="/register" className="auth-tab">
              Sign up
            </Link>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* General Error */}
            {errors.general && (
              <p className="form-error general-error">{errors.general}</p>
            )}

            {/* Email */}
            <div className="form-field">
              <label htmlFor="login-email">Email address</label>

              <div className="input-box">
                <svg className="input-svg" viewBox="0 0 24 24" fill="none">
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);

                    if (errors.email || errors.general) {
                      setErrors((prev) => ({
                        ...prev,
                        email: "",
                        general: "",
                      }));
                    }
                  }}
                />
              </div>

              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="form-field">
              <label htmlFor="login-password">Password</label>

              <div className="input-box">
                <svg className="input-svg" viewBox="0 0 24 24" fill="none">
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
                    strokeLinecap="round"
                  />

                  <circle cx="12" cy="15" r="1.2" fill="currentColor" />
                </svg>

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);

                    if (errors.password || errors.general) {
                      setErrors((prev) => ({
                        ...prev,
                        password: "",
                        general: "",
                      }));
                    }
                  }}
                />

                <button
                  type="button"
                  className="password-button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 3L21 21"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />

                      <path
                        d="M10.6 10.6A2 2 0 0013.4 13.4"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />

                      <path
                        d="M9.9 4.3C10.6 4.1 11.3 4 12 4C17.5 4 21 9 21 9C21 9 19.8 10.7 18 12.2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />

                      <path
                        d="M6.2 6.2C4.2 7.6 3 9 3 9C3 9 6.5 14 12 14C13 14 13.9 13.8 14.7 13.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 12C3 12 6.5 6 12 6C17.5 6 21 12 21 12C21 12 17.5 18 12 18C6.5 18 3 12 3 12Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="form-error">{errors.password}</p>
              )}
            </div>

            {/* Options */}
            <div className="form-options">
              <label className="remember">
                <input type="checkbox" />

                <span>Remember me</span>
              </label>

              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            {/* Login */}
            <button type="submit" className="primary-button" disabled={loading}>
              <span>{loading ? "Logging in..." : "Login"}</span>

              {!loading && <span className="button-arrow">→</span>}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span></span>

            <p>or continue with</p>

            <span></span>
          </div>

          {/* Social */}
          <div className="social-login">
            <button type="button" className="social-button">
              <span className="google-logo">G</span>

              <span>Google</span>
            </button>

            <button type="button" className="social-button">
              <svg className="apple-logo" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M16.7 12.7C16.7 10.5 18.5 9.4 18.6 9.3C17.6 7.8 16 7.6 15.4 7.6C14 7.4 12.7 8.5 12 8.5C11.3 8.5 10.2 7.6 9 7.6C6.8 7.6 5 9.4 5 12.1C5 13.8 5.6 15.5 6.4 16.8C7.1 18 8.1 19.4 9.4 19.3C10.6 19.3 11 18.5 12.5 18.5C14 18.5 14.4 19.3 15.6 19.3C16.9 19.3 17.8 18.1 18.5 16.9C19.3 15.6 19.6 14.4 19.6 14.3C19.5 14.3 16.7 13.3 16.7 12.7Z"
                />

                <path
                  fill="currentColor"
                  d="M14.5 6.3C15.1 5.6 15.5 4.6 15.4 3.7C14.5 3.7 13.5 4.2 12.9 4.9C12.3 5.6 11.8 6.5 12 7.4C12.9 7.5 13.9 7 14.5 6.3Z"
                />
              </svg>

              <span>Apple</span>
            </button>
          </div>

          {/* Terms */}
          <p className="terms-text">
            By continuing, you agree to our{" "}
            <Link to="/terms">Terms of Service</Link> and{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Login;