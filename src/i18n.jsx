// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      register: {
        title: "Création de compte",
        personalInfo: "Informations personnelles",
        firstName: "Prénom",
        lastName: "Nom",
        birthDate: "Date de naissance",
        phoneNumber: "Numéro de téléphone",
        email: "Email",
        password: "Mot de passe",
        confirmPassword: "Confirmation du mot de passe",
        submit: "Créer mon compte",
        terms: "Conditions d'utilisation",
        privacy: "Politique de confidentialité",
        // Ajouter toutes les autres chaînes françaises
      }
    }
  },
  en: {
    translation: {
      register: {
        title: "Create Account",
        personalInfo: "Personal Information",
        firstName: "First Name",
        lastName: "Last Name",
        // ... toutes les autres chaînes anglaises
      }
    }
  },
  es: {
    translation: {
      register: {
        title: "Crear cuenta",
        personalInfo: "Información personal",
        firstName: "Nombre",
        // ... toutes les chaînes espagnoles
      }
    }
  },
  ar: {
    translation: {
      register: {
        title: "إنشاء حساب",
        personalInfo: "معلومات شخصية",
        firstName: "الاسم الأول",
        // ... toutes les chaînes arabes
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en', 'es', 'ar'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

// Ajouter la méthode dir personnalisée
i18n.dir = (lng = i18n.language) => {
  return lng === 'ar' ? 'rtl' : 'ltr';
};

export default i18n;