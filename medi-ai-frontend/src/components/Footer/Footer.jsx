import "./Footer.css";

function Footer() {
  return (
    <>
      <footer className="footer" id="contact">
        <div className="footer-brand">
          <div className="logo">
            <div className="logo-icon">✚</div>

            <span>
              Medi<span>AI</span>
            </span>
          </div>

          <p>
            AI-powered health information and triage assistant to help you
            understand your symptoms and know what to do next.
          </p>
        </div>

        <div className="footer-column">
          <h4>Product</h4>

          <a href="/how-it-works">How it works</a>
          <a href="/features">Features</a>
          <a href="/faqs">FAQs</a>
          <a href="/#">Pricing</a>
        </div>

        <div className="footer-column">
          <h4>Resources</h4>

          <a href="/safety">Safety Information</a>
          <a href="/#">Blog</a>
          <a href="/#">Privacy Policy</a>
          <a href="/#">Terms of Service</a>
        </div>

        <div className="footer-column">
          <h4>Company</h4>

          <a href="/#">About us</a>
          <a href="/contact">Contact us</a>
          <a href="/#">Careers</a>
        </div>

        <div className="footer-column newsletter">
          <h4>Stay connected</h4>

          <p>Get health tips and updates.</p>

          <div className="subscribe">
            <input
              type="email"
              placeholder="Enter your email"
            />

            <button>Subscribe</button>
          </div>

          <div className="socials">
            <span>f</span>
            <span>𝕏</span>
            <span>in</span>
            <span>◎</span>
          </div>
        </div>
      </footer>

      <div className="copyright">
        © 2026 MediAI. All rights reserved.
      </div>
    </>
  );
}

export default Footer;