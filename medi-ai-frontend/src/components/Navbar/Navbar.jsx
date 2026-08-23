import "./Navbar.css";
import useIsAuthenticated from "../../hooks/useIsAuthenticated";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import logout from "../../utils/logout.js";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { isLoggedIn, name } = useIsAuthenticated();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo">
        <div className="logo-icon">✚</div>

        <span>
          Medi<span>AI</span>
        </span>
      </div>

      <div className="nav-links">
        <a href="#home" className="active">
          Home
        </a>

        <a href="#how-it-works">How it works</a>
        <a href="#safety">Safety</a>
        <a href="#features">Features</a>
        <a href="#faqs">FAQs</a>
        <a href="#contact">Contact</a>
      </div>
      {isLoggedIn ? (
        <div className="user-profile">
          <span className="avatar">M</span>

          <span className="user-first-name">Hello, {name}</span>

          <span className="user-menu" onClick={() => setOpen(!open)}>
            <FontAwesomeIcon icon={open ? faAngleUp : faAngleDown} />
          </span>

          {open && (
            <div className="dropdown-menu">
              <button>Profile</button>
              <button onClick={() => navigate("history")}>History</button>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      ) : (
        <div className="nav-actions">
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="primary-btn" onClick={() => navigate("/register")}>
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;