import { Link } from "react-router-dom";
import "./InfoPages.css";

const safetyFeatures = [
    {
        number: "01",
        title: "Safety-focused AI instructions",
        text: "The AI is instructed to prioritize safety, avoid definitive diagnoses, identify emergency warning signs, and recommend professional care when appropriate.",
    },
    {
        number: "02",
        title: "Structured triage levels",
        text: "The system uses four defined triage levels: informational, routine consultation, prompt attention, and emergency warning.",
    },
    {
        number: "03",
        title: "AI response validation",
        text: "Generated responses are checked against the expected structure and allowed values before an analysis is saved.",
    },
    {
        number: "04",
        title: "Authenticated consultations",
        text: "Consultation endpoints require authentication, and the backend checks that a consultation belongs to the authenticated user.",
    },
    {
        number: "05",
        title: "No prescription dosages",
        text: "The AI instructions explicitly prohibit prescription medication recommendations, specific medication dosages, and dangerous home remedies.",
    },
    {
        number: "06",
        title: "Emergency-first guidance",
        text: "Potentially serious warning signs are surfaced separately so users are not encouraged to rely on general self-care when urgent evaluation may be needed.",
    },
];

export default function Safety() {
    return (
        <main className="info-page">
            {/* Hero */}
            <section className="info-hero">
                <div className="info-hero-content">
                    <span className="info-eyebrow">✦ SAFETY FIRST</span>

                    <h1>Safety comes before convenience</h1>

                    <p>
                        MediAI is designed to provide useful health information while
                        clearly communicating its limitations. It is a triage and
                        information tool — not a replacement for professional medical care.
                    </p>

                    <div className="info-hero-actions">
                        <Link to="/new-consultation" className="info-primary-btn">
                            Start an assessment
                            <span>→</span>
                        </Link>

                        <Link to="/" className="info-secondary-btn">
                            Back to home
                        </Link>
                    </div>
                </div>
            </section>

            {/* Emergency Notice */}
            <section className="info-section">
                <div className="safety-emergency-box">
                    <div className="safety-emergency-icon">!</div>

                    <div>
                        <h3>Important medical safety notice</h3>

                        <p>
                            Do not use MediAI to decide whether a medical emergency can wait.
                            If you believe you are experiencing a serious or life-threatening
                            condition, seek emergency medical care immediately.
                        </p>
                    </div>
                </div>

                {/* Heading */}
                <div className="info-section-heading safety-heading">
                    <span>BUILT-IN SAFETY CONTROLS</span>

                    <h2>Multiple layers help reduce avoidable risks</h2>

                    <p>
                        These protections are part of the current application architecture.
                        They improve the reliability of the output, but no AI system can
                        guarantee that every response will be correct.
                    </p>
                </div>

                {/* Safety Cards */}
                <div className="safety-grid">
                    {safetyFeatures.map((feature) => (
                        <article className="safety-card" key={feature.number}>
                            <div className="safety-card-number">{feature.number}</div>

                            <h3>{feature.title}</h3>

                            <p>{feature.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Limitations */}
            <section className="info-section info-section-soft">
                <div className="info-two-column">
                    <div>
                        <span className="info-kicker">HONEST LIMITATIONS</span>

                        <h2>Safety controls are not a guarantee of medical accuracy</h2>

                        <p>
                            AI can misunderstand symptoms, miss important context, or produce
                            an incorrect response. MediAI therefore should be treated as
                            supporting information rather than clinical judgment.
                        </p>

                        <p>
                            The current project also does not establish claims such as
                            regulatory medical-device approval, HIPAA compliance, or complete
                            end-to-end encryption.
                        </p>
                    </div>

                    <div className="safety-limits-panel">
                        <h3>Do not assume that MediAI is:</h3>

                        <div className="safety-limit-item">
                            <span>×</span>
                            <p>A replacement for a doctor</p>
                        </div>

                        <div className="safety-limit-item">
                            <span>×</span>
                            <p>A guaranteed diagnosis</p>
                        </div>

                        <div className="safety-limit-item">
                            <span>×</span>
                            <p>A substitute for emergency care</p>
                        </div>

                        <div className="safety-limit-item">
                            <span>×</span>
                            <p>A medically validated diagnostic device</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Privacy */}
            <section className="info-section">
                <div className="privacy-info">
                    <div>
                        <span className="info-kicker">YOUR INFORMATION</span>

                        <h2>Understand what happens to consultation data</h2>
                    </div>

                    <p>
                        MediAI uses authenticated accounts and associates consultations with
                        users. For AI analysis, the backend sends the consultation
                        information and relevant patient context to the configured Gemini
                        service. Because of this architecture, the application should not
                        claim that consultation data never leaves the system.
                    </p>
                </div>
            </section>

            {/* CTA */}
            <section className="info-bottom-cta">
                <div>
                    <span className="info-eyebrow">USE IT RESPONSIBLY</span>

                    <h2>Better information. Better decisions.</h2>

                    <p>
                        Use MediAI as a starting point for understanding your symptoms — and
                        involve a qualified healthcare professional when needed.
                    </p>
                </div>

                <Link to="/new-consultation" className="info-primary-btn">
                    Start Assessment
                    <span>→</span>
                </Link>
            </section>
        </main>
    );
}