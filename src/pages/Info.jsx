import React from "react";
import { motion } from "framer-motion";
import { useTranslation, Trans } from "react-i18next";
import {
  Send,
  Twitter,
  Facebook,
  Youtube,
  Instagram,
  Music2,
  Globe,
} from "lucide-react";
import "./Info.css";

const socials = [
  {
    href: "https://t.me/+2VYCu2Ygs0Q1YTk0",
    Icon: Send,
    label: "Telegram",
    color: "#29b6f6",
  },
  {
    href: "https://x.com/BlackcoinON",
    Icon: Twitter,
    label: "X",
    color: "#e2e8f0",
  },
  {
    href: "https://www.facebook.com/share/1CjsWSj1P3",
    Icon: Facebook,
    label: "Facebook",
    color: "#4267B2",
  },
  {
    href: "https://www.youtube.com/@Blackcoinchaine",
    Icon: Youtube,
    label: "YouTube",
    color: "#ff0000",
  },
  {
    href: "https://www.instagram.com/blackcoin_bkc",
    Icon: Instagram,
    label: "Instagram",
    color: "#e1306c",
  },
  {
    href: "https://www.tiktok.com/@blackcoin_official",
    Icon: Music2,
    label: "TikTok",
    color: "#facc15",
  },
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
      <div className="info-title-block">
        <h2 className="info-title">{t("info.title")}</h2>
      </div>

      <motion.div
        className="info-highlight"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Trans ns="info" i18nKey="info.intro">
          L'équipe <strong>BLACKCOIN</strong> développe activement le projet,
          avec de nombreuses fonctionnalités majeures en cours.
        </Trans>
      </motion.div>

      <div className="info-section">
        <h3 className="info-section-title">{t("info.about.title")}</h3>
        <p className="info-section-text">{t("info.about.text1")}</p>
        <p className="info-section-text">{t("info.about.text2")}</p>

        <motion.a
          href="https://blackcoinweb.com"
          target="_blank"
          rel="noopener noreferrer"
          className="info-official-link"
          whileHover={{ scale: 1.02 }}
        >
          <Globe size={14} />
          www.blackcoinweb.com
        </motion.a>
      </div>

      <div className="info-section info-section--important">
        <h3 className="info-section-title">
          {t("info.communication.title")}
        </h3>
        <p className="info-section-text">
          {t("info.communication.text1")}
        </p>
        <p className="info-section-text">
          {t("info.communication.text2")}
        </p>
      </div>

      <p className="info-footer">{t("info.footer")}</p>

      <div className="info-socials">
        <p className="info-socials-label">Retrouvez-nous sur</p>

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