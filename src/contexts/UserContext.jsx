import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState(null);
  const [telegramInfo, setTelegramInfo] = useState(null);

  // Chargement initial depuis localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('userData');
      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed.user || null);
        setIsVerified(!!parsed.isVerified);
        setTelegramInfo(parsed.telegramInfo || null);
      }
    } catch (err) {
      console.error("Erreur de chargement du contexte utilisateur :", err);
    }
  }, []);

  // Sauvegarde automatique des changements
  useEffect(() => {
    if (user) {
      localStorage.setItem('userData', JSON.stringify({
        user,
        isVerified,
        telegramInfo
      }));
    }
  }, [user, isVerified, telegramInfo]);

  // Fonction d'inscription
  const registerUser = async (userData, navigateFn = navigate) => {
    try {
      // Étape 1 : validation des champs requis
      const requiredFields = [
        'first_name', 'last_name', 'birthdate',
        'phone', 'telegramUsername', 'email', 'password'
      ];

      for (const field of requiredFields) {
        if (!userData[field]) {
          throw new Error(`Le champ ${field} est requis.`);
        }
      }

      // Étape 2 : création du payload pour le backend
      const payload = {
        first_name: userData.first_name,
        last_name: userData.last_name,
        birthdate: userData.birthdate,
        phone: userData.phone,
        telegram_username: userData.telegramUsername, // normalisé pour le backend
        email: userData.email,
        password: userData.password,
      };

      console.log("Envoi du payload d'inscription :", payload);

      // Étape 3 : requête vers le backend
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/register`,
        payload
      );

      alert(data.message || "Inscription réussie. Vérifie ton email.");

      // Étape 4 : sauvegarde temporaire utilisateur non vérifié
      localStorage.setItem('unverifiedUser', JSON.stringify({
        ...userData,
        verified: false,
        createdAt: new Date().toISOString(),
      }));

      // Étape 5 : redirection vers page de vérification
      navigateFn('/verify');

    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
      const msg = err.response?.data?.detail || err.message || "Erreur inconnue.";
      alert("Échec de l'inscription : " + msg);
    }
  };

  // Vérification locale du code (à améliorer)
  const verifyCode = (inputCode) => {
    const isValid = inputCode === verificationCode;
    if (isValid) {
      setIsVerified(true);
      localStorage.setItem('userData', JSON.stringify({
        user,
        isVerified: true,
        telegramInfo
      }));
      localStorage.removeItem('unverifiedUser');
    }
    return isValid;
  };

  // Déconnexion complète
  const logout = () => {
    setUser(null);
    setIsVerified(false);
    setVerificationCode(null);
    setTelegramInfo(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('unverifiedUser');
    navigate('/auth-choice');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isVerified,
        registerUser,
        verifyCode,
        logout,
        setUser,
        setVerificationCode,
        setTelegramInfo,
        telegramInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser doit être utilisé dans UserProvider");
  }
  return context;
};
