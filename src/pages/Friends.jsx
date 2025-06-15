import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";

const Friends = () => {
  const [referralLink, setReferralLink] = useState("");
  const [invitedNicknames, setInvitedNicknames] = useState([]);
  const { user, fetchBalance } = useUser();

  // 🔄 Recharge le solde à l'ouverture
  useEffect(() => {
    if (user?.telegram_id) {
      fetchBalance(user.telegram_id).catch((err) =>
        console.error("Erreur de solde :", err)
      );
    }
  }, [user, fetchBalance]);

  // 🔗 Génère le lien de parrainage et récupère les invités
  useEffect(() => {
    if (user?.telegram_id) {
      // ✅ Utilise telegram_id pour générer le lien unique
      const refId = user.telegram_id;
      const link = `${window.location.origin}/?ref=${refId}`;
      setReferralLink(link);

      // ✅ Utilise la bonne clé pour récupérer les invités
      const storageKey = `invitedBy_${refId}`;
      const localInvites = JSON.parse(localStorage.getItem(storageKey)) || [];
      setInvitedNicknames(localInvites);
    }
  }, [user]);

  const handleCopyLink = () => {
    if (!referralLink) return;

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
        value={referralLink || "Chargement..."}
        readOnly
        className="referral-link"
      />
      <button onClick={handleCopyLink} disabled={!referralLink}>
        📋 Copier
      </button>

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
