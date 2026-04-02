// src/pages/Info.jsx
import React from "react";
import { motion } from "framer-motion";
import { useTranslation, Trans } from "react-i18next";
import "./Info.css";

const SocialIcon = ({ href, icon, label }) => {
  const { t } = useTranslation();
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
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="info-container"
    >
      {/* TITRE */}
      <h2>{t("info.title")}</h2>

      {/* INTRODUCTION */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="highlight"
      >
        <Trans i18nKey="info.intro">
          L’équipe <strong>BLACKCOIN</strong> poursuit activement le développement du projet avec de nombreuses fonctionnalités majeures en préparation.
        </Trans>
      </motion.p>

      {/* SOCIALS */}
      <div className="social-grid">
        <SocialIcon href="https://t.me/+2VYCu2Ygs0Q1YTk0" icon="📢" label="info.telegram" />
        <SocialIcon href="https://x.com/BlackcoinON" icon="𝕏" label="info.twitter" />
        <SocialIcon href="https://www.facebook.com/share/1CjsWSj1P3/" icon="📘" label="info.facebook" />
        <SocialIcon href="https://www.youtube.com/@Blackcoinchaine" icon="▶️" label="info.youtube" />
        <SocialIcon href="https://www.instagram.com/blackcoin_bkc" icon="📸" label="info.instagram" />
        <SocialIcon href="https://www.tiktok.com/@blackcoin_official" icon="🎵" label="info.tiktok" />
      </div>

      {/* DESCRIPTION DU PROJET */}
      <motion.div
        className="section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        <h3>{t("info.aboutTitle")}</h3>
        <p>{t("info.aboutText1")}</p>
        <p>{t("info.aboutText2")}</p>
        <motion.a
          href="https://blackcoinweb.com"
          target="_blank"
          rel="noopener noreferrer"
          className="official-link"
          whileHover={{ scale: 1.05 }}
        >
          🌐 www.blackcoinweb.com
        </motion.a>
      </motion.div>

      {/* NOTE IMPORTANTE */}
      <motion.div
        className="section important"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h3>{t("info.communicationTitle")}</h3>
        <p>{t("info.communicationText1")}</p>
        <p>{t("info.communicationText2")}</p>
      </motion.div>

      {/* FOOTER */}
      <motion.p
        className="footer-note"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {t("info.footer")}
      </motion.p>
    </motion.div>
  );
};

export default Info;