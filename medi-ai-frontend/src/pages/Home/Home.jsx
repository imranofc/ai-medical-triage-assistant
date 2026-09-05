import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="home">

      {/* =========================
          HERO SECTION
      ========================= */}

      <section className="hero" id="home">
        <div className="hero-content">
          <div className="hero-left">
            <div className="eyebrow">
              ✦ AI-Powered Health Assistant
            </div>

            <h1>
              AI-powered health
              <br />
              information & <span>triage assistant</span>
            </h1>

            <h2>
              Understand your symptoms.
              <br />
              Know what to do next.
            </h2>

            <p>
              Describe your symptoms and get structured health information,
              possible explanations, warning signs and guidance on when
              professional care may be appropriate.
            </p>

            <div className="hero-buttons">
              <button className="primary-btn hero-btn" onClick={() => navigate("/new-consultation")}>
                Start Assessment
                <span>→</span>
              </button>

              <button className="secondary-btn" onClick={() => navigate("/how-it-works")}>
                <span className="play-icon">▶</span>
                How it works
              </button>
            </div>

            <div className="privacy-note">
              <span>✓</span>
              Private. Secure. Your data is protected.
            </div>
          </div>

          {/* AI Assistant Preview */}

          <div className="hero-right">
            <div className="background-circle"></div>

            <div className="assistant-card">
              <div className="assistant-header">
                <div className="assistant-title">
                  <div className="ai-icon">✦</div>

                  <div>
                    <strong>AI Assistant</strong>
                  </div>
                </div>

                <div className="online">
                  <span></span>
                  Online
                </div>
              </div>

              <div className="message ai-message">
                What's bothering you today?
              </div>

              <div className="input-preview">
                <span>▧</span>
                Headache
              </div>

              <div className="input-preview">
                <span>▣</span>
                3 days
              </div>

              <div className="triage-box">
                <small>Triage level</small>

                <div className="triage-status">
                  <span></span>
                  Routine consultation
                </div>

                <p>
                  Based on the information provided
                </p>
              </div>

              <button className="continue-btn" onClick={() => navigate("/new-consultation")}>
                Continue Assessment
                <span>→</span>
              </button>
            </div>

            <div className="medical-decoration shield">
              ✚
            </div>

            <div className="medical-decoration stethoscope">
              ♡
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          HOW IT WORKS
      ========================= */}

      <section className="section" id="how-it-works">
        <div className="section-heading">
          <h2>How it works</h2>
          <div className="heading-line"></div>
        </div>

        <div className="steps">
          <div className="step-card">
            <div className="step-icon blue">
              ▤
            </div>

            <div className="step-number">
              01
            </div>

            <h3>
              Describe symptoms
            </h3>

            <p>
              Answer simple questions about your symptoms,
              duration and severity.
            </p>
          </div>

          <div className="step-card">
            <div className="step-icon teal">
              🤖
            </div>

            <div className="step-number">
              02
            </div>

            <h3>
              AI analyzes
            </h3>

            <p>
              Our AI analyzes your information using medical
              knowledge and evidence-based sources.
            </p>
          </div>

          <div className="step-card">
            <div className="step-icon yellow">
              💡
            </div>

            <div className="step-number">
              03
            </div>

            <h3>
              Get guidance
            </h3>

            <p>
              Receive structured insights, warning signs,
              self-care tips and next steps.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          ASSESSMENT FEATURES
      ========================= */}

      <section
        className="assessment-section"
        id="features"
      >
        <div className="section-heading">
          <h2>
            What your assessment includes
          </h2>

          <div className="heading-line"></div>
        </div>

        <div className="feature-list-home">
          <div className="feature-item">
            <div className="feature-icon blue">
              ▤
            </div>

            <span>
              Symptom
              <br />
              summary
            </span>
          </div>

          <div className="feature-item">
            <div className="feature-icon teal">
              ⌕
            </div>

            <span>
              Possible
              <br />
              explanations
            </span>
          </div>

          <div className="feature-item">
            <div className="feature-icon yellow">
              ⚠
            </div>

            <span>
              Warning
              <br />
              signs
            </span>
          </div>

          <div className="feature-item">
            <div className="feature-icon teal">
              ♡
            </div>

            <span>
              Self-care
              <br />
              information
            </span>
          </div>

          <div className="feature-item">
            <div className="feature-icon blue">
              ✓
            </div>

            <span>
              Triage
              <br />
              level
            </span>
          </div>

          <div className="feature-item">
            <div className="feature-icon pink">
              ?
            </div>

            <span>
              Follow-up
              <br />
              questions
            </span>
          </div>
        </div>
      </section>

      {/* =========================
          SAFETY
      ========================= */}

      <section
        className="safety-section"
        id="safety"
      >
        <div className="safety-icon">
          !
        </div>

        <div className="safety-content">
          <h3>
            Important
          </h3>

          <p>
            MediAI provides educational health information
            and triage guidance only. It does not provide a
            definitive diagnosis or replace a qualified
            healthcare professional.
          </p>
        </div>

        <button className="safety-btn">
          Read Safety Information
          <span>→</span>
        </button>
      </section>

    </div>
  );
}

export default Home;