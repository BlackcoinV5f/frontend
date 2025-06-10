import React, { useEffect, useState } from "react";

const Friends = () => {
  const [referralLink, setReferralLink] = useState("");
  const [invitedUsers, setInvitedUsers] = useState([]);

  useEffect(() => {
    // Récupération de l'utilisateur actuel
    const storedUser = localStorage.getItem("telegramUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const userId = user?.id;

        // Générer le lien de parrainage
        if (userId) {
          const link = `${window.location.origin}/?ref=${userId}`;
          setReferralLink(link);

          // Récupérer les invités du parrain depuis localStorage
          const key = `invitedBy_${userId}`;
          const storedInvites = JSON.parse(localStorage.getItem(key)) || [];
          setInvitedUsers(storedInvites);
        }
      } catch (error) {
        console.error("Erreur lors de la lecture des infos utilisateur :", error);
      }
    }
  }, []);

  return (
    <div className="page-container">
      <h2>👥 Parrainage</h2>
      <p>Partage ce lien pour inviter tes amis :</p>
      <input
        type="text"
        value={referralLink}
        readOnly
        className="referral-link"
      />
      <button onClick={() => navigator.clipboard.writeText(referralLink)}>
        📋 Copier
      </button>

      <h3>📜 Joueurs invités</h3>
      {invitedUsers.length > 0 ? (
        <ul>
          {invitedUsers.map((user, index) => (
            <li key={index}>👤 {user}</li>
          ))}
        </ul>
      ) : (
        <p>Aucun joueur invité pour le moment.</p>
      )}
    </div>
  );
};

export default Friends;
