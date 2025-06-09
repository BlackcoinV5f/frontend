import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Charge les données utilisateur au démarrage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('userData'));
      if (saved) {
        setUser(saved.user || null);
        setIsVerified(!!saved.isVerified);
      }
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
      const msg = err.message || "Erreur inconnue.";
      setError(msg);
    }
  }, []);

  // ✅ Sauvegarde automatiquement quand les données changent
  useEffect(() => {
    if (user) {
      localStorage.setItem('userData', JSON.stringify({ user, isVerified }));
    }
  }, [user, isVerified]);

  // 🔧 Convertit une date MM-DD-YYYY en format ISO YYYY-MM-DD
  const formatDateToISO = (mmddyyyy) => {
    if (!mmddyyyy || typeof mmddyyyy !== "string") return "";
    const [month, day, year] = mmddyyyy.split("-");
    if (!year || !month || !day) return "";
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // ✅ Enregistre un nouvel utilisateur
  const registerUser = async (userData, navigateFn = navigate) => {
    try {
      setIsLoading(true);
      setError(null);

      const payload = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        birth_date: userData.birth_date,
        phone: userData.phone,
        email: userData.email,
        password: userData.password,
        confirm_password: userData.confirm_password,
      };

      console.log("Payload final :", payload);

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/register`,
        payload
      );

      alert(data.message || "Inscription réussie. Vérifie ton email.");

      localStorage.setItem('unverifiedUser', JSON.stringify({
        ...userData,
        verified: false,
        createdAt: new Date().toISOString()
      }));

      navigateFn('/verify');
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
      const msg = err.response?.data?.detail || err.message || "Erreur inconnue.";
      setError(msg);
      alert("Échec de l'inscription : " + msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Vérifie le code reçu par email
  const verifyCode = async (inputCode, navigateFn = navigate) => {
    try {
      setIsLoading(true);
      setError(null);

      const unverified = JSON.parse(localStorage.getItem('unverifiedUser')) || {};
      const { email } = unverified;
      if (!email) throw new Error("Email introuvable dans le stockage local.");

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/verify-code`,
        { email, code: inputCode }
      );

      const { user } = response.data;

      setUser(user);
      setIsVerified(true);

      localStorage.setItem(
        'userData',
        JSON.stringify({ user, isVerified: true })
      );

      localStorage.removeItem('unverifiedUser');
      navigateFn('/home');
      return true;
    } catch (err) {
      console.error("Échec de la vérification :", err);
      const msg = err.response?.data?.detail || err.message || "Erreur de vérification.";
      setError(msg);
      alert(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Déconnecte l'utilisateur
  const logout = () => {
    setUser(null);
    setIsVerified(false);
    setError(null);
    setIsLoading(false);

    localStorage.removeItem('userData');
    localStorage.removeItem('unverifiedUser');
    navigate('/auth-choice');
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isVerified,
        isLoading,
        error,
        registerUser,
        verifyCode,
        logout,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// ✅ Hook personnalisé pour accéder au contexte
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser doit être utilisé dans un UserProvider");
  }
  return context;
};
