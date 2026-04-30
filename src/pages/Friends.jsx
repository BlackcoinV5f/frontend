import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useUser } from "../contexts/UserContext";
import { useFriends } from "../hooks/useFriends";

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
  const { t } = useTranslation("friends");
  const { user } = useUser();
  const { data, isLoading, isError, generateCode } = useFriends();

  const [isCopied, setIsCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const promoCode = data?.promo_code || "";

  // 🔥 FIX doublons + tri
  const referrals = [...new Set(data?.friends || [])].sort();

  // 📋 COPY
  const handleCopyCode = async () => {
    if (!promoCode) return;

    try {
      await navigator.clipboard.writeText(promoCode);
      setIsCopied(true);
      setCopyError("");

      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setCopyError(t("bonus.friends.errors.copy"));
    }
  };

  // ================= STATES =================

  if (!user || isLoading) {
    return (
      <div className="friends-container">
        {t("bonus.loading")}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="friends-container">
        {t("bonus.errors.generic")}
      </div>
    );
  }

  // ================= RENDER =================

  return (
    <motion.div
      className="friends-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* HEADER */}
      <div className="friends-header">
        <FaUserFriends />
        <h2>{t("bonus.friends.title")}</h2>
        <GiPartyPopper />
      </div>

      <p className="friends-description">
        {t("bonus.friends.description")}
      </p>

      {/* CODE */}
      <div className="referral-section">
        <h3>
          <FaUserPlus /> {t("bonus.friends.yourCode")}
        </h3>

        <button
          onClick={() => generateCode.mutate()}
          disabled={generateCode.isPending}
          className="generate-code-button"
        >
          <FaMagic />
          {generateCode.isPending
            ? t("bonus.friends.generating")
            : t("bonus.friends.generate")}
        </button>

        {promoCode && (
          <div className="referral-link-container">
            <input value={promoCode} readOnly />

            <button onClick={handleCopyCode}>
              {isCopied ? (
                <>
                  <FaCheck /> {t("bonus.friends.copied")}
                </>
              ) : (
                <>
                  <FaCopy /> {t("bonus.friends.copy")}
                </>
              )}
            </button>
          </div>
        )}

        {copyError && <p className="error">{copyError}</p>}
      </div>

      {/* REFERRALS LIST */}
      <div className="invited-section">
        <h3>
          <FaClipboardList /> {t("bonus.friends.yourReferrals")} ({referrals.length})
        </h3>

        {referrals.length === 0 ? (
          <div className="empty-state">
            <p>{t("bonus.friends.empty.title")}</p>
            <p>{t("bonus.friends.empty.subtitle")}</p>
          </div>
        ) : (
          <div className="referral-list">
            {referrals.map((friend, index) => (
              <motion.div
                key={index}
                className="referral-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Avatar */}
                <div className="avatar">
                  {friend.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="referral-info">
                  <span className="username">{friend}</span>
                  <span className="status">Active</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Friends;