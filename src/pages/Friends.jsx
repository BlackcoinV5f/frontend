import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import { FaUserFriends, FaCopy, FaTelegram, FaUserPlus, FaClipboardList, FaCheck } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import "./Friends.css";

const Friends = () => {
  const [referralLink, setReferralLink] = useState("");
  const [invitedNicknames, setInvitedNicknames] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const { user, fetchBalance } = useUser();

  useEffect(() => {
    if (user?.telegram_id) {
      fetchBalance(user.telegram_id).catch((err) =>
        console.error("Erreur de solde :", err)
      );
    }
  }, [user, fetchBalance]);

  useEffect(() => {
    if (user?.telegram_id) {
      const refId = user.telegram_id;
      const link = `https://t.me/Blackmaketbot/start?startapp=ref_${refId}`;
      setReferralLink(link);

      const storageKey = `invitedBy_${refId}`;
      const localInvites = JSON.parse(localStorage.getItem(storageKey)) || [];
      setInvitedNicknames(localInvites);
    }
  }, [user]);

  const handleCopyLink = () => {
    if (!referralLink) return;

    // Solution de repli pour les navigateurs qui ne supportent pas clipboard API
    const copyToClipboardFallback = (text) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        document.execCommand('copy');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Erreur lors de la copie:', err);
        alert("Erreur lors de la copie du lien. Veuillez copier manuellement.");
      } finally {
        document.body.removeChild(textarea);
      }
    };

    // Essayer d'abord avec l'API Clipboard moderne
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralLink)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(() => {
          // Fallback si l'API échoue
          copyToClipboardFallback(referralLink);
        });
    } else {
      // Fallback pour les anciens navigateurs
      copyToClipboardFallback(referralLink);
    }
  };

  const openTelegramBot = () => {
    if (!user?.telegram_id) return;

    const telegramLink = `tg://resolve?domain=Blackmaketbot&startapp=ref_${user.telegram_id}`;
    const fallbackLink = `https://t.me/Blackmaketbot/start?startapp=ref_${user.telegram_id}`;
    
    window.open(telegramLink, '_blank');

    setTimeout(() => {
      window.open(fallbackLink, '_blank');
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
            onClick={(e) => e.target.select()}
          />
          
          <motion.button
            className={`copy-button ${isCopied ? "copied" : ""}`}
            onClick={handleCopyLink}
            disabled={!referralLink}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCopied ? (
              <>
                <FaCheck className="button-icon" />
                Copié !
              </>
            ) : (
              <>
                <FaCopy className="button-icon" />
                Copier
              </>
            )}
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