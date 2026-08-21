import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeftLong,
    faShieldHalved,
    faFileMedical,
    faCircleCheck,
    faTriangleExclamation,
    faCircleInfo,
    faStethoscope,
    faChevronDown,
    faChevronUp
} from "@fortawesome/free-solid-svg-icons";
import DashboardNavbar from "../../components/DashboardNavbar/DashboardNavbar.jsx";
import "./AnalysisDetails.css";

function AnalysisDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const consultationId = urlParams.get("id");

    const [explanations, setExplanations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [openIndex, setOpenIndex] = useState(0);

    useEffect(() => {
        const loadDetails = async () => {
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

                const response = await fetch(
                    `http://127.0.0.1:8000/api/analysis/?id=${consultationId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (response.status === 401) {
                    localStorage.removeItem("access_token");
                    window.location.href = "/login";
                    return;
                }

                if (!response.ok) {
                    throw new Error(
                        data?.detail ||
                        data?.error ||
                        "Failed to load analysis details."
                    );
                }

                const responseData =
                    data?.data?.response ||
                    data?.response ||
                    data?.analysis ||
                    data?.data;

                if (!responseData) {
                    throw new Error("Analysis data is empty.");
                }

                const possibleExplanations =
                    responseData?.possible_explanations;

                if (!Array.isArray(possibleExplanations)) {
                    throw new Error(
                        "Possible explanations are not available."
                    );
                }

                setExplanations(possibleExplanations);
            } catch (err) {
                console.error("Analysis Details Error:", err);
                setError(
                    err.message ||
                    "Failed to load analysis details."
                );
            } finally {
                setLoading(false);
            }
        };

        loadDetails();
    }, [consultationId]);

    const goBack = () => {
        window.location.href =
            `/new-consultation/analysis?id=${consultationId}`;
    };

    const formatLabel = (key) => {
        return String(key)
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const renderValue = (value) => {
        if (Array.isArray(value)) {
            return (
                <ul className="details-value-list">
                    {value.map((item, index) => (
                        <li key={index}>
                            {typeof item === "object" &&
                            item !== null ? (
                                <div className="nested-object">
                                    {Object.entries(item).map(
                                        ([key, nestedValue]) => (
                                            <div
                                                className="nested-item"
                                                key={key}
                                            >
                                                <strong>
                                                    {formatLabel(key)}
                                                </strong>
                                                <span>
                                                    {renderValue(
                                                        nestedValue
                                                    )}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                String(item)
                            )}
                        </li>
                    ))}
                </ul>
            );
        }

        if (
            value !== null &&
            typeof value === "object"
        ) {
            return (
                <div className="nested-object">
                    {Object.entries(value).map(
                        ([key, nestedValue]) => (
                            <div
                                className="nested-item"
                                key={key}
                            >
                                <strong>
                                    {formatLabel(key)}
                                </strong>
                                <span>
                                    {renderValue(nestedValue)}
                                </span>
                            </div>
                        )
                    )}
                </div>
            );
        }

        return String(value ?? "");
    };

    if (loading) {
        return (
            <div className="analysis-details-page">
                <DashboardNavbar />

                <main className="analysis-details-main">
                    <div className="analysis-details-content">
                        <div className="details-main-card">
                            <div className="details-loading">
                                <div className="details-loader"></div>

                                <h3>
                                    Loading explanation details...
                                </h3>

                                <p>
                                    Please wait while we
                                    prepare your results.
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
            <div className="analysis-details-page">
                <DashboardNavbar />

                <main className="analysis-details-main">
                    <div className="analysis-details-content">
                        <div className="details-main-card">
                            <div className="details-error">
                                <div className="details-error-icon">
                                    <FontAwesomeIcon
                                        icon={
                                            faTriangleExclamation
                                        }
                                    />
                                </div>

                                <h3>
                                    Unable to load details
                                </h3>

                                <p>{error}</p>

                                <button
                                    className="details-back-btn"
                                    onClick={goBack}
                                >
                                    <FontAwesomeIcon
                                        icon={
                                            faArrowLeftLong
                                        }
                                    />
                                    Back to Analysis
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="analysis-details-page">
            <DashboardNavbar />

            <main className="analysis-details-main">
                <div className="analysis-details-content">
                    <div className="details-main-card">
                        <div className="details-header">
                            <div className="details-title-box">
                                <button
                                    className="details-title-back"
                                    onClick={goBack}
                                    type="button"
                                >
                                    <FontAwesomeIcon
                                        icon={faArrowLeftLong}
                                    />
                                </button>

                                <div>
                                    <h2>
                                        Possible Explanations
                                    </h2>

                                    <p>
                                        Understand the possible
                                        explanations identified
                                        from your symptoms.
                                    </p>
                                </div>
                            </div>

                            <div className="details-secure">
                                <FontAwesomeIcon
                                    icon={faShieldHalved}
                                />

                                <span>
                                    Secure &amp; Private
                                </span>
                            </div>
                        </div>

                        <div className="details-info-banner">
                            <div className="details-info-icon">
                                <FontAwesomeIcon
                                    icon={faCircleInfo}
                                />
                            </div>

                            <div>
                                <h4>
                                    Possible explanations
                                </h4>

                                <p>
                                    These are possible
                                    explanations associated
                                    with the information you
                                    provided. They are not a
                                    confirmed diagnosis.
                                </p>
                            </div>
                        </div>

                        <div className="details-section-heading">
                            <div>
                                <span>
                                    AI Analysis
                                </span>

                                <h3>
                                    Possible explanations
                                </h3>
                            </div>

                            <div className="details-count">
                                {explanations.length}{" "}
                                {explanations.length === 1
                                    ? "explanation"
                                    : "explanations"}
                            </div>
                        </div>

                        {explanations.length === 0 ? (
                            <div className="details-empty">
                                <FontAwesomeIcon
                                    icon={faFileMedical}
                                />

                                <h3>
                                    No explanations available
                                </h3>

                                <p>
                                    No detailed explanations
                                    were included in this
                                    analysis.
                                </p>
                            </div>
                        ) : (
                            <div className="explanations-list">
                                {explanations.map(
                                    (item, index) => {
                                        const isObject =
                                            item !== null &&
                                            typeof item ===
                                                "object";

                                        const title = isObject
                                            ? item.name ||
                                              item.title ||
                                              `Possible Explanation ${
                                                  index + 1
                                              }`
                                            : String(item);

                                        const details =
                                            isObject
                                                ? Object.entries(
                                                      item
                                                  ).filter(
                                                      ([key]) =>
                                                          key !==
                                                              "name" &&
                                                          key !==
                                                              "title"
                                                  )
                                                : [];

                                        const isOpen =
                                            openIndex === index;

                                        return (
                                            <div
                                                className={`explanation-card ${
                                                    isOpen
                                                        ? "open"
                                                        : ""
                                                }`}
                                                key={index}
                                            >
                                                <button
                                                    type="button"
                                                    className="explanation-header"
                                                    onClick={() =>
                                                        setOpenIndex(
                                                            isOpen
                                                                ? -1
                                                                : index
                                                        )
                                                    }
                                                >
                                                    <div className="explanation-title">
                                                        <div className="explanation-icon">
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faFileMedical
                                                                }
                                                            />
                                                        </div>

                                                        <div>
                                                            <span>
                                                                Explanation{" "}
                                                                {index +
                                                                    1}
                                                            </span>

                                                            <h3>
                                                                {title}
                                                            </h3>
                                                        </div>
                                                    </div>

                                                    <div className="explanation-toggle">
                                                        <FontAwesomeIcon
                                                            icon={
                                                                isOpen
                                                                    ? faChevronUp
                                                                    : faChevronDown
                                                            }
                                                        />
                                                    </div>
                                                </button>

                                                {isOpen && (
                                                    <div className="explanation-body">
                                                        {isObject &&
                                                        details.length >
                                                            0 ? (
                                                            details.map(
                                                                ([
                                                                    key,
                                                                    value
                                                                ]) => (
                                                                    <div
                                                                        className="detail-section"
                                                                        key={
                                                                            key
                                                                        }
                                                                    >
                                                                        <h4>
                                                                            {formatLabel(
                                                                                key
                                                                            )}
                                                                        </h4>

                                                                        <div className="detail-section-content">
                                                                            {renderValue(
                                                                                value
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )
                                                        ) : (
                                                            <p className="simple-explanation">
                                                                This is
                                                                one of
                                                                the
                                                                possible
                                                                explanations
                                                                identified
                                                                from the
                                                                information
                                                                provided.
                                                            </p>
                                                        )}

                                                        <div className="explanation-note">
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faCircleInfo
                                                                }
                                                            />

                                                            <span>
                                                                This
                                                                information
                                                                is for
                                                                guidance
                                                                only and
                                                                does not
                                                                confirm
                                                                that this
                                                                condition
                                                                is
                                                                present.
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        )}

                        <div className="details-safety-box">
                            <div className="details-safety-icon">
                                <FontAwesomeIcon
                                    icon={
                                        faTriangleExclamation
                                    }
                                />
                            </div>

                            <div>
                                <h4>
                                    When to seek medical help
                                </h4>

                                <p>
                                    If your symptoms become
                                    severe, suddenly worsen,
                                    or you experience an
                                    emergency warning sign,
                                    seek professional medical
                                    care immediately.
                                </p>
                            </div>
                        </div>

                        <div className="details-actions">
                            <button
                                type="button"
                                className="details-back-btn"
                                onClick={goBack}
                            >
                                <FontAwesomeIcon
                                    icon={faArrowLeftLong}
                                />

                                Back to Analysis
                            </button>

                            <div className="details-action-note">
                                <FontAwesomeIcon
                                    icon={faStethoscope}
                                />

                                <span>
                                    AI-generated information
                                    for educational purposes
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="analysis-details-sidebar">
                    <div className="details-side-card">
                        <div className="details-side-icon">
                            <FontAwesomeIcon
                                icon={faFileMedical}
                            />
                        </div>

                        <h3>
                            Understanding your results
                        </h3>

                        <p>
                            The explanations shown here
                            are possible causes that may
                            relate to the symptoms you
                            described.
                        </p>

                        <div className="details-side-point">
                            <FontAwesomeIcon
                                icon={faCircleCheck}
                            />

                            <span>
                                They are not a confirmed
                                diagnosis.
                            </span>
                        </div>

                        <div className="details-side-point">
                            <FontAwesomeIcon
                                icon={faCircleCheck}
                            />

                            <span>
                                Your symptoms and history
                                should be considered together.
                            </span>
                        </div>

                        <div className="details-side-point">
                            <FontAwesomeIcon
                                icon={faCircleCheck}
                            />

                            <span>
                                A healthcare professional can
                                provide a proper diagnosis.
                            </span>
                        </div>
                    </div>

                    <div className="details-side-warning">
                        <div className="details-side-warning-title">
                            <FontAwesomeIcon
                                icon={
                                    faTriangleExclamation
                                }
                            />

                            <h3>
                                Important
                            </h3>
                        </div>

                        <p>
                            Do not use this page as a
                            substitute for professional
                            medical advice.
                        </p>
                    </div>
                </aside>
            </main>
        </div>
    );
}

export default AnalysisDetails;