import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import {
  FaUserFriends,
  FaCopy,
  FaUserPlus,
  FaClipboardList,
  FaCheck,
  FaMagic,
} from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import "./Friends.css";

const Friends = () => {
  const [promoCode, setPromoCode] = useState("");
  const [referrals, setReferrals] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [codeGenerated, setCodeGenerated] = useState(false);
  const { user } = useUser();

  // Chargement des données (code promo et liste des filleuls)
  useEffect(() => {
    async function fetchFriendsData() {
      try {
        // 🔑 Utilisation du cookie HttpOnly au lieu de localStorage
        const res = await fetch("/api/friends/me", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Erreur API");
        const data = await res.json();

        setPromoCode(data.promo_code || "");
        setReferrals([...(new Set(data.friends || []))]);
        setCodeGenerated(!!data.promo_code);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
      }
    }

    if (user) {
      fetchFriendsData();
    }
  }, [user]);

  // Génération du code promo via bouton
  const handleGenerateCode = async () => {
    if (!user || codeGenerated) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/friends/generate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔑 Envoie le cookie HttpOnly
        body: JSON.stringify({ user_id: user.id }),
      });

      if (!res.ok) throw new Error("Erreur API");
      const data = await res.json();
      setPromoCode(data.code);
      setCodeGenerated(true);
    } catch (err) {
      console.error("Erreur lors de la génération du code:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    if (!promoCode) return;

    navigator.clipboard
      .writeText(promoCode)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => {
        alert("Erreur lors de la copie du code promo.");
      });
  };

  return (
    <motion.div
      className="friends-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
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

      {/* Description */}
      <motion.p
        className="friends-description"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Invitez vos amis et gagnez des récompenses ensemble !
      </motion.p>

      {/* Code Promo */}
      <motion.div
        className="referral-section"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3>
          <FaUserPlus className="section-icon" />
          Votre code promo
        </h3>

        {!promoCode && !codeGenerated ? (
          <motion.button
            className="generate-code-button"
            onClick={handleGenerateCode}
            disabled={isGenerating || codeGenerated}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaMagic className="button-icon" />
            {isGenerating ? "Génération..." : "Générer mon code promo"}
          </motion.button>
        ) : (
          <div className="referral-link-container">
            <input
              type="text"
              value={promoCode || "Chargement..."}
              readOnly
              className="referral-link-input"
              onClick={(e) => e.target.select()}
            />

            <motion.button
              className={`copy-button ${isCopied ? "copied" : ""}`}
              onClick={handleCopyCode}
              disabled={!promoCode}
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
        )}
      </motion.div>

      {/* Liste des filleuls */}
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

        {referrals.length > 0 ? (
          <motion.ul className="invited-list">
            <AnimatePresence>
              {referrals.map((friend, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="user-avatar"></div>
                  <span>{friend}</span>
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
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
              alt="No friends"
            />
            <p>Vous n'avez pas encore invité d'amis</p>
            <p>
              Partagez votre code promo pour commencer à gagner des récompenses !
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Friends;
