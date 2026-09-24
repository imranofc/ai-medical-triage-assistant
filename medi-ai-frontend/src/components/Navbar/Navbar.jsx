import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import logout from "../../utils/logout.js";
import { useNavigate, NavLink } from "react-router-dom";
import useAuth from "../../context/useAuth.js";


function Navbar() {

  const navigate = useNavigate();
  const { name, isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false)
  return (
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">✚</div>

          <span>
            Medi<span>AI</span>
          </span>
        </div>

        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
          <NavLink to="/how-it-works" className={({ isActive }) => isActive ? "active" : ""}>How it works</NavLink>
          <NavLink to="/safety" className={({ isActive }) => isActive ? "active" : ""}>Safety</NavLink>
          <NavLink to="/features" className={({ isActive }) => isActive ? "active" : ""}>Features</NavLink>
          <NavLink to="/faqs" className={({ isActive }) => isActive ? "active" : ""}>FAQs</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>Contact</NavLink>
        </div>
        {isLoggedIn ? (
          <div className="user-profile">
            <span className="avatar">{name.charAt(0).toUpperCase()}</span>

            <span className="user-first-name">Hello, {name}</span>

            <span className="user-menu" onClick={() => setOpen(!open)}>
              <FontAwesomeIcon icon={open ? faAngleUp : faAngleDown} />
            </span>

            {open && (
              <div className="dropdown-menu">
                <button onClick={() => { navigate("new-consultation"); setOpen(false); }}>New Consultation</button>
                <button onClick={() => { navigate("profile"); setOpen(false); }}>Profile</button>
                <button onClick={() => { navigate("history"); setOpen(false); }}>History</button>
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