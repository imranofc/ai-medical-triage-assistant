import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeftLong,
    faShieldHalved,
    faTriangleExclamation,
    faCircleCheck,
    faCircleInfo,
    faStethoscope,
    faChevronDown,
    faChevronUp
} from "@fortawesome/free-solid-svg-icons";
import DashboardNavbar from "../../components/DashboardNavbar/DashboardNavbar.jsx";
import "./WarningDetails.css";

function WarningDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const consultationId = urlParams.get("id");

    const [warnings, setWarnings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [openIndex, setOpenIndex] = useState(0);

    const extractAnalysis = (data) => {
        if (!data) {
            return null;
        }

        if (
            data?.data?.response &&
            typeof data.data.response === "object"
        ) {
            return data.data.response;
        }

        if (
            data?.response &&
            typeof data.response === "object"
        ) {
            return data.response;
        }

        if (
            data?.analysis &&
            typeof data.analysis === "object"
        ) {
            return data.analysis;
        }

        if (
            data?.data &&
            typeof data.data === "object" &&
            !Array.isArray(data.data)
        ) {
            if (
                data.data.warning_signs ||
                data.data.possible_explanations ||
                data.data.self_care ||
                data.data.triage
            ) {
                return data.data;
            }
        }

        if (
            data.warning_signs ||
            data.possible_explanations ||
            data.self_care ||
            data.triage
        ) {
            return data;
        }

        return null;
    };

    const normalizeWarnings = (warningData) => {
        if (!warningData) {
            return [];
        }

        if (Array.isArray(warningData)) {
            return warningData;
        }

        if (Array.isArray(warningData.items)) {
            return warningData.items;
        }

        if (Array.isArray(warningData.signs)) {
            return warningData.signs;
        }

        if (Array.isArray(warningData.warnings)) {
            return warningData.warnings;
        }

        if (typeof warningData === "string") {
            return [warningData];
        }

        if (typeof warningData === "object") {
            return [warningData];
        }

        return [];
    };

    useEffect(() => {
        const loadWarnings = async () => {
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

                let data = {};

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
                        data?.detail ||
                        data?.error ||
                        "Failed to load warning signs."
                    );
                }

                console.log("Warning API Response:", data);

                const analysisData = extractAnalysis(data);

                if (!analysisData) {
                    throw new Error(
                        "Analysis data is empty."
                    );
                }

                const warningData =
                    analysisData.warning_signs;

                const normalizedWarnings =
                    normalizeWarnings(warningData);

                setWarnings(normalizedWarnings);
            } catch (err) {
                console.error(
                    "Warning Details Error:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to load warning signs."
                );
            } finally {
                setLoading(false);
            }
        };

        loadWarnings();
    }, [consultationId]);

    const formatLabel = (key) => {
        return String(key)
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    const renderValue = (value) => {
        if (Array.isArray(value)) {
            return (
                <ul className="warning-value-list">
                    {value.map((item, index) => (
                        <li key={index}>
                            {typeof item === "object" &&
                            item !== null ? (
                                <div className="warning-object-list">
                                    {Object.entries(item).map(
                                        ([key, nestedValue]) => (
                                            <div
                                                className="warning-nested-item"
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
                <div className="warning-nested-object">
                    {Object.entries(value).map(
                        ([key, nestedValue]) => (
                            <div
                                className="warning-nested-item"
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

        return String(value);
    };

    const getWarningTitle = (item, index) => {
        if (
            item !== null &&
            typeof item === "object"
        ) {
            return (
                item.name ||
                item.title ||
                item.warning ||
                item.sign ||
                item.symptom ||
                `Warning Sign ${index + 1}`
            );
        }

        return String(item);
    };

    const getWarningDetails = (item) => {
        if (
            item === null ||
            typeof item !== "object"
        ) {
            return [];
        }

        return Object.entries(item).filter(
            ([key]) =>
                ![
                    "name",
                    "title",
                    "warning",
                    "sign",
                    "symptom"
                ].includes(key)
        );
    };

    if (loading) {
        return (
            <div className="warning-details-page">
                <DashboardNavbar />

                <main className="warning-details-main">
                    <div className="warning-details-content">
                        <div className="warning-main-card">
                            <div className="warning-loading">
                                <div className="warning-loader"></div>

                                <h3>
                                    Loading warning signs...
                                </h3>

                                <p>
                                    Please wait while we
                                    prepare the details.
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
            <div className="warning-details-page">
                <DashboardNavbar />

                <main className="warning-details-main">
                    <div className="warning-details-content">
                        <div className="warning-main-card">
                            <div className="warning-error">
                                <div className="warning-error-icon">
                                    <FontAwesomeIcon
                                        icon={
                                            faTriangleExclamation
                                        }
                                    />
                                </div>

                                <h3>
                                    Unable to load warning signs
                                </h3>

                                <p>
                                    {error}
                                </p>

                                <button
                                    className="warning-back-btn"
                                    onClick={() =>
                                        window.history.back()
                                    }
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
        <div className="warning-details-page">
            <DashboardNavbar />

            <main className="warning-details-main">
                <div className="warning-details-content">
                    <div className="warning-main-card">
                        <div className="warning-header">
                            <div className="warning-title-box">
                                <button
                                    className="warning-title-back"
                                    onClick={() =>
                                        window.history.back()
                                    }
                                >
                                    <FontAwesomeIcon
                                        icon={
                                            faArrowLeftLong
                                        }
                                    />
                                </button>

                                <div>
                                    <h2>
                                        Warning Signs
                                    </h2>

                                    <p>
                                        Important symptoms and
                                        changes that may require
                                        medical attention.
                                    </p>
                                </div>
                            </div>

                            <div className="warning-secure">
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

                        <div className="warning-summary">
                            <div className="warning-summary-icon">
                                <FontAwesomeIcon
                                    icon={
                                        faTriangleExclamation
                                    }
                                />
                            </div>

                            <div>
                                <h3>
                                    Warning signs to watch for
                                </h3>

                                <p>
                                    These are symptoms or changes
                                    that may indicate that you
                                    should seek additional medical
                                    attention.
                                </p>
                            </div>
                        </div>

                        <div className="warning-heading">
                            <div>
                                <span>
                                    AI Analysis
                                </span>

                                <h3>
                                    Signs that may need attention
                                </h3>
                            </div>

                            <div className="warning-count">
                                {warnings.length}{" "}
                                {warnings.length === 1
                                    ? "warning"
                                    : "warnings"}
                            </div>
                        </div>

                        {warnings.length === 0 ? (
                            <div className="warning-empty">
                                <div className="warning-empty-icon">
                                    <FontAwesomeIcon
                                        icon={
                                            faCircleInfo
                                        }
                                    />
                                </div>

                                <h3>
                                    No warning signs available
                                </h3>

                                <p>
                                    No specific warning signs
                                    were included in this
                                    analysis.
                                </p>
                            </div>
                        ) : (
                            <div className="warning-list">
                                {warnings.map(
                                    (item, index) => {
                                        const isOpen =
                                            openIndex ===
                                            index;

                                        const title =
                                            getWarningTitle(
                                                item,
                                                index
                                            );

                                        const details =
                                            getWarningDetails(
                                                item
                                            );

                                        return (
                                            <div
                                                className={`warning-card ${
                                                    isOpen
                                                        ? "open"
                                                        : ""
                                                }`}
                                                key={index}
                                            >
                                                <button
                                                    className="warning-card-header"
                                                    onClick={() =>
                                                        setOpenIndex(
                                                            isOpen
                                                                ? -1
                                                                : index
                                                        )
                                                    }
                                                >
                                                    <div className="warning-card-title">
                                                        <div className="warning-item-icon">
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faTriangleExclamation
                                                                }
                                                            />
                                                        </div>

                                                        <div>
                                                            <span>
                                                                Warning
                                                                sign{" "}
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

                                                    <div className="warning-toggle">
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
                                                    <div className="warning-card-body">
                                                        {details.length >
                                                        0 ? (
                                                            details.map(
                                                                ([
                                                                    key,
                                                                    value
                                                                ]) => (
                                                                    <div
                                                                        className="warning-section"
                                                                        key={
                                                                            key
                                                                        }
                                                                    >
                                                                        <h4>
                                                                            {formatLabel(
                                                                                key
                                                                            )}
                                                                        </h4>

                                                                        <div className="warning-section-content">
                                                                            {renderValue(
                                                                                value
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )
                                                        ) : (
                                                            <p className="warning-simple-text">
                                                                {
                                                                    title
                                                                }
                                                            </p>
                                                        )}

                                                        <div className="warning-note">
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faCircleInfo
                                                                }
                                                            />

                                                            <span>
                                                                This
                                                                warning
                                                                sign does
                                                                not
                                                                automatically
                                                                mean that
                                                                you have a
                                                                serious
                                                                condition.
                                                                It indicates
                                                                when
                                                                additional
                                                                medical
                                                                attention
                                                                may be
                                                                appropriate.
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

                        <div className="warning-emergency-box">
                            <div className="warning-emergency-icon">
                                <FontAwesomeIcon
                                    icon={
                                        faTriangleExclamation
                                    }
                                />
                            </div>

                            <div>
                                <h4>
                                    Emergency symptoms
                                </h4>

                                <p>
                                    If you experience severe
                                    difficulty breathing,
                                    severe chest pain, sudden
                                    confusion, unconsciousness,
                                    severe bleeding, or another
                                    medical emergency, seek
                                    immediate medical care.
                                </p>
                            </div>
                        </div>

                        <div className="warning-actions">
                            <button
                                className="warning-back-btn"
                                onClick={() =>
                                    window.history.back()
                                }
                            >
                                <FontAwesomeIcon
                                    icon={
                                        faArrowLeftLong
                                    }
                                />
                                Back to Analysis
                            </button>

                            <div className="warning-action-note">
                                <FontAwesomeIcon
                                    icon={
                                        faStethoscope
                                    }
                                />

                                <span>
                                    AI-generated information
                                    for educational purposes
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="warning-sidebar">
                    <div className="warning-side-card">
                        <div className="warning-side-icon">
                            <FontAwesomeIcon
                                icon={
                                    faTriangleExclamation
                                }
                            />
                        </div>

                        <h3>
                            When should you seek help?
                        </h3>

                        <p>
                            Pay attention to symptoms that
                            are severe, persistent, sudden,
                            or getting worse.
                        </p>

                        <div className="warning-side-point">
                            <FontAwesomeIcon
                                icon={
                                    faCircleCheck
                                }
                            />

                            <span>
                                Monitor changes in your
                                symptoms.
                            </span>
                        </div>

                        <div className="warning-side-point">
                            <FontAwesomeIcon
                                icon={
                                    faCircleCheck
                                }
                            />

                            <span>
                                Do not ignore severe or
                                rapidly worsening symptoms.
                            </span>
                        </div>

                        <div className="warning-side-point">
                            <FontAwesomeIcon
                                icon={
                                    faCircleCheck
                                }
                            />

                            <span>
                                Contact a healthcare
                                professional when needed.
                            </span>
                        </div>
                    </div>

                    <div className="warning-side-emergency">
                        <div className="warning-side-emergency-title">
                            <FontAwesomeIcon
                                icon={
                                    faTriangleExclamation
                                }
                            />

                            <h3>
                                Emergency
                            </h3>
                        </div>

                        <p>
                            For a medical emergency, do not
                            wait for AI guidance. Seek
                            immediate professional care.
                        </p>
                    </div>
                </aside>
            </main>
        </div>
    );
}

export default WarningDetails;