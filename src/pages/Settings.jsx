
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaFacebook, FaYoutube, FaTelegram, FaTwitter, FaInstagram, FaWhatsapp, FaSyncAlt } from "react-icons/fa";
import { FaTiktok, FaHeadset } from "react-icons/fa6";
import "./Settings.css";

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Francais" },
  { code: "es", label: "Espanol" },
  { code: "ar", label: "العربية" },
];

const Settings = () => {
  const { t, i18n } = useTranslation("settings");

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("appLanguage", lang);
  };

  const handleRefreshApp = () => {
    window.location.href = window.location.origin;
  };

  return (
    <div className="settings-container">
      <main className="settings-content">

        <section className="settings-section">
          <h2>{t("language")}</h2>
          <select value={i18n.language?.split("-")[0] || "en"} onChange={handleLanguageChange} className="language-select">
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </section>

        <section className="settings-section">
          <button onClick={handleRefreshApp} className="refresh-button">
            <FaSyncAlt className="refresh-icon" />
            {t("refresh")}
          </button>
        </section>

        <div className="settings-links-group">
          <Link to="/faq" className="settings-link">{t("faq")}</Link>
          <a href="https://www.blackcoinweb.com/whitepaper" target="_blank" rel="noopener noreferrer" className="settings-link">{t("whitepaper")}</a>
          <a href="mailto:blackcoinservice@gmail.com?subject=Support%20Blackcoin" className="settings-link">{t("support")}</a>
          <a href="https://www.blackcoinweb.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="settings-link">{t("privacyPolicy")}</a>
          <a href="https://www.blackcoinweb.com/terms-of-use" target="_blank" rel="noopener noreferrer" className="settings-link">{t("terms")}</a>
        </div>

        <section className="settings-section">
          <h2>{t("whatsapp")}</h2>
          <div className="social-icons disabled">
            <span title={t("whatsappChannel")}><FaWhatsapp /></span>
            <span title={t("whatsappSupport")}><FaHeadset /></span>
          </div>
        </section>

        <section className="settings-section">
          <h2>{t("followUs")}</h2>
          <div className="social-icons">
            <a href="https://www.facebook.com/share/1CjsWSj1P3/" target="_blank" rel="noopener noreferrer" title={t("facebook")}><FaFacebook /></a>
            <a href="https://www.youtube.com/@Blackcoinchaine" target="_blank" rel="noopener noreferrer" title={t("youtube")}><FaYoutube /></a>
            <a href="https://t.me/+2VYCu2Ygs0Q1YTk0" target="_blank" rel="noopener noreferrer" title={t("telegram")}><FaTelegram /></a>
            <a href="https://x.com/BlackcoinON" target="_blank" rel="noopener noreferrer" title={t("twitter")}><FaTwitter /></a>
            <a href="https://www.instagram.com/blackcoin_LTN" target="_blank" rel="noopener noreferrer" title={t("instagram")}><FaInstagram /></a>
            <a href="https://www.tiktok.com/@blackcoin_official" target="_blank" rel="noopener noreferrer" title={t("tiktok")}><FaTiktok /></a>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Settings;