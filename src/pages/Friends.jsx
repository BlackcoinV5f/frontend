import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";

const Friends = () => {
  const [referralLink, setReferralLink] = useState("");
  const [invitedNicknames, setInvitedNicknames] = useState([]);
  const { user, fetchBalance } = useUser();

  // 🔄 Met à jour le solde à l'affichage de la page
  useEffect(() => {
    if (user?.telegram_id) {
      fetchBalance(user.telegram_id).catch((err) =>
        console.error("Erreur de solde :", err)
      );
    }
  }, [user, fetchBalance]);

  // 🔗 Génère le lien de parrainage + récupère les invités locaux
  useEffect(() => {
    if (user?.id) {
      setReferralLink(`${window.location.origin}/?ref=${user.id}`);

      const key = `invitedBy_${user.id}`;
      const localInvites = JSON.parse(localStorage.getItem(key)) || [];
      setInvitedNicknames(localInvites);
    }
  }, [user]);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => alert("Lien copié dans le presse-papiers 📋"))
      .catch(() => alert("Erreur lors de la copie"));
  };

  return (
    <div className="page-container">
      <h2>👥 Parrainage</h2>
      <p>Partage ton lien pour inviter tes amis :</p>
      <input
        type="text"
        value={referralLink}
        readOnly
        className="referral-link"
      />
      <button onClick={handleCopyLink}>📋 Copier</button>

      <h3>📜 Joueurs invités</h3>
      {invitedNicknames.length > 0 ? (
        <ul>
          {invitedNicknames.map((nickname, index) => (
            <li key={index}>👤 {nickname}</li>
          ))}
        </ul>
      ) : (
        <p>🕳️ Aucun joueur invité pour le moment.</p>
      )}
    </div>
  );
};

export default Friends;
