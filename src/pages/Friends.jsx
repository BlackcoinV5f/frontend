import React, { useState, useEffect } from "react";

const Friends = ({ points, setPoints }) => {
  const [referralLink, setReferralLink] = useState("");
  const [invitedUsers, setInvitedUsers] = useState(() => {
    return JSON.parse(localStorage.getItem("invitedUsers")) || [];
  });

  // Générer un lien unique pour chaque joueur
  useEffect(() => {
    const userId = localStorage.getItem("userId") || Date.now();
    localStorage.setItem("userId", userId);
    setReferralLink(`${window.location.origin}/?ref=${userId}`);
  }, []);

  // Ajouter un utilisateur invité
  const addInvitedUser = (newUser) => {
    if (!invitedUsers.includes(newUser)) {
      const updatedUsers = [...invitedUsers, newUser];
      setInvitedUsers(updatedUsers);
      localStorage.setItem("invitedUsers", JSON.stringify(updatedUsers));
    }
  };

  return (
    <div className="page-container">
      <h2>👥 Parrainage</h2>
      <p>Partage ce lien pour inviter tes amis :</p>
      <input type="text" value={referralLink} readOnly className="referral-link" />
      <button onClick={() => navigator.clipboard.writeText(referralLink)}>📋 Copier</button>

      <h3>📜 Joueurs invités</h3>
      <ul>
        {invitedUsers.length > 0 ? (
          invitedUsers.map((user, index) => <li key={index}>{user}</li>)
        ) : (
          <p>Aucun joueur invité pour le moment.</p>
        )}
      </ul>
    </div>
  );
};

export default Friends;
