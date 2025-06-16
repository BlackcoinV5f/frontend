import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";

const Friends = () => {
  const [referralLink, setReferralLink] = useState("");
  const [invitedNicknames, setInvitedNicknames] = useState([]);
  const { user, fetchBalance } = useUser();

  // 🔁 Recharge le solde au chargement
  useEffect(() => {
    if (user?.telegram_id) {
      fetchBalance(user.telegram_id).catch((err) =>
        console.error("Erreur de solde :", err)
      );
    }
  }, [user, fetchBalance]);

  // 📎 Génère le lien de parrainage et récupère les invités
  useEffect(() => {
    if (user?.telegram_id) {
      const refId = user.telegram_id;

      // ✅ Lien de parrainage Telegram compatible app & mobile
      const link = `https://t.me/Blackmaketbot/start?startapp=ref_${refId}`;
      setReferralLink(link);

      // 📥 Récupère les invités depuis le localStorage
      const storageKey = `invitedBy_${refId}`;
      const localInvites = JSON.parse(localStorage.getItem(storageKey)) || [];
      setInvitedNicknames(localInvites);
    }
  }, [user]);

  // 📋 Copier le lien dans le presse-papiers
  const handleCopyLink = () => {
    if (!referralLink) return;

    navigator.clipboard
      .writeText(referralLink)
      .then(() => alert("Lien copié dans le presse-papiers 📋"))
      .catch(() => alert("Erreur lors de la copie du lien."));
  };

  // 🚀 Ouvre Telegram (app mobile en priorité)
  const openTelegramBot = () => {
    if (!user?.telegram_id) return;

    const telegramLink = `tg://resolve?domain=Blackmaketbot&startapp=ref_${user.telegram_id}`;
    const fallbackLink = `https://t.me/Blackmaketbot/start?startapp=ref_${user.telegram_id}`;
    
    window.location.href = telegramLink;

    // Si l'app Telegram n'est pas installée, bascule vers navigateur
    setTimeout(() => {
      window.location.href = fallbackLink;
    }, 1500);
  };

  return (
    <div className="page-container">
      <h2>👥 Parrainage</h2>
      <p>Partage ce lien avec tes amis pour les inviter :</p>

      <input
        type="text"
        value={referralLink || "Chargement..."}
        readOnly
        className="referral-link"
      />

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button onClick={handleCopyLink} disabled={!referralLink}>
          📋 Copier
        </button>
        <button onClick={openTelegramBot} disabled={!referralLink}>
          🚀 Ouvrir le bot Telegram
        </button>
      </div>

      <h3 style={{ marginTop: "30px" }}>📜 Joueurs invités</h3>
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
