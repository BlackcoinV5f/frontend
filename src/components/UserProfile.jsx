import React, { useEffect, useState } from "react";
import "./UserProfile.css"; // Fichier CSS pour le style

const UserProfile = ({ onClose }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("telegramUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Profil du Joueur</h2>
        {user ? (
          <>
            <img src={user.photo_url} alt="Profil" className="profile-picture" />
            <p><strong>Nom :</strong> {user.first_name} {user.last_name}</p>
            <p><strong>Nom d'utilisateur :</strong> @{user.username}</p>
          </>
        ) : (
          <p>Aucune information utilisateur disponible.</p>
        )}

{!user?.username && (
  <p className="error-message">⚠️ Erreur : Connecte-toi via Telegram pour voir ton profil.</p>
)}
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default UserProfile;
