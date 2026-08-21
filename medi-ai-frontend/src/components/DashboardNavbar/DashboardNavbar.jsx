import "./DashboardNavbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong, faArrowRightFromBracket, faBookmark, faDoorOpen, faGear, faHistory, faHome, faHomeAlt, faHomeLg, faHouse, faPerson, faPersonFalling, faPlusSquare, faQuestion, faQuestionCircle, faSave, faShieldHalved, faTachometerAlt, faUser, } from "@fortawesome/free-solid-svg-icons";

function DashboardNavbar() {
    return (
        <div className="dashboard-navbar">
            <div className="dn-box">
                <button className="dn-btn dn-btn-active"><FontAwesomeIcon icon={faPlusSquare}/>New Consultation</button>
                <button className="dn-btn"><FontAwesomeIcon icon={faHouse}/>Dashboard</button>
                <button className="dn-btn"><FontAwesomeIcon icon={faHistory}/>History</button>
                <button className="dn-btn"><FontAwesomeIcon icon={faBookmark}/>Saved Reports</button>
                <button className="dn-btn"><FontAwesomeIcon icon={faUser}/>Profile</button>
                <button className="dn-btn"><FontAwesomeIcon icon={faGear}/>Settings </button>
                <button className="dn-btn"><FontAwesomeIcon icon={faQuestionCircle}/>Help & Support</button>
                <hr />
                <button className="dn-btn"><FontAwesomeIcon icon={faArrowRightFromBracket}/>Logout</button>
            </div>
        </div>
    )
}

export default DashboardNavbar;