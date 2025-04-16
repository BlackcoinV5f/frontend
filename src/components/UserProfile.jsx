import React, { useEffect, useState } from "react";
import "./UserProfile.css";

const UserProfile = ({ onClose }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("telegramUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.id && parsedUser?.first_name) {
          setUser(parsedUser);
        }
      } catch (e) {
        console.error("Erreur lors du parsing de l'utilisateur :", e);
      }
    }
  }, []);

  const renderProfile = () => {
    return (
      <>
        <img
          src={user.photo_url || "/default-profile.png"}
          alt="Profil"
          className="profile-picture"
        />
        <p>
          <strong>Nom :</strong> {user.first_name} {user.last_name || ""}
        </p>
        {user.username && (
          <p>
            <strong>Nom d'utilisateur :</strong> @{user.username}
          </p>
        )}
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
          <>
            <p>Aucune information utilisateur disponible.</p>
            <p className="error-message">
              ⚠️ Erreur : Connecte-toi via Telegram pour voir ton profil.
            </p>
          </>
        )}
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default UserProfile;
