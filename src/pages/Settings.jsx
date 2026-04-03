// src/pages/Settings.jsx

import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import {
  FaFacebook,
  FaYoutube,
  FaTelegram,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

import { FaTiktok, FaHeadset } from "react-icons/fa6";

import "./Settings.css";

/* ============================
   LANGUAGES
============================ */

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "ar", label: "العربية" }, // ← langue arabe ajoutée
];

/* ============================
   COMPONENT
============================ */

const Settings = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("appLanguage", lang);
  };

  return (
    <div className="settings-container">
      <main className="settings-content">

        {/* ================= Language ================= */}
        <section className="settings-section">
          <h2>Language</h2>
          <select
            value={i18n.language}
            onChange={handleLanguageChange}
            className="language-select"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </section>

        {/* ================= Links ================= */}
        <section className="settings-section clickable">
          <Link to="/faq" className="settings-link">
            FAQ Blackcoin
          </Link>
        </section>

        <section className="settings-section clickable">
          <a
            href="https://blackcoinweb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="settings-link"
          >
            Whitepaper
          </a>
        </section>

        {/* ✅ Support → ouvre Gmail / app mail */}
        <section className="settings-section clickable">
          <a
            href="mailto:blackcoinservice@gmail.com?subject=Support%20Blackcoin&body=Bonjour%20l'équipe%20Blackcoin,%0D%0A%0D%0A"
            className="settings-link"
          >
            Support
          </a>
        </section>

        <section className="settings-section clickable">
          <Link to="/privacy" className="settings-link">
            Politique de confidentialité
          </Link>
        </section>

        {/* ================= WhatsApp (désactivé) ================= */}
        <section className="settings-section">
          <h2>WhatsApp</h2>
          <div className="social-icons disabled">
            <span title="WhatsApp Channel (désactivé)">
              <FaWhatsapp />
            </span>
            <span title="Assistance WhatsApp (désactivée)">
              <FaHeadset />
            </span>
          </div>
        </section>

        {/* ================= Social Media ================= */}
        <section className="settings-section">
          <h2>Suivez-nous</h2>
          <div className="social-icons">

            <a
              href="https://www.facebook.com/share/1CjsWSj1P3/"
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
            >
              <FaFacebook />
            </a>

            <a
              href="https://www.youtube.com/@Blackcoinchaine"
              target="_blank"
              rel="noopener noreferrer"
              title="YouTube"
            >
              <FaYoutube />
            </a>

            <a
              href="https://t.me/+2VYCu2Ygs0Q1YTk0"
              target="_blank"
              rel="noopener noreferrer"
              title="Telegram"
            >
              <FaTelegram />
            </a>

            <a
              href="https://x.com/BlackcoinON"
              target="_blank"
              rel="noopener noreferrer"
              title="Twitter"
            >
              <FaTwitter />
            </a>

            <a
              href="https://www.instagram.com/blackcoin_bkc"
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.tiktok.com/@blackcoin_official"
              target="_blank"
              rel="noopener noreferrer"
              title="TikTok"
            >
              <FaTiktok />
            </a>

          </div>
        </section>

      </main>
    </div>
  );
};

export default Settings;