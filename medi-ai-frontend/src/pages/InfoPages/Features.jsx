import { Link } from "react-router-dom";
import "./InfoPages.css";

const features = [
    {
        icon: "▤",
        title: "Structured symptom intake",
        text: "Describe your symptoms, duration, severity, and what you are experiencing through a guided consultation flow.",
    },
    {
        icon: "✦",
        title: "AI health analysis",
        text: "Gemini generates a structured health-information response using the consultation context you provide.",
    },
    {
        icon: "⚠",
        title: "Triage level",
        text: "Results are organized into informational, routine consultation, prompt attention, or emergency warning.",
    },
    {
        icon: "⌕",
        title: "Possible explanations",
        text: "The analysis can present possible explanations with likelihood information without treating them as confirmed diagnoses.",
    },
    {
        icon: "!",
        title: "Warning signs",
        text: "Important warning signs are highlighted so you can recognize when professional or urgent medical attention may be appropriate.",
    },
    {
        icon: "♡",
        title: "General self-care",
        text: "Receive general, low-risk self-care information while avoiding prescription medication and specific dosages.",
    },
    {
        icon: "✓",
        title: "Response validation",
        text: "AI output is checked against the expected structure before the analysis is stored.",
    },
    {
        icon: "▣",
        title: "Consultation history",
        text: "Your consultations are associated with your authenticated account and can be organized through the application's consultation history.",
    },
];

export default function Features() {
    return (
        <main className="info-page">
            {/* Hero */}
            <section className="info-hero">
                <div className="info-hero-content">
                    <span className="info-eyebrow">✦ WHAT MEDIAI OFFERS</span>

                    <h1>Everything you need for a structured assessment</h1>

                    <p>
                        MediAI combines guided symptom collection, AI-powered analysis,
                        triage information, warning signs, and general self-care guidance
                        into one simple consultation experience.
                    </p>

                    <div className="info-hero-actions">
                        <Link to="/new-consultation" className="info-primary-btn">
                            Start an assessment
                            <span>→</span>
                        </Link>

                        <Link to="/how-it-works" className="info-secondary-btn">
                            See how it works
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="info-section">
                <div className="info-section-heading">
                    <span>CORE FEATURES</span>

                    <h2>Built around a clearer way to understand symptoms</h2>

                    <p>
                        Instead of giving you an unstructured chatbot conversation, MediAI
                        organizes the assessment into specific pieces of useful information.
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature) => (
                        <article className="feature-card" key={feature.title}>
                            <div className="feature-icon">{feature.icon}</div>

                            <h3>{feature.title}</h3>

                            <p>{feature.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Result structure */}
            <section className="info-section info-section-soft">
                <div className="info-section-heading">
                    <span>YOUR RESULT</span>

                    <h2>A result that is easy to understand</h2>

                    <p>
                        The analysis is organized into several sections so you can
                        distinguish the overall summary from possible explanations, warning
                        signs, and next-step guidance.
                    </p>
                </div>

                <div className="result-structure">
                    <div className="result-item">
                        <span>01</span>
                        <div>
                            <h3>Summary</h3>
                            <p>
                                A concise overview of the information provided and what the
                                analysis indicates.
                            </p>
                        </div>
                    </div>

                    <div className="result-item">
                        <span>02</span>
                        <div>
                            <h3>Triage level</h3>
                            <p>
                                A category indicating whether the situation appears
                                informational, routine, needs prompt attention, or carries an
                                emergency warning.
                            </p>
                        </div>
                    </div>

                    <div className="result-item">
                        <span>03</span>
                        <div>
                            <h3>Possible explanations</h3>
                            <p>
                                Potential explanations are presented as possibilities rather
                                than guaranteed diagnoses.
                            </p>
                        </div>
                    </div>

                    <div className="result-item">
                        <span>04</span>
                        <div>
                            <h3>Warning signs</h3>
                            <p>
                                Important symptoms or changes that may require additional
                                attention are highlighted separately.
                            </p>
                        </div>
                    </div>

                    <div className="result-item">
                        <span>05</span>
                        <div>
                            <h3>Self-care guidance</h3>
                            <p>
                                General, low-risk suggestions that may help while you consider
                                whether professional care is needed.
                            </p>
                        </div>
                    </div>

                    <div className="result-item">
                        <span>06</span>
                        <div>
                            <h3>Safety disclaimer</h3>
                            <p>
                                The result clearly reminds you that AI-generated information
                                should not replace professional medical judgment.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="info-bottom-cta">
                <div>
                    <span className="info-eyebrow">START WITH YOUR SYMPTOMS</span>

                    <h2>Get a structured view of your symptoms.</h2>

                    <p>
                        Provide your information and let MediAI organize it into a clear
                        triage-oriented result.
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