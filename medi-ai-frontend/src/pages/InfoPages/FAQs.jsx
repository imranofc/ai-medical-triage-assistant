import { useState } from "react";
import { Link } from "react-router-dom";
import "./InfoPages.css";

const faqs = [
    {
        question: "Is MediAI a doctor or a diagnostic tool?",
        answer:
            "No. MediAI is an AI-powered health-information and triage assistant. It is designed to help you understand your symptoms and possible next steps. It cannot replace a qualified healthcare professional or provide a confirmed medical diagnosis.",
    },
    {
        question: "What does the triage level mean?",
        answer:
            "The result uses four categories: informational, routine consultation, prompt attention, and emergency warning. These categories are intended to provide general guidance about the level of attention that may be appropriate. They are not a medically validated emergency scoring system.",
    },
    {
        question: "Can I rely on MediAI during a medical emergency?",
        answer:
            "No. If you believe you are experiencing a medical emergency or a life-threatening condition, do not wait for an AI response. Contact your local emergency service or seek emergency medical care immediately.",
    },
    {
        question: "Does MediAI prescribe medicines?",
        answer:
            "The AI is specifically instructed not to recommend prescription medications, specific medication dosages, dangerous home remedies, or instructions that could delay emergency treatment.",
    },
    {
        question: "What information is used for the AI analysis?",
        answer:
            "The consultation can include your symptoms, duration, severity, symptom description, age, gender, medical conditions, allergies, smoking information, alcohol information, diet, and exercise information.",
    },
    {
        question: "Is my health information private?",
        answer:
            "The application uses authenticated accounts and associates consultations with users. However, the current architecture sends the consultation context to the configured Gemini service for AI analysis. Therefore, the application should not claim that your information never leaves the system.",
    },
    {
        question: "Does MediAI validate the AI response?",
        answer:
            "Yes. The backend expects a predefined JSON structure and validates important fields and allowed triage values before storing the generated analysis.",
    },
    {
        question: "Can the AI make mistakes?",
        answer:
            "Yes. AI can misunderstand incomplete information, miss important context, or generate an incorrect response. You should treat the result as supporting information and use professional medical judgment when making healthcare decisions.",
    },
    {
        question: "Does MediAI replace a doctor?",
        answer:
            "No. A healthcare professional can perform a physical examination, evaluate vital signs, interpret tests, ask follow-up questions, and consider clinical context that an AI system cannot fully reproduce.",
    },
    {
        question: "What should I do if I think the result is wrong?",
        answer:
            "Do not rely on the AI result if it conflicts with your symptoms, a healthcare professional's advice, or your own concern about a serious condition. Seek professional medical evaluation when appropriate.",
    },
];

function FAQItem({ question, answer, isOpen, onClick }) {
    return (
        <article className={`faq-item ${isOpen ? "faq-open" : ""}`}>
            <button
                type="button"
                className="faq-question"
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <span>{question}</span>

                <span className="faq-toggle">{isOpen ? "−" : "+"}</span>
            </button>

            <div className="faq-answer">
                <p>{answer}</p>
            </div>
        </article>
    );
}

export default function FAQs() {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <main className="info-page">
            {/* Hero */}
            <section className="info-hero">
                <div className="info-hero-content">
                    <span className="info-eyebrow">✦ FREQUENTLY ASKED QUESTIONS</span>

                    <h1>Questions? We've got answers.</h1>

                    <p>
                        Everything you should know before using MediAI, including how the AI
                        works, what the results mean, and the limitations you should
                        understand.
                    </p>

                    <div className="info-hero-actions">
                        <Link to="/new-consultation" className="info-primary-btn">
                            Start an assessment
                            <span>→</span>
                        </Link>

                        <Link to="/safety" className="info-secondary-btn">
                            Read safety information
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="info-section">
                <div className="info-section-heading">
                    <span>COMMON QUESTIONS</span>

                    <h2>What you should know about MediAI</h2>

                    <p>
                        We believe you should understand the tool and its limitations before
                        using it for health-related information.
                    </p>
                </div>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={faq.question}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => handleToggle(index)}
                        />
                    ))}
                </div>
            </section>

            {/* Safety CTA */}
            <section className="faq-safety-section">
                <div className="faq-safety-content">
                    <div className="faq-safety-icon">!</div>

                    <div>
                        <h3>Remember: MediAI is not emergency care</h3>

                        <p>
                            If you think you may be experiencing a medical emergency, seek
                            immediate professional medical attention instead of waiting for an
                            AI-generated result.
                        </p>
                    </div>

                    <Link to="/safety" className="faq-safety-link">
                        Safety information →
                    </Link>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="info-bottom-cta">
                <div>
                    <span className="info-eyebrow">READY TO BEGIN?</span>

                    <h2>Start your health assessment.</h2>

                    <p>
                        Provide your symptoms and get a structured AI-generated triage
                        response.
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