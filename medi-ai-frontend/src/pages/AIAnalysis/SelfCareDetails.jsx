import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeftLong,
    faShieldHalved,
    faHandHoldingHeart,
    faCircleInfo,
    faStethoscope,
    faLightbulb,
    faChevronDown,
    faChevronUp
} from "@fortawesome/free-solid-svg-icons";
import "./SelfCareDetails.css";

function SelfCareDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const consultationId = urlParams.get("id");

    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [openIndex, setOpenIndex] = useState(0);

    useEffect(() => {
        const loadSelfCare = async () => {
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
                        "Failed to load self-care suggestions."
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

                const selfCare = responseData?.self_care;

                if (Array.isArray(selfCare)) {
                    setSuggestions(selfCare);
                } else if (
                    Array.isArray(selfCare?.items)
                ) {
                    setSuggestions(selfCare.items);
                } else if (selfCare) {
                    setSuggestions([selfCare]);
                } else {
                    setSuggestions([]);
                }
            } catch (err) {
                console.error(
                    "Self Care Details Error:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to load self-care suggestions."
                );
            } finally {
                setLoading(false);
            }
        };

        loadSelfCare();
    }, [consultationId]);

    const goBack = () => {
        window.location.href =
            `/new-consultation/analysis?id=${consultationId}`;
    };

    const formatLabel = (key) => {
        return String(key)
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    const renderValue = (value) => {
        if (Array.isArray(value)) {
            if (value.length === 0) {
                return "No information available.";
            }

            return (
                <ul className="self-care-value-list">
                    {value.map((item, index) => (
                        <li key={index}>
                            {typeof item === "object" &&
                                item !== null
                                ? (
                                    <div className="self-care-nested-object">
                                        {Object.entries(item).map(
                                            ([
                                                key,
                                                nestedValue
                                            ]) => (
                                                <div
                                                    className="self-care-nested-item"
                                                    key={key}
                                                >
                                                    <strong>
                                                        {formatLabel(
                                                            key
                                                        )}
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
                                )
                                : String(item)}
                        </li>
                    ))}
                </ul>
            );
        }

        if (
            value !== null &&
            typeof value === "object"
        ) {
            const entries = Object.entries(value);

            if (entries.length === 0) {
                return "No information available.";
            }

            return (
                <div className="self-care-nested-object">
                    {entries.map(
                        ([key, nestedValue]) => (
                            <div
                                className="self-care-nested-item"
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
            );
        }

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "No information available.";
        }

        return String(value);
    };

    if (loading) {
        return (
            <div className="self-care-details-page">

                <main className="self-care-details-main">
                    <div className="self-care-details-content">
                        <div className="self-care-main-card">
                            <div className="self-care-loading">
                                <div className="self-care-loader"></div>

                                <h3>
                                    Loading self-care
                                    suggestions...
                                </h3>

                                <p>
                                    Please wait while we
                                    prepare your
                                    recommendations.
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
            <div className="self-care-details-page">

                <main className="self-care-details-main">
                    <div className="self-care-details-content">
                        <div className="self-care-main-card">
                            <div className="self-care-error">
                                <div className="self-care-error-icon">
                                    <FontAwesomeIcon
                                        icon={
                                            faCircleInfo
                                        }
                                    />
                                </div>

                                <h3>
                                    Unable to load
                                    self-care suggestions
                                </h3>

                                <p>{error}</p>

                                <button
                                    type="button"
                                    className="self-care-back-btn"
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
        <div className="self-care-details-page">

            <main className="self-care-details-main">
                <div className="self-care-details-content">
                    <div className="self-care-main-card">
                        <div className="self-care-header">
                            <div className="self-care-title-box">
                                <button
                                    type="button"
                                    className="self-care-title-back"
                                    onClick={goBack}
                                >
                                    <FontAwesomeIcon
                                        icon={
                                            faArrowLeftLong
                                        }
                                    />
                                </button>

                                <div>
                                    <h2>
                                        Self-Care
                                        Suggestions
                                    </h2>

                                    <p>
                                        Practical
                                        recommendations
                                        that may help
                                        you manage your
                                        symptoms.
                                    </p>
                                </div>
                            </div>

                            <div className="self-care-secure">
                                <FontAwesomeIcon
                                    icon={
                                        faShieldHalved
                                    }
                                />

                                <span>
                                    Secure &amp; Private
                                </span>
                            </div>
                        </div>

                        <div className="self-care-info-banner">
                            <div className="self-care-info-icon">
                                <FontAwesomeIcon
                                    icon={faLightbulb}
                                />
                            </div>

                            <div>
                                <h4>
                                    Helpful steps you
                                    can consider
                                </h4>

                                <p>
                                    These suggestions
                                    are based on the
                                    information provided
                                    and are intended for
                                    general guidance.
                                </p>
                            </div>
                        </div>

                        {suggestions.length === 0 ? (
                            <div className="self-care-empty">
                                <FontAwesomeIcon
                                    icon={
                                        faHandHoldingHeart
                                    }
                                />

                                <h3>
                                    No self-care
                                    suggestions available
                                </h3>

                                <p>
                                    No specific
                                    recommendations were
                                    included in this
                                    analysis.
                                </p>
                            </div>
                        ) : (
                            <div className="self-care-list">
                                {suggestions.map(
                                    (item, index) => {
                                        const isObject =
                                            item !== null &&
                                            typeof item ===
                                            "object";

                                        const title =
                                            isObject
                                                ? item.name ||
                                                item.title ||
                                                item.action ||
                                                `Suggestion ${index +
                                                1
                                                }`
                                                : String(
                                                    item
                                                );

                                        const details =
                                            isObject
                                                ? Object.entries(
                                                    item
                                                ).filter(
                                                    ([
                                                        key
                                                    ]) =>
                                                        key !==
                                                        "name" &&
                                                        key !==
                                                        "title" &&
                                                        key !==
                                                        "action"
                                                )
                                                : [];

                                        const isOpen =
                                            openIndex ===
                                            index;

                                        return (
                                            <div
                                                className={`self-care-card ${isOpen
                                                        ? "open"
                                                        : ""
                                                    }`}
                                                key={index}
                                            >
                                                <button
                                                    type="button"
                                                    className="self-care-card-header"
                                                    onClick={() =>
                                                        setOpenIndex(
                                                            isOpen
                                                                ? -1
                                                                : index
                                                        )
                                                    }
                                                >
                                                    <div className="self-care-card-title">
                                                        <div className="self-care-item-icon">
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faHandHoldingHeart
                                                                }
                                                            />
                                                        </div>

                                                        <div>
                                                            <span>
                                                                Recommendation{" "}
                                                                {index +
                                                                    1}
                                                            </span>

                                                            <h3>
                                                                {
                                                                    title
                                                                }
                                                            </h3>
                                                        </div>
                                                    </div>

                                                    <div className="self-care-toggle">
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
                                                    <div className="self-care-card-body">
                                                        {isObject &&
                                                            details.length >
                                                            0 ? (
                                                            details.map(
                                                                ([
                                                                    key,
                                                                    value
                                                                ]) => (
                                                                    <div
                                                                        className="self-care-section"
                                                                        key={
                                                                            key
                                                                        }
                                                                    >
                                                                        <h4>
                                                                            {formatLabel(
                                                                                key
                                                                            )}
                                                                        </h4>

                                                                        <div className="self-care-section-content">
                                                                            {renderValue(
                                                                                value
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )
                                                        ) : (
                                                            <p className="self-care-simple-text">
                                                                {
                                                                    title
                                                                }
                                                            </p>
                                                        )}

                                                        <div className="self-care-note">
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faCircleInfo
                                                                }
                                                            />

                                                            <span>Self-care recommendations are general guidance and may not be suitable for everyone.
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

                        <div className="self-care-important-box">
                            <div className="self-care-important-icon">
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
                                    If your symptoms
                                    become severe,
                                    worsen unexpectedly,
                                    or you develop
                                    warning signs, seek
                                    professional medical
                                    attention instead of
                                    relying only on
                                    self-care.
                                </p>
                            </div>
                        </div>

                        <div className="self-care-actions">
                            <button
                                type="button"
                                className="self-care-back-btn"
                                onClick={goBack}
                            >
                                <FontAwesomeIcon
                                    icon={
                                        faArrowLeftLong
                                    }
                                />

                                Back to Analysis
                            </button>

                            <div className="self-care-action-note">
                                <FontAwesomeIcon
                                    icon={
                                        faStethoscope
                                    }
                                />

                                <span>
                                    AI-generated
                                    information for
                                    educational purposes
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}

export default SelfCareDetails;