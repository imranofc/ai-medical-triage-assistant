import "./Navbar.css";

function Navbar() {
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

      <div className="nav-actions">
        <button className="login-btn">Login</button>
        <button className="primary-btn">Get Started</button>
      </div>
    </nav>
  );
}

export default Navbar;