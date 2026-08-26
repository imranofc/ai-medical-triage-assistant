import { Link } from "react-router-dom";
import "./InfoPages.css";

const steps = [
    {
        number: "01",
        title: "Describe your symptoms",
        text: "Enter the symptoms you are experiencing, how long they have been present, their severity, and a short description.",
    },
    {
        number: "02",
        title: "Add your health context",
        text: "Provide relevant information such as age, gender, medical conditions, allergies, smoking, alcohol, diet, and exercise.",
    },
    {
        number: "03",
        title: "Review your information",
        text: "Your consultation information is collected before the analysis is generated, helping the AI work with the context you provide.",
    },
    {
        number: "04",
        title: "AI analyzes your consultation",
        text: "MediAI sends the consultation context to Gemini with structured instructions designed to produce a consistent and safety-focused response.",
    },
    {
        number: "05",
        title: "Get a structured result",
        text: "You receive a summary, triage level, possible explanations, warning signs, general self-care information, and safety guidance.",
    },
];

export default function HowItWorks() {
    return (
        <main className="info-page">
            {/* Hero */}
            <section className="info-hero">
                <div className="info-hero-content">
                    <span className="info-eyebrow">✦ UNDERSTAND THE PROCESS</span>

                    <h1>How MediAI works</h1>

                    <p>
                        MediAI transforms the health information you provide into a
                        structured triage response. It helps you understand your symptoms
                        and decide what level of care may be appropriate — it does not
                        replace a medical professional.
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

            {/* Steps */}
            <section className="info-section">
                <div className="info-section-heading">
                    <span>THE PROCESS</span>
                    <h2>From symptoms to a structured result</h2>
                    <p>
                        The consultation follows a simple flow so you can provide the
                        information needed for a useful assessment.
                    </p>
                </div>

                <div className="how-it-works-steps">
                    {steps.map((step) => (
                        <article className="how-step-card" key={step.number}>
                            <div className="how-step-number">{step.number}</div>

                            <div>
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* AI Safety */}
            <section className="info-section info-section-soft">
                <div className="info-two-column">
                    <div>
                        <span className="info-kicker">AI ANALYSIS</span>

                        <h2>
                            Designed to provide useful information without pretending to be
                            certain
                        </h2>

                        <p>
                            The AI is instructed to avoid diagnosing conditions with
                            certainty, inventing medical information, recommending
                            prescription medication or specific dosages, and giving advice
                            that could delay emergency treatment.
                        </p>
                    </div>

                    <div className="info-check-panel">
                        <div className="info-check-row">
                            <span>✓</span>
                            <p>
                                Possible explanations are not presented as confirmed diagnoses.
                            </p>
                        </div>

                        <div className="info-check-row">
                            <span>✓</span>
                            <p>Emergency warning signs are given priority.</p>
                        </div>

                        <div className="info-check-row">
                            <span>✓</span>
                            <p>Self-care suggestions are kept general and low-risk.</p>
                        </div>

                        <div className="info-check-row">
                            <span>✓</span>
                            <p>The AI response follows a predefined structure.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="info-bottom-cta">
                <div>
                    <span className="info-eyebrow">READY TO START?</span>

                    <h2>Understand your symptoms better.</h2>

                    <p>
                        Start a consultation and provide the information you are comfortable
                        sharing.
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