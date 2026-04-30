// src/pages/Info.jsx
import React from "react";
import { motion } from "framer-motion";
import { useTranslation, Trans } from "react-i18next";
import "./Info.css";

const SocialIcon = ({ href, icon, label }) => {
  const { t } = useTranslation("info"); // ✅

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.9 }}
      className="social-icon"
      title={t(label)}
    >
      <span role="img" aria-label={t(label)}>
        {icon}
      </span>
    </motion.a>
  );
};

const Info = () => {
  const { t } = useTranslation("info"); // ✅

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="info-container"
    >
      {/* TITRE */}
      <h2>{t("info.title")}</h2>

      {/* INTRO */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="highlight"
      >
        <Trans ns="info" i18nKey="info.intro">
          L’équipe <strong>BLACKCOIN</strong> développe activement le projet.
        </Trans>
      </motion.p>

      {/* SOCIALS */}
      <div className="social-grid">
        <SocialIcon href="..." icon="📢" label="info.socials.telegram" />
        <SocialIcon href="..." icon="𝕏" label="info.socials.twitter" />
        <SocialIcon href="..." icon="📘" label="info.socials.facebook" />
        <SocialIcon href="..." icon="▶️" label="info.socials.youtube" />
        <SocialIcon href="..." icon="📸" label="info.socials.instagram" />
        <SocialIcon href="..." icon="🎵" label="info.socials.tiktok" />
      </div>

      {/* ABOUT */}
      <motion.div className="section">
        <h3>{t("info.about.title")}</h3>
        <p>{t("info.about.text1")}</p>
        <p>{t("info.about.text2")}</p>

        <motion.a
          href="https://blackcoinweb.com"
          target="_blank"
          rel="noopener noreferrer"
          className="official-link"
        >
          🌐 www.blackcoinweb.com
        </motion.a>
      </motion.div>

      {/* COMMUNICATION */}
      <motion.div className="section important">
        <h3>{t("info.communication.title")}</h3>
        <p>{t("info.communication.text1")}</p>
        <p>{t("info.communication.text2")}</p>
      </motion.div>

      {/* FOOTER */}
      <motion.p className="footer-note">
        {t("info.footer")}
      </motion.p>
    </motion.div>
  );
};

export default Info;