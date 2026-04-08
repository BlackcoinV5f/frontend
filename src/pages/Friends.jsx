// src/components/Friends.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useUser } from "../contexts/UserContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  const { user, axiosInstance } = useUser();
  const queryClient = useQueryClient();

  const [isCopied, setIsCopied] = useState(false);

  // ✅ QUERY PRINCIPALE
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["friends", user?.id],
    queryFn: async () => {
      const res = await axiosInstance.get("/friends/me/");
      return res.data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 15, // 15 min cache
    refetchOnWindowFocus: false,
  });

  // ✅ MUTATION (generate code)
  const { mutate: generateCode, isPending: isGenerating } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/friends/generate-code/");
      return res.data;
    },
    onSuccess: () => {
      // 🔥 refresh automatique des données
      queryClient.invalidateQueries(["friends", user?.id]);
    },
  });

  // ✅ extraction
  const promoCode = data?.promo_code || "";
  const referrals = [...new Set(data?.friends || [])];

  // 📋 copier
  const handleCopyCode = () => {
    if (!promoCode) return;

    navigator.clipboard
      .writeText(promoCode)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(() => alert(t("bonus.friends.errors.copy")));
  };

  if (isLoading) return <div className="friends-container">Loading...</div>;

  if (isError)
    return (
      <div className="friends-container">
        ❌ {t("bonus.error.generic")}
      </div>
    );

  return (
    <motion.div
      className="friends-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* HEADER */}
      <motion.div
        className="friends-header"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        <FaUserFriends className="header-icon" />
        <h2>{t("bonus.friends.title")}</h2>
        <GiPartyPopper className="header-icon" />
      </motion.div>

      {/* DESCRIPTION */}
      <motion.p className="friends-description">
        {t("bonus.friends.description")}
      </motion.p>

      {/* CODE PROMO */}
      <motion.div className="referral-section">
        <h3>
          <FaUserPlus className="section-icon" />
          {t("bonus.friends.yourCode")}
        </h3>

        <motion.button
          className="generate-code-button"
          onClick={() => generateCode()}
          disabled={isGenerating}
        >
          <FaMagic className="button-icon" />
          {isGenerating
            ? t("bonus.friends.generating")
            : t("bonus.friends.generate")}
        </motion.button>

        {promoCode && (
          <div className="referral-link-container">
            <input
              type="text"
              value={promoCode}
              readOnly
              className="referral-link-input"
              onClick={(e) => e.target.select()}
            />

            <motion.button
              className={`copy-button ${isCopied ? "copied" : ""}`}
              onClick={handleCopyCode}
            >
              {isCopied ? (
                <>
                  <FaCheck /> {t("bonus.friends.copied")}
                </>
              ) : (
                <>
                  <FaCopy /> {t("bonus.friends.copy")}
                </>
              )}
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* LISTE */}
      <motion.div className="invited-section">
        <h3>
          <FaClipboardList /> {t("bonus.friends.yourReferrals")}
        </h3>

        {referrals.length > 0 ? (
          <motion.ul className="invited-list">
            <AnimatePresence>
              {referrals.map((friend, index) => (
                <motion.li key={index}>
                  <div className="user-avatar"></div>
                  <span>{friend}</span>
                  <div className="user-badge">
                    {t("bonus.friends.referral")}
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <div className="empty-invites">
            <p>{t("bonus.friends.empty.title")}</p>
            <p>{t("bonus.friends.empty.subtitle")}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Friends;