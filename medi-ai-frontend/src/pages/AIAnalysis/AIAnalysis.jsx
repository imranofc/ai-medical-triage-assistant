import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeftLong,
    faShieldHalved,
    faTriangleExclamation,
    faFileMedical,
    faHandHoldingHeart,
    faCircleInfo,
    faBookmark,
    faDownload,
    faCircleCheck,
    faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import "./AIAnalysis.css";

function AIAnalysis() {
    const urlParams = new URLSearchParams(window.location.search);
    const consultationId = urlParams.get("id");

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const extractAnalysis = (data) => {
        if (!data) {
            return null;
        }

        if (
            data.data &&
            data.data.response &&
            typeof data.data.response === "object"
        ) {
            return data.data.response;
        }

        if (
            data.response &&
            typeof data.response === "object"
        ) {
            return data.response;
        }

        if (
            data.analysis &&
            typeof data.analysis === "object"
        ) {
            return data.analysis;
        }

        if (
            data.data &&
            typeof data.data === "object" &&
            !Array.isArray(data.data)
        ) {
            if (
                data.data.triage ||
                data.data.possible_explanations ||
                data.data.warning_signs ||
                data.data.self_care ||
                data.data.summary
            ) {
                return data.data;
            }
        }

        if (
            data.triage ||
            data.possible_explanations ||
            data.warning_signs ||
            data.self_care ||
            data.summary
        ) {
            return data;
        }

        return null;
    };

    useEffect(() => {
        const loadAnalysis = async () => {
            if (!consultationId) {
                setError("Consultation ID is missing.");
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem("access_token");

                if (!token) {
                    window.location.href = "/login";
                    return;
                }

                const apiUrl =
                    `http://127.0.0.1:8000/api/analysis/?id=${consultationId}`;

                let response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });

                let data;

                try {
                    data = await response.json();
                } catch {
                    data = {};
                }

                if (response.status === 401) {
                    localStorage.removeItem("access_token");
                    window.location.href = "/login";
                    return;
                }

                if (response.status === 404) {
                    response = await fetch(apiUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    });

                    try {
                        data = await response.json();
                    } catch {
                        data = {};
                    }

                    if (response.status === 401) {
                        localStorage.removeItem("access_token");
                        window.location.href = "/login";
                        return;
                    }

                    if (!response.ok) {
                        throw new Error(
                            data.detail ||
                            data.error ||
                            "Failed to generate AI analysis."
                        );
                    }

                    const generatedAnalysis =
                        extractAnalysis(data);

                    if (generatedAnalysis) {
                        setAnalysis(generatedAnalysis);
                        return;
                    }

                    console.error(
                        "POST Analysis Response:",
                        data
                    );

                    throw new Error(
                        "AI analysis response is empty."
                    );
                }

                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        data.error ||
                        "Failed to load AI analysis."
                    );
                }

                const savedAnalysis =
                    extractAnalysis(data);

                if (savedAnalysis) {
                    setAnalysis(savedAnalysis);
                    return;
                }

                console.error(
                    "GET Analysis Response:",
                    data
                );

                throw new Error(
                    "AI analysis data is empty."
                );
            } catch (err) {
                console.error(
                    "AI Analysis Error:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to load AI analysis."
                );
            } finally {
                setLoading(false);
            }
        };

        loadAnalysis();
    }, [consultationId]);

    if (loading) {
        return (
            <div className="analysis-page">
                <main className="analysis-main">
                    <div className="analysis-content">
                        <div className="analysis-card">
                            <div className="analysis-loading">
                                <div className="analysis-loader"></div>
                                <p>
                                    Loading your AI analysis...
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="analysis-page">
                <main className="analysis-main">
                    <div className="analysis-content">
                        <div className="analysis-card">
                            <div className="analysis-error">
                                <FontAwesomeIcon
                                    icon={
                                        faTriangleExclamation
                                    }
                                />
                                <h3>
                                    Unable to load analysis
                                </h3>
                                <p>
                                    {error}
                                </p>
                                <button
                                    className="analysis-back-btn"
                                    onClick={() =>
                                        window.history.back()
                                    }
                                >
                                    <FontAwesomeIcon
                                        icon={
                                            faArrowLeftLong
                                        }
                                    />
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const triage =
        analysis?.triage || {};

    const possibleExplanations =
        Array.isArray(
            analysis?.possible_explanations
        )
            ? analysis.possible_explanations
            : [];

    const warningData =
        analysis?.warning_signs;

    const warningSigns =
        Array.isArray(warningData)
            ? warningData
            : Array.isArray(
                  warningData?.items
              )
            ? warningData.items
            : [];

    const selfCareData =
        analysis?.self_care;

    const selfCare =
        Array.isArray(selfCareData)
            ? selfCareData
            : Array.isArray(
                  selfCareData?.items
              )
            ? selfCareData.items
            : [];

    const triageTitle =
        triage?.title ||
        triage?.level ||
        "Not specified";

    const triageDescription =
        triage?.description ||
        "Your symptoms have been analyzed based on the information provided.";

    const triageReason =
        triage?.reason ||
        "This level is based on the symptoms and information provided in your consultation.";

    return (
        <div className="analysis-page">

            <main className="analysis-main">
                <div className="analysis-content">
                    <div className="analysis-card">
                        <div className="analysis-header">
                            <div className="analysis-title-box">
                                <h2>
                                    <FontAwesomeIcon
                                        icon={
                                            faArrowLeftLong
                                        }
                                        onClick={() =>
                                            window.history.back()
                                        }
                                    />
                                    AI Analysis &
                                    Recommendations
                                </h2>

                                <p>
                                    {analysis?.summary ||
                                        "Here is the AI analysis based on the information you provided."}
                                </p>
                            </div>

                            <div className="analysis-secure">
                                <FontAwesomeIcon
                                    icon={
                                        faShieldHalved
                                    }
                                />
                                <span>
                                    Secure & Private
                                </span>
                            </div>
                        </div>

                        <div className="analysis-steps">
                            <div className="analysis-step completed">
                                <div className="analysis-step-number">
                                    <FontAwesomeIcon
                                        icon={
                                            faCircleCheck
                                        }
                                    />
                                </div>
                                <span>
                                    Symptoms
                                </span>
                            </div>

                            <div className="analysis-step-line completed-line"></div>

                            <div className="analysis-step completed">
                                <div className="analysis-step-number">
                                    <FontAwesomeIcon
                                        icon={
                                            faCircleCheck
                                        }
                                    />
                                </div>
                                <span>
                                    Details
                                </span>
                            </div>

                            <div className="analysis-step-line completed-line"></div>

                            <div className="analysis-step completed">
                                <div className="analysis-step-number">
                                    <FontAwesomeIcon
                                        icon={
                                            faCircleCheck
                                        }
                                    />
                                </div>
                                <span>
                                    Review
                                </span>
                            </div>

                            <div className="analysis-step-line active-line"></div>

                            <div className="analysis-step active">
                                <div className="analysis-step-number">
                                    4
                                </div>
                                <span>
                                    AI Analysis
                                </span>
                            </div>
                        </div>

                        <div className="triage-box">
                            <div className="triage-icon">
                                <FontAwesomeIcon
                                    icon={
                                        faTriangleExclamation
                                    }
                                />
                            </div>

                            <div className="triage-content">
                                <h3>
                                    Triage Level:
                                    <span>
                                        {" "}
                                        {triageTitle}
                                    </span>
                                </h3>

                                <p>
                                    {triageDescription}
                                </p>
                            </div>

                            <button
                                className="triage-info-btn"
                                onClick={() =>
                                    alert(
                                        triageReason
                                    )
                                }
                            >
                                Why this level?
                                <FontAwesomeIcon
                                    icon={
                                        faCircleInfo
                                    }
                                />
                            </button>
                        </div>

                        <div className="analysis-result-grid">
                            <div className="result-card">
                                <div className="result-card-header">
                                    <div className="result-icon purple">
                                        <FontAwesomeIcon
                                            icon={
                                                faFileMedical
                                            }
                                        />
                                    </div>

                                    <h3>
                                        Possible Explanations
                                    </h3>
                                </div>

                                <ul className="result-list">
                                    {possibleExplanations.length >
                                    0 ? (
                                        possibleExplanations
                                            .slice(0, 4)
                                            .map(
                                                (
                                                    item,
                                                    index
                                                ) => (
                                                    <li
                                                        key={
                                                            index
                                                        }
                                                    >
                                                        {typeof item ===
                                                        "object"
                                                            ? item.name ||
                                                              item.title ||
                                                              "Possible explanation"
                                                            : item}
                                                    </li>
                                                )
                                            )
                                    ) : (
                                        <li>
                                            No possible
                                            explanations
                                            available.
                                        </li>
                                    )}
                                </ul>

                                {possibleExplanations.length >
                                    0 && (
                                    <button
                                        className="result-link"
                                        onClick={() =>
                                            window.location.href =
                                                `/new-consultation/analysis/details?id=${consultationId}`
                                        }
                                    >
                                        View details
                                        <FontAwesomeIcon
                                            icon={
                                                faChevronRight
                                            }
                                        />
                                    </button>
                                )}
                            </div>

                            <div className="result-card">
                                <div className="result-card-header">
                                    <div className="result-icon orange">
                                        <FontAwesomeIcon
                                            icon={
                                                faTriangleExclamation
                                            }
                                        />
                                    </div>

                                    <h3>
                                        Warning Signs
                                    </h3>
                                </div>

                                <ul className="result-list">
                                    {warningSigns.length >
                                    0 ? (
                                        warningSigns
                                            .slice(0, 4)
                                            .map(
                                                (
                                                    warning,
                                                    index
                                                ) => (
                                                    <li
                                                        key={
                                                            index
                                                        }
                                                    >
                                                        {typeof warning ===
                                                        "object"
                                                            ? warning.name ||
                                                              warning.title ||
                                                              warning.warning ||
                                                              "Warning sign"
                                                            : warning}
                                                    </li>
                                                )
                                            )
                                    ) : (
                                        <li>
                                            No warning
                                            signs
                                            available.
                                        </li>
                                    )}
                                </ul>

                                {warningSigns.length >
                                    0 && (
                                    <button
                                        className="result-link"
                                        onClick={() =>
                                            window.location.href =
                                                `/new-consultation/analysis/warnings?id=${consultationId}`
                                        }
                                    >
                                        View details
                                        <FontAwesomeIcon
                                            icon={
                                                faChevronRight
                                            }
                                        />
                                    </button>
                                )}
                            </div>

                            <div className="result-card">
                                <div className="result-card-header">
                                    <div className="result-icon green">
                                        <FontAwesomeIcon
                                            icon={
                                                faHandHoldingHeart
                                            }
                                        />
                                    </div>

                                    <h3>
                                        Self-Care
                                        Suggestions
                                    </h3>
                                </div>

                                <ul className="result-list">
                                    {selfCare.length >
                                    0 ? (
                                        selfCare
                                            .slice(0, 4)
                                            .map(
                                                (
                                                    item,
                                                    index
                                                ) => (
                                                    <li
                                                        key={
                                                            index
                                                        }
                                                    >
                                                        {typeof item ===
                                                        "object"
                                                            ? item.name ||
                                                              item.title ||
                                                              item.action ||
                                                              "Self-care recommendation"
                                                            : item}
                                                    </li>
                                                )
                                            )
                                    ) : (
                                        <li>
                                            No self-care
                                            suggestions
                                            available.
                                        </li>
                                    )}
                                </ul>

                                {selfCare.length >
                                    0 && (
                                    <button
                                        className="result-link"
                                        onClick={() =>
                                            window.location.href =
                                                `/new-consultation/analysis/self-care?id=${consultationId}`
                                        }
                                    >
                                        View details
                                        <FontAwesomeIcon
                                            icon={
                                                faChevronRight
                                            }
                                        />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="analysis-disclaimer">
                            <div className="disclaimer-icon">
                                <FontAwesomeIcon
                                    icon={
                                        faShieldHalved
                                    }
                                />
                            </div>

                            <div>
                                <h4>
                                    Disclaimer
                                </h4>

                                <p>
                                    {analysis?.disclaimer ||
                                        "This information is for educational purposes only and is not a substitute for professional medical advice."}
                                </p>
                            </div>
                        </div>

                        <div className="analysis-important">
                            <div className="important-icon">
                                <FontAwesomeIcon
                                    icon={
                                        faCircleInfo
                                    }
                                />
                            </div>

                            <div>
                                <h4>
                                    Important
                                </h4>

                                <p>
                                    {analysis?.important ||
                                        "If your symptoms worsen or you experience severe warning signs, seek immediate professional medical care."}
                                </p>
                            </div>
                        </div>

                        <div className="analysis-actions">
                            <button
                                className="analysis-back-btn"
                                onClick={() =>
                                    window.history.back()
                                }
                            >
                                <FontAwesomeIcon
                                    icon={
                                        faArrowLeftLong
                                    }
                                />
                                Back to Review
                            </button>

                            <div className="analysis-action-right">
                                <button
                                    className="analysis-save-btn"
                                    onClick={() =>
                                        alert(
                                            "Save Report feature will be added next."
                                        )
                                    }
                                >
                                    <FontAwesomeIcon
                                        icon={
                                            faBookmark
                                        }
                                    />
                                    Save Report
                                </button>

                                <button
                                    className="analysis-download-btn"
                                    onClick={() =>
                                        alert(
                                            "Download PDF feature will be added next."
                                        )
                                    }
                                >
                                    <FontAwesomeIcon
                                        icon={
                                            faDownload
                                        }
                                    />
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

export default AIAnalysis;