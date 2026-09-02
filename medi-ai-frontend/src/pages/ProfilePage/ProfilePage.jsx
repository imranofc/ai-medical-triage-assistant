import "./ProfilePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faUser,
    faEnvelope,
    faCalendarDays,
    faPen,
    faLock,
    faEye,
    faEyeSlash,
    faRightFromBracket,
    faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth.js";
import logout from "../../utils/logout.js";
import Loader from "../../components/Loader/Loader.jsx";

function ProfilePage() {
    const navigate = useNavigate();
    const { isLoggedIn, fullName, email, setFullName, setEmail, isLoading } = useAuth();

    const [isEditing, setIsEditing] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate, isLoading]);


    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        if (!fullName.trim()) {
            setErrors({ name: "Name is required" });
            return;
        }

        if (fullName.trim().length < 2) {
            setErrors({ name: "Name must be at least 2 characters" });
            return;
        }

        if (!/^[a-zA-Z\s]+$/.test(fullName.trim())) {
            setErrors({ name: "Name can only contain letters and spaces" });
            return;
        }

        if (!email.trim()) {
            setErrors({ email: "Email is required" });
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setErrors({ email: "Enter a valid email address" });
            return;
        }

        setErrors({});

        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(
                "http://127.0.0.1:8000/api/update-profile/",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ first_name: fullName, email: email }),
                },
            );

            const data = await response.json();

            if (response.ok) {
                console.log("Profile updated successfully:", data);
                setIsEditing(false);
            } else {
                console.error("Error updating profile:", data);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (!currentPassword.trim()) {
            setErrors({ currentPassword: "Current password is required" });
            return;
        }

        if (!newPassword.trim()) {
            setErrors({ newPassword: "New password is required" });
            return;
        }

        if (newPassword.length < 8) {
            setErrors({ newPassword: "New password must be at least 8 characters" });
            return;
        }

        if (!confirmPassword.trim()) {
            setErrors({ confirmPassword: "Please confirm your new password" });
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrors({ confirmPassword: "Passwords do not match" });
            return;
        }

        setErrors({});

        try {
            const token = localStorage.getItem("access_token");

            const response = await fetch(
                "http://127.0.0.1:8000/api/update-profile/",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        password: currentPassword,
                        new_password: newPassword,
                        confirm_password: confirmPassword,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setErrors({
                    password: data.error || data.detail || "Password update failed"
                });
                return;
            }

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setErrors({});

        } catch (error) {
            setErrors({
                password: "Something went wrong. Please try again."
            });
        }
    };


    return (
        <div className="profile-page">
            {isLoading && <Loader />}
            <main className="profile-container">
                <div className="profile-page-header">
                    <div className="profile-back" onClick={() => navigate(-1)}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </div>

                    <div>
                        <h1>My Profile</h1>
                        <p>View and manage your account information.</p>
                    </div>
                </div>

                <section className="profile-card profile-overview">
                    <div className="profile-avatar">
                        {fullName.charAt(0).toUpperCase()}
                    </div>

                    <div className="profile-overview-info">
                        <h2>{fullName}</h2>

                        <div className="profile-detail">
                            <span>
                                <FontAwesomeIcon icon={faEnvelope} />
                                {email}
                            </span>

                            <span>
                                <FontAwesomeIcon icon={faCalendarDays} />
                                Member since Aug 2026
                            </span>
                        </div>
                    </div>
                </section>

                <section className="profile-card profile-section">
                    <div className="section-header">
                        <div className="section-heading">
                            <div className="section-icon">
                                <FontAwesomeIcon icon={faUser} />
                            </div>

                            <h2>Account Information</h2>
                        </div>

                        {!isEditing && (
                            <button
                                className="outline-button"
                                onClick={() => setIsEditing(true)}
                            >
                                <FontAwesomeIcon icon={faPen} />
                                Edit
                            </button>
                        )}
                    </div>

                    <div className="account-fields">
                        <div className="form-group">
                            <label htmlFor="full-name">Full Name</label>

                            <input
                                id="full-name"
                                type="text"
                                value={fullName}
                                disabled={!isEditing}
                                onChange={(e) => {
                                    setFullName(e.target.value);

                                    if (errors.name) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            name: "",
                                        }));
                                    }
                                }}
                            />

                            {errors.name && <span className="form-error">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                disabled={!isEditing}
                                onChange={(e) => {
                                    setEmail(e.target.value);

                                    if (errors.email) {
                                        setErrors((prev) => ({
                                            ...prev,
                                            email: "",
                                        }));
                                    }
                                }}
                            />

                            {errors.email && (
                                <span className="form-error">{errors.email}</span>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="edit-buttons">
                            <button
                                className="cancel-button"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>

                            <button className="save-button" onClick={handleProfileUpdate}>
                                Save Changes
                            </button>
                        </div>
                    )}
                </section>

                <section className="profile-card profile-section">
                    <div className="section-header">
                        <div className="section-heading">
                            <div className="section-icon">
                                <FontAwesomeIcon icon={faLock} />
                            </div>

                            <h2>Change Password</h2>
                        </div>

                        <button className="outline-button" onClick={handlePasswordUpdate}>
                            <FontAwesomeIcon icon={faLock} />
                            Update Password
                        </button>
                    </div>

                    <div className="password-fields">
                        <div className="form-group">
                            <label htmlFor="current-password">Current Password</label>

                            <div className="password-wrapper">
                                <input
                                    id="current-password"
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Enter current password"
                                    value={currentPassword}
                                    onChange={(event) => {
                                        setCurrentPassword(event.target.value);

                                        if (errors.currentPassword) {
                                            setErrors((prev) => ({
                                                ...prev,
                                                currentPassword: "",
                                            }));
                                        }
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    <FontAwesomeIcon
                                        icon={showCurrentPassword ? faEyeSlash : faEye}
                                    />
                                </button>
                            </div>

                            {errors.currentPassword && (
                                <span className="form-error">{errors.currentPassword}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="new-password">New Password</label>

                            <div className="password-wrapper">
                                <input
                                    id="new-password"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(event) => {
                                        setNewPassword(event.target.value);

                                        if (errors.newPassword) {
                                            setErrors((prev) => ({
                                                ...prev,
                                                newPassword: "",
                                            }));
                                        }
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    <FontAwesomeIcon
                                        icon={showNewPassword ? faEyeSlash : faEye}
                                    />
                                </button>
                            </div>

                            {errors.newPassword && (
                                <span className="form-error">{errors.newPassword}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirm New Password</label>

                            <div className="password-wrapper">
                                <input
                                    id="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(event) => {
                                        setConfirmPassword(event.target.value);

                                        if (errors.confirmPassword) {
                                            setErrors((prev) => ({
                                                ...prev,
                                                confirmPassword: "",
                                            }));
                                        }
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <FontAwesomeIcon
                                        icon={showConfirmPassword ? faEyeSlash : faEye}
                                    />
                                </button>
                            </div>

                            {errors.confirmPassword && (
                                <span className="form-error">{errors.confirmPassword}</span>
                            )}
                        </div>
                    </div>

                    <p className="password-hint">
                        Password must be at least 8 characters long.
                    </p>
                </section>

                <section className="profile-card account-actions">
                    <div className="account-action-info">
                        <div className="danger-icon">
                            <FontAwesomeIcon icon={faShieldHalved} />
                        </div>

                        <div>
                            <h2>Account Actions</h2>
                            <p>Log out from your account on this device.</p>
                        </div>
                    </div>

                    <button className="logout-button" onClick={logout}>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        Logout
                    </button>
                </section>
            </main>
        </div>
    );
}

export default ProfilePage;