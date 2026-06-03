import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Send,
  Twitter,
  Facebook,
  Youtube,
  Instagram,
  Music2,
  Globe,
  ShieldCheck,
  FileText,
} from "lucide-react";

import "./Info.css";

const socials = [
  { href: "https://t.me/ltn_network", Icon: Send, label: "Telegram", color: "#29b6f6" },
  { href: "https://x.com/Liton_network", Icon: Twitter, label: "X", color: "#e2e8f0" },
  { href: "https://www.facebook.com/share/1DMkFcwA2B/", Icon: Facebook, label: "Facebook", color: "#4267B2" },
  { href: "https://youtube.com/@liton_network?si=xWWgWzHPPWmQZtML", Icon: Youtube, label: "YouTube", color: "#ff0000" },
  { href: "https://www.instagram.com/liton_network?igsh=cDc4OXF5eXM5Y2Nj", Icon: Instagram, label: "Instagram", color: "#e1306c" },
  { href: "https://www.tiktok.com/@liton_network", Icon: Music2, label: "TikTok", color: "#facc15" },
];

const Info = () => {
  const { t } = useTranslation("info");

  return (
    <motion.div
      className="info-container"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ───────── TITLE ───────── */}
      <div className="info-title-block">
        <h2 className="info-title">{t("info.title")}</h2>
      </div>

      {/* ───────── INTRO ───────── */}
      <motion.div
        className="info-highlight"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {t("info.intro_before")}{" "}
        <strong>LITON NETWORK</strong>{" "}
        {t("info.intro_after")}
      </motion.div>

      {/* ───────── ABOUT ───────── */}
      <div className="info-section">
        <h3 className="info-section-title">{t("info.about.title")}</h3>
        <p className="info-section-text">{t("info.about.text1")}</p>
        <p className="info-section-text">{t("info.about.text2")}</p>
        <motion.a
          href="https://www.blackcoinweb.com"
          target="_blank"
          rel="noopener noreferrer"
          className="info-official-link"
          whileHover={{ scale: 1.02 }}
        >
          <Globe size={14} />
          www.blackcoinweb.com
        </motion.a>
      </div>

      {/* ───────── COMMUNICATION ───────── */}
      <div className="info-section info-section--important">
        <h3 className="info-section-title">{t("info.communication.title")}</h3>
        <p className="info-section-text">{t("info.communication.text1")}</p>
        <p className="info-section-text">{t("info.communication.text2")}</p>
      </div>

      {/* ───────── RESPONSIBILITY ───────── */}
      <div className="info-section info-section--warning">
        <h3 className="info-section-title">{t("info.responsibility.title")}</h3>
        <p className="info-section-text">{t("info.responsibility.text1")}</p>
        <p className="info-section-text">{t("info.responsibility.text2")}</p>
        <p className="info-section-text">{t("info.responsibility.text3")}</p>

        {/* ── Boutons de redirection ── */}
        <div className="info-legal-buttons">
          <motion.a
            href="https://www.blackcoinweb.com/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="info-legal-btn info-legal-btn--privacy"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <ShieldCheck size={16} />
            {t("info.responsibility.btn_privacy")}
          </motion.a>

          <motion.a
            href="https://www.blackcoinweb.com/terms-of-use"
            target="_blank"
            rel="noopener noreferrer"
            className="info-legal-btn info-legal-btn--terms"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <FileText size={16} />
            {t("info.responsibility.btn_terms")}
          </motion.a>
        </div>
      </div>

      {/* ───────── FOOTER ───────── */}
      <p className="info-footer">{t("info.footer")}</p>

      {/* ───────── SOCIALS ───────── */}
      <div className="info-socials">
        <p className="info-socials-label">{t("info.socials_label")}</p>
        <div className="social-grid">
          {socials.map(({ href, Icon, label, color }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              title={label}
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.92 }}
              style={{ "--social-color": color }}
            >
              <Icon size={22} strokeWidth={1.8} />
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Info;