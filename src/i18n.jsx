// src/i18n.js

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

// langues RTL supportées
const rtlLanguages = ["ar", "he", "fa"];

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // langue fallback
    fallbackLng: "en",

    // langues supportées
    supportedLngs: ["fr", "en", "es", "ar"],

    // ✅ NAMESPACES CORRIGÉS
    ns: [
      "premium",     // ✅ remplace "action"
      "friends",
      "game",
      "info",
      "login",
      "profil",
      "tasks",
      "transation"
    ],

    // namespace par défaut
    defaultNS: "info",

    // détection langue
    detection: {
      order: ["querystring", "localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },

    // chargement fichiers
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    // interpolation
    interpolation: {
      escapeValue: false,
    },

    // React config
    react: {
      useSuspense: false,
    },

    debug: false,
  });

// gestion RTL / LTR
i18n.dir = (lng = i18n.language) => {
  const lang = lng.split("-")[0];
  return rtlLanguages.includes(lang) ? "rtl" : "ltr";
};

export default i18n;