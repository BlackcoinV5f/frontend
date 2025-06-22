import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import { FaUserFriends, FaCopy, FaTelegram, FaUserPlus, FaClipboardList } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import "./Friends.css";

const Friends = () => {
  const [referralLink, setReferralLink] = useState("");
  const [invitedNicknames, setInvitedNicknames] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
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
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
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
    <motion.div 
      className="friends-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="friends-header"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <FaUserFriends className="header-icon" />
        <h2>Programme de Parrainage</h2>
        <GiPartyPopper className="header-icon" />
      </motion.div>

      <motion.p
        className="friends-description"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Invitez vos amis et gagnez des récompenses ensemble !
      </motion.p>

      <motion.div
        className="referral-section"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3>
          <FaUserPlus className="section-icon" />
          Votre lien de parrainage
        </h3>
        
        <div className="referral-link-container">
          <input
            type="text"
            value={referralLink || "Génération du lien..."}
            readOnly
            className="referral-link-input"
          />
          
          <motion.button
            className="copy-button"
            onClick={handleCopyLink}
            disabled={!referralLink}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCopy className="button-icon" />
            {isCopied ? "Copié !" : "Copier"}
          </motion.button>
        </div>
        
        <motion.button
          className="telegram-button"
          onClick={openTelegramBot}
          disabled={!referralLink}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaTelegram className="button-icon" />
          Ouvrir dans Telegram
        </motion.button>
      </motion.div>

      <motion.div
        className="invited-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3>
          <FaClipboardList className="section-icon" />
          Vos filleuls
        </h3>
        
        {invitedNicknames.length > 0 ? (
          <motion.ul className="invited-list">
            <AnimatePresence>
              {invitedNicknames.map((nickname, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="user-avatar"></div>
                  <span>{nickname}</span>
                  <div className="user-badge">Filleul</div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <motion.div
            className="empty-invites"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <img src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png" alt="No friends" />
            <p>Vous n'avez pas encore invité d'amis</p>
            <p>Partagez votre lien pour commencer à gagner des récompenses !</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Friends;