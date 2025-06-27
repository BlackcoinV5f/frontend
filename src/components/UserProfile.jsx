// src/components/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { FiLogOut } from "react-icons/fi";
import { FaCheck, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./UserProfile.css";

const UserProfile = ({ onClose }) => {
  const { user, fetchUserProfile, loading, logoutUser } = useUser();
  const [profile, setProfile] = useState(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (user?.telegram_id) {
      fetchUserProfile(user.telegram_id)
        .then(setProfile)
        .catch((err) => console.error("Erreur chargement profil :", err));
    }
  }, [user]);

  const formatLabel = (key) => {
    const labels = {
      first_name: "Prénom",
      last_name: "Nom",
      username: "Nom d'utilisateur",
      email: "Email",
      email_verified: "Email vérifié",
      phone: "Téléphone",
      country: "Pays",
    };
    return labels[key] || key;
  };

  const handleLogout = () => {
    setIsExiting(true);
    setTimeout(() => {
      logoutUser();
      onClose();
    }, 500);
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 500);
  };

  const renderProfile = () => {
    if (!profile) return null;

    return (
      <>
        {profile.photo_url && (
          <motion.img
            src={profile.photo_url}
            alt="Photo de profil"
            className="profile-picture"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        )}
        <ul className="profile-info">
          {Object.entries(profile)
            .filter(([key, value]) => value !== null && value !== "" && typeof value !== "object")
            .map(([key, value], i) => (
              <motion.li
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <strong>{formatLabel(key)} :</strong>{" "}
                {key === "email_verified" ? (
                  value ? (
                    <span className="verified"><FaCheck /> Oui</span>
                  ) : (
                    <span className="not-verified"><FaTimes /> Non</span>
                  )
                ) : (
                  value
                )}
              </motion.li>
            ))}
        </ul>
      </>
    );
  };

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
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              👤 Profil utilisateur
            </motion.h2>

            {loading && (
              <motion.div
                className="loading-spinner"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            )}

            {!user && !loading && (
              <motion.div
                className="error-message"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <p>Aucune donnée utilisateur disponible.</p>
              </motion.div>
            )}

            {profile && !loading && (
              <>
                {renderProfile()}
              </>
            )}

            <div className="profile-buttons">
              <motion.button
                className="logout-button"
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiLogOut /> Déconnexion
              </motion.button>
              <motion.button
                className="close-button"
                onClick={handleClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Fermer
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserProfile;
