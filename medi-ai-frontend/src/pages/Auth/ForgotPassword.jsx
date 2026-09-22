import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faArrowLeft,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import "./ForgotPassword.css";
import API_URL from "../../config";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    try {
      
        const response = await fetch(`${API_URL}/api/forgot-password/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          alert("Failed to send password reset link");
          return;
        }

        setSubmitted(true);

    } catch (error) {
      console.error("Error sending password reset link:", error);
    }


  };

  return (
    <div className="forgot-page">
      <main className="forgot-container">
        <div className="forgot-card">

          <div className="forgot-logo">
            <div className="forgot-logo-icon">✚</div>

            <span>
              Medi<span>AI</span>
            </span>
          </div>

          {!submitted ? (
            <>
              <div className="forgot-heading">
                <h1>Forgot Password?</h1>

                <p>
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
              </div>

              <form className="forgot-form" onSubmit={handleSubmit}>
                <div className="forgot-field">
                  <label htmlFor="forgot-email">Email Address</label>

                  <div className="forgot-input">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="forgot-input-icon"
                    />

                    <input
                      id="forgot-email"
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="forgot-submit">
                  <span>Send Reset Link</span>

                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </form>

              <Link to="/login" className="forgot-back">
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Back to Login</span>
              </Link>
            </>
          ) : (
            <div className="forgot-success">
              <div className="forgot-success-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>

              <h1>Check Your Email</h1>

              <p>
                If an account exists with <strong>{email}</strong>, we've sent
                you a password reset link.
              </p>

              <p className="forgot-success-note">
                Please check your inbox and spam folder.
              </p>

              <Link to="/login" className="forgot-back">
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Back to Login</span>
              </Link>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;