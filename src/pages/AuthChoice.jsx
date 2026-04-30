// src/components/AuthChoice.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import { useTranslation } from "react-i18next";
import "./AuthChoice.css";

const languages = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
  { code: "ar", label: "AR" },
];

const AuthChoice = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  // ✅ IMPORTANT → on précise le namespace
  const { t, i18n } = useTranslation("login");

  // 🔐 Redirection utilisateur connecté
  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  // 🌍 Changement de langue
  const handleLanguageChange = (lang) => {
    if (i18n.resolvedLanguage !== lang) {
      i18n.changeLanguage(lang);
      localStorage.setItem("appLanguage", lang);
    }
  };

  const handleRegister = () => navigate("/register");
  const handleLogin = () => navigate("/login");

  return (
    <motion.div
      className="auth-choice-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* 🌍 LANGUAGE SWITCH */}
      <div className="language-switch">
        {languages.map((lang) => {
          const isActive = i18n.resolvedLanguage === lang.code;

          return (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={isActive ? "active" : ""}
            >
              {lang.label}
            </button>
          );
        })}
      </div>

      {/* CONTENT */}
      <h1>{t("auth.welcome")}</h1>
      <p>{t("auth.question")}</p>

      {loading ? (
        <div className="loading-indicator">
          <p>{t("auth.loading")}</p>
        </div>
      ) : (
        <div className="auth-buttons">
          <button onClick={handleRegister} className="auth-btn">
            {t("auth.register")}
          </button>

          <button onClick={handleLogin} className="auth-btn">
            {t("auth.login")}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default AuthChoice;