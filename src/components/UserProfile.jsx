// src/components/UserProfile.jsx
import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import {
  FiLogOut,
  FiEdit,
  FiX,
  FiCheck,
  FiUser,
  FiMail,
  FiPhone,
  FiGlobe,
  FiAward,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "./UserProfile.css";

const UserProfile = ({ onClose }) => {
  const { user, logoutUser, isAuthenticated, setUser } = useUser(); // ⚡ setUser pour maj après update
  const [isExiting, setIsExiting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  if (!user) return null;

  const closeWithAnimation = (callback) => {
    setIsExiting(true);
    setTimeout(() => {
      callback?.();
      onClose?.();
    }, 300);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
        method: "POST",
        credentials: "include", // ✅ le cookie HttpOnly est supprimé côté backend
      });
      logoutUser(); // vide le contexte
      closeWithAnimation();
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    }
  };

  const handleClose = () => closeWithAnimation();

  const handleEditToggle = async () => {
    if (isEditing) {
      // Sauvegarde quand on clique sur "Save"
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // ✅ Auth via cookie
          body: JSON.stringify(editedUser),
        });

        if (!res.ok) throw new Error("Erreur API update profil");

        const updatedUser = await res.json();
        console.log("Profil mis à jour:", updatedUser);
        setUser(updatedUser); // ⚡️ maj du contexte UserContext
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

  const avatarSrc = user.avatar_url
    ? user.avatar_url.startsWith("http")
      ? user.avatar_url
      : `${import.meta.env.VITE_BACKEND_URL}${user.avatar_url}`
    : null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="modal-content"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ===== Header ===== */}
            <div className="profile-header">
              <h2>Profil Utilisateur</h2>
              <button className="close-btn" onClick={handleClose}>
                <FiX size={20} />
              </button>
            </div>

            {/* ===== Avatar ===== */}
            <div className="profile-avatar-section">
              <div className="avatar-container">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="Photo de profil"
                    className="profile-picture"
                  />
                ) : (
                  <div className="default-avatar">
                    <FiUser size={32} />
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

            {/* ===== Progression Profil ===== */}
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

            {/* ===== Infos Profil ===== */}
            <div className="profile-details">
              <h4>Informations Personnelles</h4>

              {/* Email */}
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
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  ) : (
                    <p>{displayValue(user.email)}</p>
                  )}
                </div>
                <div className="verification-status">
                  {user.is_verified ? (
                    <FiCheck className="verified" />
                  ) : (
                    <FiX className="not-verified" />
                  )}
                </div>
              </div>

              {/* Téléphone */}
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
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                    />
                  ) : (
                    <p>{displayValue(user.phone)}</p>
                  )}
                </div>
              </div>

              {/* Pays */}
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
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                    />
                  ) : (
                    <p>{displayValue(user.country)}</p>
                  )}
                </div>
              </div>

              {/* Tâches d'initiation */}
              <div className="detail-row">
                <div className="detail-icon">
                  <FiAward />
                </div>
                <div className="detail-content">
                  <label>Tâches d'initiation</label>
                  <p>
                    {user.has_completed_welcome_tasks
                      ? "Complétées"
                      : "En cours"}
                  </p>
                </div>
                <div className="verification-status">
                  {user.has_completed_welcome_tasks ? (
                    <FiCheck className="verified" />
                  ) : (
                    <FiX className="not-verified" />
                  )}
                </div>
              </div>
            </div>

            {!isProfileComplete(user) && (
              <div className="warning-message">
                <p>
                  ⚠️ Complétez votre profil pour accéder à toutes les
                  fonctionnalités
                </p>
              </div>
            )}

            {/* ===== Actions ===== */}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserProfile;
