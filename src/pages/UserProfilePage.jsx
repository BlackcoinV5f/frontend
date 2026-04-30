import React, { useMemo } from "react";
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
  // ✅ namespace correct
  const { t } = useTranslation("profil");

  const { user, logoutUser, isAuthenticated } = useUser();
  const navigate = useNavigate();

  // ✅ UX améliorée
  if (!user) {
    return <div className="loader">{t("userProfile.loading", "Chargement...")}</div>;
  }

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

  const isProfileComplete = (data) => {
    return requiredFields.every((key) => !!data?.[key]);
  };

  // ✅ optimisé (memo)
  const completion = useMemo(() => {
    const done = requiredFields.filter((key) => !!user?.[key]).length;
    return Math.round((done / requiredFields.length) * 100);
  }, [user]);

  // ✅ fallback traduit
  const displayValue = (value) =>
    value || t("userProfile.notSpecified", "—");

  const avatarSrc =
    user?.avatar_url && user.avatar_url.trim() !== ""
      ? user.avatar_url
      : null;

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
          <span>{completion}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${completion}%` }}
          ></div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="profile-details">
        <h4>{t("userProfile.personalInfo")}</h4>

        <div className="detail-row">
          <FiMail />
          <div>
            <label>{t("userProfile.email")}</label>
            <p>{displayValue(user.email)}</p>
          </div>
        </div>

        <div className="detail-row">
          <FiPhone />
          <div>
            <label>{t("userProfile.phone")}</label>
            <p>{displayValue(user.phone)}</p>
          </div>
        </div>

        <div className="detail-row">
          <FiGlobe />
          <div>
            <label>{t("userProfile.country")}</label>
            <p>{displayValue(user.country)}</p>
          </div>
        </div>

        <div className="detail-row">
          <FiAward />
          <div>
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
            {t("userProfile.actions.verifyKyc")}
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