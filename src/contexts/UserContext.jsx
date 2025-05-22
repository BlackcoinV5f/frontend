import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState(null); // pour vérification locale éventuelle
  const [telegramInfo, setTelegramInfo] = useState(null);

  // Charger les données utilisateur au démarrage
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

  // Sauvegarder automatiquement les changements importants
  useEffect(() => {
    if (user) {
      localStorage.setItem('userData', JSON.stringify({
        user,
        isVerified,
        telegramInfo,
      }));
    }
  }, [user, isVerified, telegramInfo]);

  // Enregistrement utilisateur
  const registerUser = async (userData, navigateFn = navigate) => {
    try {
      const requiredFields = [
        'first_name',
        'last_name',
        'birthdate',
        'phone',
        'telegramUsername',
        'email',
        'password',
      ];

      for (const field of requiredFields) {
        if (!userData[field]?.trim()) {
          throw new Error(`Le champ ${field} est requis.`);
        }
      }

      const payload = {
        first_name: userData.first_name.trim(),
        last_name: userData.last_name.trim(),
        birthdate: userData.birthdate,
        phone: userData.phone.trim(),
        telegram_username: userData.telegramUsername.trim(),
        email: userData.email.trim(),
        password: userData.password,
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        payload
      );

      // Sauvegarde des données envoyées par le backend
      const userInfo = {
        id: data.user_id,
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name,
        birthdate: payload.birthdate,
        phone: payload.phone,
        telegramUsername: payload.telegram_username,
      };

      const telegram = {
        id: data.telegram_id || null,
        photo: data.telegram_photo_url || null,
      };

      setUser(userInfo);
      setTelegramInfo(telegram);
      setIsVerified(false);

      // Sauvegarde dans localStorage temporaire en attente de vérification
      localStorage.setItem('unverifiedUser', JSON.stringify({
        ...userInfo,
        verified: false,
        createdAt: new Date().toISOString(),
      }));

      navigateFn('/verify');
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
      const msg = err.response?.data?.detail || err.message || "Erreur inconnue.";
      throw new Error(msg);
    }
  };

  // Vérification du code côté frontend (à améliorer avec API réelle)
  const verifyCode = (inputCode) => {
    const isValid = inputCode === verificationCode;
    if (isValid) {
      setIsVerified(true);
      localStorage.setItem('userData', JSON.stringify({
        user,
        isVerified: true,
        telegramInfo,
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
