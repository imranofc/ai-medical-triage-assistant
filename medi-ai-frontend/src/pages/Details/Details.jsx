import checkAccessForDetailPage from "../../utils/checkAccessForDetailPage";
import "./Details.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong, faCalendarDays, faChevronDown, faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader";

function Details() {
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [medicalConditions, setMedicalConditions] = useState("");
    const [smoking, setSmoking] = useState("");
    const [alcohol, setAlcohol] = useState("");
    const [diet, setDiet] = useState("");
    const [exercise, setExercise] = useState("");
    const [allergies, setAllergies] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const urlParams = new URLSearchParams(window.location.search);
    const consultation = urlParams.get("id");

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await checkAccessForDetailPage();
                if (data) {
                    setAge(data.age != null ? String(data.age) : "");
                    setGender(
                        data.gender?.toLowerCase() === "male"
                            ? "male"
                            : data.gender?.toLowerCase() === "female"
                                ? "female"
                                : data.gender?.toLowerCase() === "other"
                                    ? "other"
                                    : ""
                    );
                    setHeight(data.height != null ? String(data.height) : "");
                    setWeight(data.weight != null ? String(data.weight) : "");
                    setMedicalConditions(data.medical_conditions || "");
                    setSmoking(data.smoke?.toLowerCase() || "");
                    setAlcohol(data.drink_alcohol?.toLowerCase() || "");
                    setDiet(
                        data.diet?.toLowerCase() === "balanced"
                            ? "balanced"
                            : data.diet?.toLowerCase() === "healthy"
                                ? "healthy"
                                : data.diet?.toLowerCase() === "needs improvement"
                                    ? "poor"
                                    : ""
                    );
                    setExercise(
                        data.exercise?.toLowerCase() === "never"
                            ? "never"
                            : data.exercise?.toLowerCase() === "occasionally"
                                ? "occasionally"
                                : data.exercise?.toLowerCase() === "regularly"
                                    ? "regularly"
                                    : data.exercise?.toLowerCase() === "daily"
                                        ? "daily"
                                        : ""
                    );
                    setAllergies(data.allergies || "");
                }
            } catch (err) {
                console.error("Error loading details:", err);
                setError("Failed to load details.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!age || !gender || !height || !weight || !smoking || !alcohol || !diet || !exercise) {
            setError("Please fill all required fields.");
            return;
        }
        if (Number(age) < 1 || Number(age) > 120) {
            setError("Please enter a valid age.");
            return;
        }
        if (Number(height) <= 0 || Number(weight) <= 0) {
            setError("Please enter valid height and weight.");
            return;
        }
        if (!consultation) {
            setError("Consultation ID is missing.");
            return;
        }
        const data = {
            consultation: Number(consultation),
            age: Number(age),
            gender: gender === "male" ? "Male" : gender === "female" ? "Female" : "Other",
            height: Number(height),
            weight: Number(weight),
            medical_conditions: medicalConditions || "None",
            smoke: smoking,
            drink_alcohol: alcohol,
            diet: diet === "balanced" ? "Balanced" : diet === "healthy" ? "Healthy" : "Needs improvement",
            exercise: exercise === "never" ? "Never" : exercise === "occasionally" ? "Occasionally" : exercise === "regularly" ? "Regularly" : "Daily",
            allergies: allergies || "None"
        };
        try {
            setLoading(true);
            const token = localStorage.getItem("access_token");
            const response = await fetch("http://127.0.0.1:8000/api/petientdetail/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` })
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) {
                setError(result.detail || "Something went wrong.");
                return;
            }
            if (response.ok) {
                window.location.href = `/new-consultation/review?id=${result.id}`;
            }
        } catch (error) {
            setError("Unable to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="details-page">
            {loading && <Loader />}
            <div className="details-main">
                <div className="details-box">
                    <div className="details-header">
                        <div>
                            <h2>
                                <FontAwesomeIcon icon={faArrowLeftLong} />
                                New Consultation
                            </h2>
                            <p>
                                Almost there! Just a few more details.
                            </p>
                        </div>
                        <div className="secure-badge">
                            <FontAwesomeIcon icon={faShieldHalved} />
                            Secure & Private
                        </div>
                    </div>
                    <div className="consultation-steps">
                        <div className="detail-step completed">
                            <div className="step-number">1</div>
                            <span>Symptoms</span>
                        </div>
                        <div className="detail-step-line active-line"></div>
                        <div className="detail-step active">
                            <div className="step-number">2</div>
                            <span>Details</span>
                        </div>
                        <div className="detail-step-line"></div>
                        <div className="detail-step">
                            <div className="step-number">3</div>
                            <span>Review</span>
                        </div>
                        <div className="detail-step-line"></div>
                        <div className="detail-step">
                            <div className="step-number">4</div>
                            <span>AI Analysis</span>
                        </div>
                    </div>
                    <form className="details-form" onSubmit={handleSubmit}>
                        <div className="form-heading">
                            <h3>Tell us more about yourself</h3>
                            <p>
                                This information helps us provide more accurate insights.
                            </p>
                        </div>
                        {error && <p className="form-error">{error}</p>}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Age</label>
                                <div className="input-icon-box">
                                    <input
                                        type="number"
                                        placeholder="e.g. 28"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                    />
                                    <FontAwesomeIcon icon={faCalendarDays} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <div className="select-wrapper">
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer_not_to_say">
                                            Prefer not to say
                                        </option>
                                    </select>
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Height</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 170 cm"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Weight</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 65 kg"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <label>Medical Conditions (if any)</label>
                            <input
                                type="text"
                                placeholder="e.g. Diabetes, Hypertension, Asthma"
                                value={medicalConditions}
                                onChange={(e) => setMedicalConditions(e.target.value)}
                            />
                        </div>
                        <div className="lifestyle-heading">
                            <h3>Lifestyle Information</h3>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Do you smoke?</label>
                                <div className="select-wrapper">
                                    <select
                                        value={smoking}
                                        onChange={(e) => setSmoking(e.target.value)}
                                    >
                                        <option value="">Select an option</option>
                                        <option value="never">Never</option>
                                        <option value="occasionally">Occasionally</option>
                                        <option value="regularly">Regularly</option>
                                    </select>
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Do you drink alcohol?</label>
                                <div className="select-wrapper">
                                    <select
                                        value={alcohol}
                                        onChange={(e) => setAlcohol(e.target.value)}
                                    >
                                        <option value="">Select an option</option>
                                        <option value="never">Never</option>
                                        <option value="occasionally">Occasionally</option>
                                        <option value="regularly">Regularly</option>
                                    </select>
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>How would you describe your diet?</label>
                                <div className="select-wrapper">
                                    <select
                                        value={diet}
                                        onChange={(e) => setDiet(e.target.value)}
                                    >
                                        <option value="">Select an option</option>
                                        <option value="balanced">Balanced</option>
                                        <option value="healthy">Very healthy</option>
                                        <option value="poor">Needs improvement</option>
                                    </select>
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>How often do you exercise?</label>
                                <div className="select-wrapper">
                                    <select
                                        value={exercise}
                                        onChange={(e) => setExercise(e.target.value)}
                                    >
                                        <option value="">Select an option</option>
                                        <option value="never">Never</option>
                                        <option value="occasionally">Occasionally</option>
                                        <option value="regularly">Regularly</option>
                                        <option value="daily">Daily</option>
                                    </select>
                                    <FontAwesomeIcon icon={faChevronDown} />
                                </div>
                            </div>
                        </div>
                        <div className="form-group full-width">
                            <label>Any allergies?</label>
                            <input
                                type="text"
                                placeholder="e.g. Pollen, Peanuts, Penicillin"
                                value={allergies}
                                onChange={(e) => setAllergies(e.target.value)}
                            />
                        </div>
                        <div className="details-actions">
                            <button onClick={() =>
                                window.location.href =
                                `/new-consultation?id=${consultation}`
                            } type="button" className="back-btn">
                                <FontAwesomeIcon icon={faArrowLeftLong} />
                                Back
                            </button>
                            <button type="submit" className="continue-btn" disabled={loading}>
                                {loading ? "Submitting..." : "Continue"}
                                {!loading && <span>→</span>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Details;