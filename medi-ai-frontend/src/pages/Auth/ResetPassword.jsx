import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import {
  faLock,
  faEye,
  faEyeSlash,
  faArrowLeft,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import "./ResetPassword.css";
import API_URL from "../../config";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { uid, token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/reset-password/${uid}/${token}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ new_password: password, confirm_password: confirmPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to reset password. Please try again.");
        return;
      }

    setError("");
    setSubmitted(true);

    } catch (err) {
      setError("An error occurred while resetting the password. Please try again.");
      return;
    }

  };

  return (
    <div className="reset-page">
      <main className="reset-container">
        <div className="reset-card">
          <div className="reset-logo">
            <div className="reset-logo-icon">✚</div>

            <span>
              Medi<span>AI</span>
            </span>
          </div>

          {!submitted ? (
            <>
              <div className="reset-heading">
                <h1>Reset Password</h1>

                <p>
                  Create a new password for your account. Make sure it's strong
                  and secure.
                </p>
              </div>

              <form className="reset-form" onSubmit={handleSubmit}>
                <div className="reset-field">
                  <label htmlFor="new-password">New Password</label>

                  <div className="reset-input">
                    <FontAwesomeIcon
                      icon={faLock}
                      className="reset-input-icon"
                    />

                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      className="reset-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                </div>

                <div className="reset-field">
                  <label htmlFor="confirm-password">Confirm Password</label>

                  <div className="reset-input">
                    <FontAwesomeIcon
                      icon={faLock}
                      className="reset-input-icon"
                    />

                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      className="reset-password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      <FontAwesomeIcon
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                </div>

                {error && <div className="reset-error">{error}</div>}

                <button type="submit" className="reset-submit">
                  Reset Password
                </button>
              </form>

              <Link to="/login" className="reset-back">
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Back to Login</span>
              </Link>
            </>
          ) : (
            <div className="reset-success">
              <div className="reset-success-icon">
                <FontAwesomeIcon icon={faCheck} />
              </div>

              <h1>Password Reset Successful</h1>

              <p>
                Your password has been successfully updated. You can now login
                with your new password.
              </p>

              <button
                className="reset-login-button"
                onClick={() => navigate("/login")}
              >
                Continue to Login
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
