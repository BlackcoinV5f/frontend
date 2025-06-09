import React, { useEffect, useState } from "react";
import "./UserProfile.css";

const UserProfile = ({ onClose }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("telegramUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.id) {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Erreur de parsing des données utilisateur :", error);
      }
    }
  }, []);

  const formatLabel = (key) => {
    switch (key) {
      case "id":
        return "ID";
      case "first_name":
      case "firstName":
        return "Prénom";
      case "last_name":
      case "lastName":
        return "Nom";
      case "email":
        return "Email";
      case "email_verified":
        return "Email vérifié";
      case "phoneNumber":
      case "phone":
        return "Téléphone";
      case "country":
        return "Pays";
      case "username":
      case "telegramUsername":
        return "Nom d'utilisateur Telegram";
      case "photo_url":
        return "Photo de profil (URL)";
      default:
        return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

  const renderProfile = () => {
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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Profil du Joueur</h2>
        {user ? (
          renderProfile()
        ) : (
          <div className="error-message">
            <p>Aucune information utilisateur disponible.</p>
            <p>⚠️ Connecte-toi via Telegram pour voir ton profil.</p>
          </div>
        )}
        <button className="close-button" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default UserProfile;
