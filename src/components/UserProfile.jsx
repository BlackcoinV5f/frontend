import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { useUser } from "../contexts/UserContext";
import { FiLogOut } from "react-icons/fi";
import { FaCoins, FaLevelUpAlt, FaUserAlt, FaFlag, FaCheck, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const UserProfile = ({ onClose }) => {
  const {
    user,
    wallet,
    level,
    ranking,
    status,
    loading,
    fetchWallet,
    fetchLevel,
    fetchRanking,
    fetchStatus,
    logoutUser,
  } = useUser();

  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (user?.telegram_id) {
      fetchWallet(user.telegram_id);
      fetchLevel(user.telegram_id);
      fetchRanking();
      fetchStatus(user.telegram_id);
    }
  }, [user]);

  const formatLabel = (key) => {
    const labels = {
      first_name: "Prénom",
      firstName: "Prénom",
      last_name: "Nom",
      lastName: "Nom",
      email: "Email",
      email_verified: "Email vérifié",
      phone: "Téléphone",
      country: "Pays",
      telegramUsername: "Nom d'utilisateur Telegram",
      username: "Nom d'utilisateur Telegram",
      photo_url: "Photo de profil"
    };
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
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

  const renderUserInfo = () => {
    if (!user) return null;

    return (
      <>
        {user.photo_url && (
          <motion.img
            src={user.photo_url}
            alt="Photo de profil"
            className="profile-picture"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        )}
        <ul className="profile-info">
          {Object.entries(user)
            .filter(([key, value]) => value !== null && value !== "" && key !== "password" && key !== "token" && typeof value !== "object")
            .map(([key, value], index) => (
              <motion.li
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <strong>{formatLabel(key)} :</strong>{" "}
                {key === "email_verified" ? (
                  value ? (
                    <span className="verified">
                      <FaCheck /> Oui
                    </span>
                  ) : (
                    <span className="not-verified">
                      <FaTimes /> Non
                    </span>
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

  const renderExtras = () => (
    <ul className="profile-extras">
      {wallet && (
        <motion.li
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <FaCoins className="icon coin" />
          <strong>Solde :</strong> {wallet.balance} ₿
        </motion.li>
      )}
      {level && (
        <motion.li
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <FaLevelUpAlt className="icon level" />
          <strong>Niveau :</strong> {level.level} (XP : {level.experience})
        </motion.li>
      )}
      {ranking && (
        <motion.li
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <FaUserAlt className="icon ranking" />
          <strong>Classement :</strong>{" "}
          {ranking.find((entry) => entry.telegram_id === user?.telegram_id)?.rank ?? "N/A"}
        </motion.li>
      )}
      {status && (
        <motion.li
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <FaFlag className="icon status" />
          <strong>Statut :</strong> {status.status}
        </motion.li>
      )}
    </ul>
  );

  const displayName = user?.first_name || "Guest";

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
              👤 Profil de {displayName}
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
                <p>Aucune information utilisateur disponible.</p>
                <p>⚠️ Connecte-toi via Telegram pour voir ton profil.</p>
              </motion.div>
            )}

            {user && !loading && (
              <>
                {renderUserInfo()}
                <motion.hr 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.3 }}
                />
                {renderExtras()}
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