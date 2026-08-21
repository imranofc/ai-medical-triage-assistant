import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faLightbulb, faWarning, } from "@fortawesome/free-solid-svg-icons";
import "./WhatHappensNext.css";

function WhatHappensNext() {
    return (
        <div className="whn-box">

            <div className="whn-content-box">

                <h4>What happens next?</h4>

                <div className="whn-step">
                    <div className="whn-step-number">1</div>

                    <div className="whn-step-content">
                        <p className="whn-step-title">
                            Our AI will analyze your symptoms
                        </p>

                        <p className="whn-step-description">
                            We'll look at possible explanations and relevant information.
                        </p>
                    </div>
                </div>

                <div className="whn-step">
                    <div className="whn-step-number">2</div>

                    <div className="whn-step-content">
                        <p className="whn-step-title">
                            You'll receive a detailed response
                        </p>

                        <p className="whn-step-description">
                            Including guidance, warning signs, and recommendations.
                        </p>
                    </div>
                </div>

                <div className="whn-step">
                    <div className="whn-step-number">3</div>

                    <div className="whn-step-content">
                        <p className="whn-step-title">
                            Follow-up questions
                        </p>

                        <p className="whn-step-description">
                            We may ask follow-up questions to better understand your condition.
                        </p>
                    </div>
                </div>

            </div>

            <div className="tips-and-seek">

                <div className="tips-box">

                    <div className="tips-heading">
                        <FontAwesomeIcon icon={faLightbulb} />
                        <h4>Tips for better results</h4>
                    </div>

                    <ul>
                        <li>
                            <FontAwesomeIcon icon={faCircleCheck} />
                            <p>Be specific about your symptoms</p>
                        </li>

                        <li>
                            <FontAwesomeIcon icon={faCircleCheck} />
                            <p>Include when they started</p>
                        </li>

                        <li>
                            <FontAwesomeIcon icon={faCircleCheck} />
                            <p>Mention any medications</p>
                        </li>

                        <li>
                            <FontAwesomeIcon icon={faCircleCheck} />
                            <p>Share relevant medical history</p>
                        </li>
                    </ul>

                </div>

                <div className="seek-box">

                    <div className="seek-heading">
                        <FontAwesomeIcon icon={faWarning} />
                        <h4>Emergency warnings</h4>
                    </div>

                    <ul>
                        <li>Severe chest pain</li>
                        <li>Difficulty breathing</li>
                        <li>Severe bleeding</li>
                        <li>Sudden confusion</li>
                        <li>Or any other emergency</li>
                    </ul>

                </div>

            </div>

        </div>
    );
}

export default WhatHappensNext;