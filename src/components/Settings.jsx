// src/components/Settings.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
];

const Settings = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value); // 🔥 change la langue pour toute l'application
    sessionStorage.setItem("appLanguage", e.target.value); // persistance
  };

  return (
    <div className="settings">
      <h2>{i18n.t("settings")}</h2>
      <label htmlFor="language-select">Choose language:</label>
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
    </div>
  );
};

export default Settings;
