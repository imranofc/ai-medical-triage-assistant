import "./DashboardMenu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileMedical, faClock, faStar, faUser, faRightFromBracket, faHeadset, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import logout from "../../utils/logout";

function DashboardMenu() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="dashboard">
            <button className={`mobile-menu-btn ${menuOpen ? "menu-open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
                <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
            </button>
            <aside className={`dashboard-menu ${menuOpen ? "open" : ""}`}>
                <div className="dash-menu-logo">
                    <div className="dash-menu-logo-icon">✚</div>
                    <span>
                        Medi<span>AI</span>
                    </span>
                </div>
                <nav className="dashboard-nav">
                    <NavLink to="/new-consultation" onClick={() => setMenuOpen(false)}>
                        <FontAwesomeIcon icon={faFileMedical} />
                        <span>New Consultation</span>
                    </NavLink>
                    <NavLink to="/history" onClick={() => setMenuOpen(false)}>
                        <FontAwesomeIcon icon={faClock} />
                        <span>History</span>
                    </NavLink>
                    <NavLink to="/saved" onClick={() => setMenuOpen(false)}>
                        <FontAwesomeIcon icon={faStar} />
                        <span>Saved</span>
                    </NavLink>
                    <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
                        <FontAwesomeIcon icon={faUser} />
                        <span>Profile</span>
                    </NavLink>
                    <button className="logout-btn" onClick={logout}>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        <span>Logout</span>
                    </button>
                </nav>
                <div className="support-card">
                    <FontAwesomeIcon icon={faHeadset} className="support-icon" />
                    <h3>Need Help?</h3>
                    <p>Our AI is here to assist you 24/7.</p>
                    <button>Contact Support</button>
                </div>
            </aside>
            {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>}
            <main className="dashboard-content">
                <Outlet />
            </main>
        </div>
    );
}

export default DashboardMenu;