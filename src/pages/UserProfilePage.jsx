import React from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiMail,
  FiPhone,
  FiGlobe,
  FiAward,
  FiX,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";

import "./UserProfilePage.css";

const UserProfilePage = () => {
  const { t } = useTranslation();
  const { user, logoutUser, isAuthenticated } = useUser();
  const navigate = useNavigate();

  if (!user) return null;

  // -------------------------------
  // Déconnexion
  // -------------------------------
  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      logoutUser();
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    }
  };

  // -------------------------------
  // Helpers
  // -------------------------------
  const isProfileComplete = (data) => {
    const requiredFields = [
      "first_name",
      "last_name",
      "username",
      "email",
      "phone",
      "country",
      "avatar_url",
      "has_completed_welcome_tasks",
    ];
    return requiredFields.every((key) => !!data?.[key]);
  };

  const completionPercentage = () => {
    const required = [
      "first_name",
      "last_name",
      "username",
      "email",
      "phone",
      "country",
      "avatar_url",
      "has_completed_welcome_tasks",
    ];
    const done = required.filter((key) => !!user?.[key]).length;
    return Math.round((done / required.length) * 100);
  };

  const displayValue = (value) => (value ? value : "—");

  const avatarSrc =
    user?.avatar_url && user.avatar_url.trim() !== "" ? user.avatar_url : null;

  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || "?";

  const getColorFromName = (name) => {
    const colors = ["#4a90e2", "#e67e22", "#2ecc71", "#9b59b6", "#e74c3c"];
    let hash = 0;
    for (let i = 0; i < name?.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarColor = getColorFromName(user.first_name || user.username);

  return (
    <div className="user-profile-page">
      {/* HEADER */}
      <div className="profile-header">
        <button className="close-button" onClick={() => navigate(-1)}>
          <FiX size={20} /> {t("userProfile.header.close")}
        </button>
      </div>

      {/* AVATAR */}
      <div className="profile-avatar-section">
        <div className="avatar-container">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={t("userProfile.personalInfo")}
              className="profile-picture"
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <div
              className="avatar-initial"
              style={{ backgroundColor: avatarColor }}
            >
              {getInitial(user.first_name || user.username)}
            </div>
          )}

          <div
            className={`status-badge ${
              user.is_verified ? "verified" : "pending"
            }`}
          >
            {user.is_verified
              ? t("userProfile.status.verified")
              : t("userProfile.status.pending")}
          </div>
        </div>

        <div className="user-names">
          <h3>
            {displayValue(user.first_name)} {displayValue(user.last_name)}
          </h3>
          <p>@{displayValue(user.username)}</p>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="completion-section">
        <div className="completion-header">
          <span>{t("userProfile.profileCompletion")}</span>
          <span>{completionPercentage()}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${completionPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="profile-details">
        <h4>{t("userProfile.personalInfo")}</h4>

        <div className="detail-row">
          <div className="detail-icon">
            <FiMail />
          </div>
          <div className="detail-content">
            <label>{t("userProfile.email")}</label>
            <p>{displayValue(user.email)}</p>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-icon">
            <FiPhone />
          </div>
          <div className="detail-content">
            <label>{t("userProfile.phone")}</label>
            <p>{displayValue(user.phone)}</p>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-icon">
            <FiGlobe />
          </div>
          <div className="detail-content">
            <label>{t("userProfile.country")}</label>
            <p>{displayValue(user.country)}</p>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-icon">
            <FiAward />
          </div>
          <div className="detail-content">
            <label>{t("userProfile.welcomeTasks")}</label>
            <p>
              {user.has_completed_welcome_tasks
                ? t("userProfile.completed")
                : t("userProfile.inProgress")}
            </p>
          </div>
        </div>
      </div>

      {/* WARNING */}
      {!isProfileComplete(user) && (
        <div className="warning-message">
          {t("userProfile.warningIncomplete")}
        </div>
      )}

      {/* ACTIONS */}
      <div className="profile-actions">
        {!user.is_verified && (
          <button className="kyc-button" onClick={() => navigate("/kyc")}>
            {t("userProfile.actions.verifyKYC")}
          </button>
        )}

        {isAuthenticated && (
          <button className="logout-button" onClick={handleLogout}>
            <FiLogOut size={16} /> {t("userProfile.actions.logout")}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;