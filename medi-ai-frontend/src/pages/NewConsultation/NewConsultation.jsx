import "./NewConsultation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong, faPlus, faShieldHalved, faCalendarDays, faChartSimple, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader.jsx";
import checkAccessForConsultationPage from "../../utils/checkAccessForConsultationPage.js";

function NewConsultation() {
    const [symptoms, setSymptoms] = useState("");
    const [symptomList, setSymptomList] = useState([]);
    const [duration, setDuration] = useState("");
    const [severity, setSeverity] = useState("");
    const [symptomsDescription, setSymptomsDescription] = useState("");
    const [loader, setLoader] = useState(false);



    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    useEffect(() => {
        if (!id) {
            setSymptomList([]);
            setDuration("");
            setSeverity("");
            setSymptomsDescription("");
            return;
        }

        const loadData = async () => {
            try {
                const data = await checkAccessForConsultationPage();
                if (data) {
                    setSymptomList(data.symptoms || []);
                    setDuration(data.duration || "");
                    setSeverity(data.severity || "");
                    setSymptomsDescription(data.description || "");
                }
            } catch (error) {
                console.error("Error loading consultation:", error);
            }
        };

        loadData();
    }, [id]);

    const addSymptoms = () => {
        setSymptomList(prev => {
            const items = symptoms
                .split(",")
                .map(item => item.trim())
                .filter(Boolean);
            setSymptoms("");
            return [
                ...new Map(
                    [...prev, ...items].map(item => [item.toLowerCase(), item])
                ).values()
            ];
        });
    };

    const removeSymptom = (symptomToRemove) => {
        setSymptomList(prev =>
            prev.filter(symptom => symptom !== symptomToRemove)
        );
    };

  const handleSubmit = async () => {
    if (symptomList.length === 0) {
        alert("Please add at least one symptom.");
        return;
    }
    if (!duration) {
        alert("Please select the duration.");
        return;
    }
    if (!severity) {
        alert("Please select the severity level.");
        return;
    }
    if (!symptomsDescription.trim()) {
        alert("Please describe your symptoms.");
        return;
    }

    const token = localStorage.getItem("access_token");
    setLoader(true);

    try {
        const url = id
            ? `http://127.0.0.1:8000/api/consultation/?id=${id}`
            : "http://127.0.0.1:8000/api/consultation/";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                symptoms: symptomList,
                duration: duration,
                severity: severity,
                description: symptomsDescription,
            }),
        });

        const data = await response.json();

        console.log("STATUS:", response.status);
        console.log("DATA:", data);

        if (response.ok) {
            window.location.href = `/new-consultation/details?id=${data.id}`;
        }
    } catch (error) {
        console.error("Request failed:", error);
    } finally {
        setLoader(false);
    }
};
    return (
        <div className="new-consultation">
            <div className="new-consultation-main">
                <div className="nc-box">
                    <div className="nc-header-box">
                        <div className="nc-header-p1">
                            <div className="nc-header-left">
                                <h2>
                                    <FontAwesomeIcon icon={faArrowLeftLong} />
                                    New Consultation
                                </h2>
                            </div>
                            <div className="nc-header-right">
                                <FontAwesomeIcon icon={faShieldHalved} />
                                <p>Secure & Private</p>
                            </div>
                        </div>
                        <p className="nc-header-p2">
                            Tell us about your symptoms. The more details you provide, the
                            better we can assist.
                        </p>
                    </div>
                    <div className="consultation-steps">
                        <div className="step active">
                            <div className="step-number">1</div>
                            <span>Symptoms</span>
                        </div>
                        <div className="step-line"></div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <span>Details</span>
                        </div>
                        <div className="step-line"></div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <span>Review</span>
                        </div>
                        <div className="step-line"></div>
                        <div className="step">
                            <div className="step-number">4</div>
                            <span>AI Analysis</span>
                        </div>
                    </div>
                    <div className="consultation-main">
                        <div className="main-symptoms">
                            <label
                                className="c-input-lable"
                                htmlFor="symptoms"
                            >
                                What are your main symptoms?
                            </label>
                            <span>You can add multiple symptoms</span>
                            <div className="add-symptoms">
                                <div className="add-symptoms-input-box">
                                    <input
                                        placeholder="e.g. Headache, Fever, Cough"
                                        type="text"
                                        className="c-input"
                                        id="symptoms"
                                        value={symptoms}
                                        onChange={(e) => setSymptoms(e.target.value)}
                                    />
                                    <button type="button" className="add-symptom-btn" onClick={addSymptoms}>
                                        <FontAwesomeIcon icon={faPlus} />
                                        Add Symptom
                                    </button>
                                </div>
                                <div className="added-symptoms">
                                    {symptomList.map((symptom) => (
                                        <div className="added-symptom" key={symptom}>
                                            <span>{symptom}</span>
                                            <FontAwesomeIcon icon={faXmark} onClick={() => removeSymptom(symptom)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="consultation-other-inputs">
                                <div className="other-input">
                                    <label
                                        htmlFor="duration-input"
                                        className="c-input-lable"
                                    >
                                        How long have you been experiencing this?
                                    </label>
                                    <div className="select-box">
                                        <FontAwesomeIcon icon={faCalendarDays} />
                                        <select
                                            id="duration-input"
                                            className="c-input"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                        >
                                            <option value="">
                                                Select duration
                                            </option>
                                            <option value="less_than_1_day">
                                                Less than 1 day
                                            </option>
                                            <option value="1_3_days">
                                                1–3 days
                                            </option>
                                            <option value="4_7_days">
                                                4–7 days
                                            </option>
                                            <option value="1_2_weeks">
                                                1–2 weeks
                                            </option>
                                            <option value="more_than_2_weeks">
                                                More than 2 weeks
                                            </option>
                                            <option value="months">
                                                Several months
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="other-input">
                                    <label
                                        htmlFor="severity-input"
                                        className="c-input-lable"
                                    >
                                        How severe are your symptoms?
                                    </label>
                                    <div className="select-box">
                                        <FontAwesomeIcon icon={faChartSimple} />
                                        <select
                                            id="severity-input"
                                            className="c-input"
                                            value={severity}
                                            onChange={(e) => setSeverity(e.target.value)}
                                        >
                                            <option value="">
                                                Select severity level
                                            </option>
                                            <option value="very_mild">
                                                Very Mild
                                            </option>
                                            <option value="mild">
                                                Mild
                                            </option>
                                            <option value="moderate">
                                                Moderate
                                            </option>
                                            <option value="severe">
                                                Severe
                                            </option>
                                            <option value="very_severe">
                                                Very Severe
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="description-input-box">
                                <label
                                    htmlFor="symptom-description"
                                    className="c-input-lable"
                                >
                                    Please describe your symptoms in detail
                                </label>
                                <span>
                                    Include when it started, how it feels, and anything else
                                    you think is important.
                                </span>
                                <textarea
                                    id="symptom-description"
                                    className="symptom-description"
                                    maxLength="1000"
                                    placeholder="Describe your symptoms, when they started, what makes them better or worse, etc."
                                    value={symptomsDescription}
                                    onChange={(e) => setSymptomsDescription(e.target.value)}
                                ></textarea>
                                <div
                                    className="character-count"
                                    style={{
                                        color:
                                            symptomsDescription.length >= 1000
                                                ? "#dc2626"
                                                : symptomsDescription.length >= 800
                                                    ? "#d97706"
                                                    : ""
                                    }}
                                >
                                    {symptomsDescription.length} / 1000 characters
                                </div>
                            </div>
                            <div className="important-notice">
                                <FontAwesomeIcon icon={faShieldHalved} />
                                <p>
                                    <strong>Important:</strong> This is not a substitute for
                                    professional medical advice, diagnosis, or treatment. If you
                                    have a medical emergency, please call your local emergency
                                    number.
                                </p>
                            </div>
                            <div className="continue-box">
                                {loader ? (
                                    <Loader />
                                ) : (
                                    <button className="continue-btn" onClick={handleSubmit}>
                                        Continue
                                        <FontAwesomeIcon icon={faArrowLeftLong} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewConsultation;