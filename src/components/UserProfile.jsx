import React, { useEffect } from "react";
import "./UserProfile.css";
import { useUser } from "../contexts/UserContext";
import { FiLogOut } from "react-icons/fi"; // Icône de déconnexion
import { FaCoins, FaLevelUpAlt, FaUserAlt, FaFlag } from "react-icons/fa"; // Icônes jolis

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

  useEffect(() => {
    if (user?.telegram_id) {
      fetchWallet(user.telegram_id);
      fetchLevel(user.telegram_id);
      fetchRanking();
      fetchStatus(user.telegram_id);
    }
  }, [user]);

  const formatLabel = (key) => {
    switch (key) {
      case "first_name":
      case "firstName": return "Prénom";
      case "last_name":
      case "lastName": return "Nom";
      case "email": return "Email";
      case "email_verified": return "Email vérifié";
      case "phone": return "Téléphone";
      case "country": return "Pays";
      case "telegramUsername":
      case "username": return "Nom d'utilisateur Telegram";
      case "photo_url": return "Photo de profil (URL)";
      default: return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

  const handleLogout = () => {
    logoutUser();
    onClose(); // Ferme le modal après déconnexion
  };

  const renderUserInfo = () => {
    if (!user) return null;

    const entries = Object.entries(user).filter(
      ([key, value]) =>
        value !== null &&
        value !== "" &&
        key !== "password" &&
        key !== "token" &&
        typeof value !== "object"
    );

    return (
      <>
        {user.photo_url && (
          <img
            src={user.photo_url}
            alt="Photo de profil"
            className="profile-picture"
          />
        )}
        <ul className="profile-info">
          {entries.map(([key, value]) => (
            <li key={key}>
              <strong>{formatLabel(key)} :</strong>{" "}
              {key === "email_verified" ? (
                value ? (
                  <span className="verified">Oui</span>
                ) : (
                  <span className="not-verified">Non</span>
                )
              ) : (
                value
              )}
            </li>
          ))}
        </ul>
      </>
    );
  };

  const renderExtras = () => (
    <ul className="profile-extras">
      {wallet && (
        <li>
          <FaCoins className="icon" />
          <strong>Solde :</strong> {wallet.balance} ₿
        </li>
      )}
      {level && (
        <li>
          <FaLevelUpAlt className="icon" />
          <strong>Niveau :</strong> {level.level} (XP : {level.experience})
        </li>
      )}
      {ranking && (
        <li>
          <FaUserAlt className="icon" />
          <strong>Classement :</strong>{" "}
          {ranking.find((entry) => entry.telegram_id === user?.telegram_id)?.rank ?? "N/A"}
        </li>
      )}
      {status && (
        <li>
          <FaFlag className="icon" />
          <strong>Statut :</strong> {status.status}
        </li>
      )}
    </ul>
  );

  const displayName = user?.first_name || "Guest";

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>👤 Profil de {displayName}</h2>

        {loading && <p>Chargement des données...</p>}

        {!user && !loading && (
          <div className="error-message">
            <p>Aucune information utilisateur disponible.</p>
            <p>⚠️ Connecte-toi via Telegram pour voir ton profil.</p>
          </div>
        )}

        {user && !loading && (
          <>
            {renderUserInfo()}
            <hr />
            {renderExtras()}
          </>
        )}

        <div className="profile-buttons">
          <button className="logout-button" onClick={handleLogout}>
            <FiLogOut /> Déconnexion
          </button>
          <button className="close-button" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
