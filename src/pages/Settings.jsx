// src/pages/Settings.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import {
  FaFacebook,
  FaYoutube,
  FaTelegram,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6"; // ✅ import TikTok

import "./Settings.css";

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
];

const Settings = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
    sessionStorage.setItem("appLanguage", e.target.value);
  };

  return (
    <div className="settings-container">
      <main className="settings-content">
        {/* 🌍 Langue */}
        <section className="settings-section">
          <h2>Language</h2>
          <select
            id="language-select"
            value={i18n.language}
            onChange={handleLanguageChange}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </section>

        {/* 📖 Autres sections */}
        <section className="settings-section">
          <h2>FAQ Blackcoin</h2>
        </section>

        <section className="settings-section">
          <h2>Livre blanc</h2>
        </section>

        <section className="settings-section">
          <h2>Support</h2>
        </section>

        <section className="settings-section">
          <h2>Politique de confidentialité</h2>
        </section>

        {/* 🌐 Réseaux sociaux */}
        <section className="settings-section">
          <h2>Suivez-nous sur</h2>
          <div className="social-icons">
            <a
              href="https://www.facebook.com/share/1CjsWSj1P3/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.youtube.com/@Blackcoinchaine"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube />
            </a>
            <a
              href="https://t.me/+VXuf93TxzKxlMzE0"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTelegram />
            </a>
            <a
              href="https://x.com/BlackcoinON"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com/blackcoin"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.tiktok.com/@blackcoinsecurity"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTiktok /> {/* ✅ ajout TikTok */}
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Settings;
