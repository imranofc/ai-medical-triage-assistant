import checkAccessForReviewPage from "../../utils/checkAccessForReviewPage.js";
import DashboardNavbar from "../../components/DashboardNavbar/DashboardNavbar.jsx";
import WhatHappensNext from "../../components/WhatHappensNext/WhatHappensNext.jsx";
import "./Review.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeftLong,
    faCalendarDays,
    faUser,
    faRuler,
    faWeightScale,
    faHeartPulse,
    faSmoking,
    faWineGlass,
    faBowlFood,
    faDumbbell,
    faTriangleExclamation,
    faShieldHalved,
    faCheck,
    faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

function Review() {
    const [patientDetail, setPatientDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const data = await checkAccessForReviewPage();

            if (data) {
                setPatientDetail(data);
            }

            setLoading(false);
        };

        loadData();
    }, []);

    const urlParams = new URLSearchParams(window.location.search);
    const patientDetailId = urlParams.get("id");

    const formatValue = (value) => {
        if (!value) {
            return "Not provided";
        }

        return String(value)
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    if (loading) {
        return (
            <div className="review-page">
                <DashboardNavbar />
                <div className="review-loading">
                    Loading your information...
                </div>
            </div>
        );
    }

    if (!patientDetail) {
        return null;
    }

    return (
        <div className="review-page">
            <DashboardNavbar />
            <div className="review-main">
                <div className="review-box">
                    <div className="review-header">
                        <div>
                            <h2>
                                <FontAwesomeIcon
                                    icon={faArrowLeftLong}
                                    onClick={() => window.history.back()}
                                />
                                Review Your Information
                            </h2>
                            <p>
                                Please review your details before we analyze your symptoms.
                            </p>
                        </div>
                        <div className="review-secure">
                            <FontAwesomeIcon icon={faShieldHalved} />
                            <p>Secure & Private</p>
                        </div>
                    </div>
                    <div className="review-steps">
                        <div className="review-step completed">
                            <div className="review-step-number">
                                <FontAwesomeIcon icon={faCheck} />
                            </div>
                            <span>Symptoms</span>
                        </div>
                        <div className="review-step-line completed-line"></div>
                        <div className="review-step completed">
                            <div className="review-step-number">
                                <FontAwesomeIcon icon={faCheck} />
                            </div>
                            <span>Details</span>
                        </div>
                        <div className="review-step-line active-line"></div>
                        <div className="review-step active">
                            <div className="review-step-number">3</div>
                            <span>Review</span>
                        </div>
                        <div className="review-step-line"></div>
                        <div className="review-step">
                            <div className="review-step-number">4</div>
                            <span>AI Analysis</span>
                        </div>
                    </div>
                    <div className="review-content">
                        <div className="review-section">
                            <div className="review-section-heading">
                                <div className="review-section-icon">
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                                <h3>Personal Information</h3>
                            </div>
                            <div className="review-info-grid">
                                <div className="review-info-item">
                                    <FontAwesomeIcon icon={faCalendarDays} />
                                    <div>
                                        <span>Age</span>
                                        <strong>
                                            {patientDetail.age || "Not provided"}
                                        </strong>
                                    </div>
                                </div>
                                <div className="review-info-item">
                                    <FontAwesomeIcon icon={faRuler} />
                                    <div>
                                        <span>Height</span>
                                        <strong>
                                            {patientDetail.height
                                                ? `${patientDetail.height} cm`
                                                : "Not provided"}
                                        </strong>
                                    </div>
                                </div>
                                <div className="review-info-item">
                                    <FontAwesomeIcon icon={faUser} />
                                    <div>
                                        <span>Gender</span>
                                        <strong>
                                            {formatValue(patientDetail.gender)}
                                        </strong>
                                    </div>
                                </div>
                                <div className="review-info-item">
                                    <FontAwesomeIcon icon={faWeightScale} />
                                    <div>
                                        <span>Weight</span>
                                        <strong>
                                            {patientDetail.weight
                                                ? `${patientDetail.weight} kg`
                                                : "Not provided"}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                            <div className="review-medical-condition">
                                <FontAwesomeIcon icon={faHeartPulse} />
                                <div>
                                    <span>Medical Conditions</span>
                                    <strong>
                                        {patientDetail.medical_conditions || "None"}
                                    </strong>
                                </div>
                            </div>
                        </div>
                        <div className="review-section">
                            <div className="review-section-heading">
                                <div className="review-section-icon">
                                    <FontAwesomeIcon icon={faHeartPulse} />
                                </div>
                                <h3>Lifestyle Information</h3>
                            </div>
                            <div className="review-info-grid">
                                <div className="review-info-item">
                                    <FontAwesomeIcon icon={faSmoking} />
                                    <div>
                                        <span>Do you smoke?</span>
                                        <strong>
                                            {formatValue(patientDetail.smoke)}
                                        </strong>
                                    </div>
                                </div>
                                <div className="review-info-item">
                                    <FontAwesomeIcon icon={faWineGlass} />
                                    <div>
                                        <span>Do you drink alcohol?</span>
                                        <strong>
                                            {formatValue(patientDetail.drink_alcohol)}
                                        </strong>
                                    </div>
                                </div>
                                <div className="review-info-item">
                                    <FontAwesomeIcon icon={faBowlFood} />
                                    <div>
                                        <span>Diet</span>
                                        <strong>
                                            {formatValue(patientDetail.diet)}
                                        </strong>
                                    </div>
                                </div>
                                <div className="review-info-item">
                                    <FontAwesomeIcon icon={faDumbbell} />
                                    <div>
                                        <span>Exercise</span>
                                        <strong>
                                            {formatValue(patientDetail.exercise)}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                            <div className="review-medical-condition">
                                <FontAwesomeIcon icon={faTriangleExclamation} />
                                <div>
                                    <span>Allergies</span>
                                    <strong>
                                        {patientDetail.allergies || "None"}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="review-notice">
                        <FontAwesomeIcon icon={faShieldHalved} />
                        <p>
                            <strong>Important:</strong> Please ensure all
                            information is correct. This helps our AI provide
                            more accurate insights and recommendations.
                        </p>
                    </div>
                    <div className="review-actions">
                        <button
                            className="review-back-btn"
                            onClick={() => window.history.back()}
                        >
                            <FontAwesomeIcon icon={faArrowLeftLong} />
                            Back to Details
                        </button>
                        <button
                            className="review-confirm-btn"
                            onClick={() =>
                                window.location.href =
                                `/new-consultation/analysis?id=${patientDetail.consultation}`
                            }
                        >
                            Confirm & Analyze
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                </div>
                <WhatHappensNext />
            </div>
        </div>
    );
}

export default Review;