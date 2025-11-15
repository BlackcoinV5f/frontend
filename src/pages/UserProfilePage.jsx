import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import {
  FiLogOut,
  FiEdit,
  FiCheck,
  FiMail,
  FiPhone,
  FiGlobe,
  FiAward,
} from "react-icons/fi";

import "./UserProfilePage.css";

const UserProfilePage = () => {
  const { user, logoutUser, isAuthenticated, setUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  if (!user) return null;

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

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        const formData = new FormData();
        if (editedUser.first_name)
          formData.append("first_name", editedUser.first_name);
        if (editedUser.last_name)
          formData.append("last_name", editedUser.last_name);
        if (editedUser.phone) formData.append("phone", editedUser.phone);
        if (editedUser.country) formData.append("country", editedUser.country);
        if (editedUser.email) formData.append("email", editedUser.email);
        if (editedUser.birth_date)
          formData.append("birth_date", editedUser.birth_date);
        if (editedUser.avatar instanceof File)
          formData.append("avatar", editedUser.avatar);

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/user/update-profile`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );

        if (!res.ok) throw new Error("Erreur API update profil");
        const updatedUser = await res.json();
        setUser(updatedUser);
      } catch (err) {
        console.error("Erreur mise à jour profil:", err);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

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
    const completedFields = requiredFields.filter((key) => !!user?.[key]).length;
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  const displayValue = (value) => (value ? value : "—");

  // ✅ Gestion avatar dynamique avec fallback
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
      <div className="profile-header">
        <h2>Profil Utilisateur</h2>
      </div>

      <div className="profile-avatar-section">
        <div className="avatar-container">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="Photo de profil"
              className="profile-picture"
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <div
              className="avatar-initial"
              style={{
                backgroundColor: avatarColor,
              }}
            >
              {getInitial(user.first_name || user.username)}
            </div>
          )}

          <div
            className={`status-badge ${
              user.is_verified ? "verified" : "pending"
            }`}
          >
            {user.is_verified ? "Vérifié" : "En attente"}
          </div>
        </div>

        <div className="user-names">
          <h3>
            {displayValue(user.first_name)} {displayValue(user.last_name)}
          </h3>
          <p>@{displayValue(user.username)}</p>
        </div>
      </div>

      <div className="completion-section">
        <div className="completion-header">
          <span>Complétion du profil</span>
          <span>{completionPercentage()}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${completionPercentage()}%` }}
          ></div>
        </div>
      </div>

      <div className="profile-details">
        <h4>Informations Personnelles</h4>

        <div className="detail-row">
          <div className="detail-icon">
            <FiMail />
          </div>
          <div className="detail-content">
            <label>Email</label>
            {isEditing ? (
              <input
                type="email"
                value={editedUser.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            ) : (
              <p>{displayValue(user.email)}</p>
            )}
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-icon">
            <FiPhone />
          </div>
          <div className="detail-content">
            <label>Téléphone</label>
            {isEditing ? (
              <input
                type="tel"
                value={editedUser.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            ) : (
              <p>{displayValue(user.phone)}</p>
            )}
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-icon">
            <FiGlobe />
          </div>
          <div className="detail-content">
            <label>Pays</label>
            {isEditing ? (
              <input
                type="text"
                value={editedUser.country || ""}
                onChange={(e) => handleInputChange("country", e.target.value)}
              />
            ) : (
              <p>{displayValue(user.country)}</p>
            )}
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-icon">
            <FiAward />
          </div>
          <div className="detail-content">
            <label>Tâches d'initiation</label>
            <p>{user.has_completed_welcome_tasks ? "Complétées" : "En cours"}</p>
          </div>
        </div>
      </div>

      {!isProfileComplete(user) && (
        <div className="warning-message">
          ⚠️ Complétez votre profil pour accéder à toutes les fonctionnalités
        </div>
      )}

      <div className="profile-actions">
        <button
          className={`edit-button ${isEditing ? "save" : ""}`}
          onClick={handleEditToggle}
        >
          {isEditing ? <FiCheck size={16} /> : <FiEdit size={16} />}
          {isEditing ? "Sauvegarder" : "Modifier le profil"}
        </button>

        {isAuthenticated && (
          <button className="logout-button" onClick={handleLogout}>
            <FiLogOut size={16} /> Déconnexion
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
