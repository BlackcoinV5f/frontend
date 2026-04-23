// src/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// langues RTL supportées
const rtlLanguages = ['ar', 'he', 'fa'];

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // langue par défaut (fallback)
    fallbackLng: 'en',

    // langues supportées
    supportedLngs: ['fr', 'en', 'es', 'ar'],

    // namespaces (important pour scaler)
    ns: ['translation'],
    defaultNS: 'translation',

    // détection de langue améliorée
    detection: {
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    // chargement des fichiers JSON
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // interpolation
    interpolation: {
      escapeValue: false, // React protège déjà contre XSS
    },

    // React config
    react: {
      useSuspense: true,
    },
  });

// gestion direction RTL / LTR
i18n.dir = (lng = i18n.language) =>
  rtlLanguages.includes(lng) ? 'rtl' : 'ltr';

export default i18n;