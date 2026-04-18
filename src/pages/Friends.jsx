import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const { t } = useTranslation();
  const { user } = useUser();

  const { data, isLoading, isError, generateCode } = useFriends();

  const [isCopied, setIsCopied] = useState(false);

  const promoCode = data?.promo_code || "";
  const referrals = [...new Set(data?.friends || [])];

  // 📋 copy
  const handleCopyCode = () => {
    if (!promoCode) return;

    navigator.clipboard.writeText(promoCode).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  if (!user) {
    return <div className="friends-container">Loading...</div>;
  }

  if (isLoading) {
    return <div className="friends-container">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="friends-container">
        ❌ {t("bonus.error.generic")}
      </div>
    );
  }

  return (
    <motion.div
      className="friends-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* HEADER */}
      <motion.div className="friends-header">
        <FaUserFriends className="header-icon" />
        <h2>{t("bonus.friends.title")}</h2>
        <GiPartyPopper className="header-icon" />
      </motion.div>

      <motion.p className="friends-description">
        {t("bonus.friends.description")}
      </motion.p>

      {/* CODE */}
      <motion.div className="referral-section">
        <h3>
          <FaUserPlus /> {t("bonus.friends.yourCode")}
        </h3>

        <motion.button
          onClick={() => generateCode.mutate()}
          disabled={generateCode.isPending}
          className="generate-code-button"
        >
          <FaMagic />
          {generateCode.isPending
            ? t("bonus.friends.generating")
            : t("bonus.friends.generate")}
        </motion.button>

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
      </motion.div>

      {/* LIST */}
      <motion.div className="invited-section">
        <h3>
          <FaClipboardList /> {t("bonus.friends.yourReferrals")}
        </h3>

        {referrals.length > 0 ? (
          <motion.ul>
            <AnimatePresence>
              {referrals.map((friend, index) => (
                <motion.li key={index}>
                  <span>{friend}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <div>
            <p>{t("bonus.friends.empty.title")}</p>
            <p>{t("bonus.friends.empty.subtitle")}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Friends;