// src/contexts/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

// ✅ Axios avec baseURL dynamique
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-7nzi.onrender.com',
});

// 🔐 Ajoute token si présent (optionnel ici, pour futur)
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('telegramUser'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// ❗ Gestion des erreurs
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("🔴 API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Init depuis localStorage (au cas où)
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("telegramUser"));
      if (stored) setUser(stored);
    } catch (err) {
      localStorage.removeItem("telegramUser");
    }
  }, []);

  // ✅ Synchro localStorage à chaque changement utilisateur
  useEffect(() => {
    if (user) localStorage.setItem("telegramUser", JSON.stringify(user));
  }, [user]);

  // 🧠 Wrapper loading
  const withLoading = async (callback) => {
    setLoading(true);
    try {
      return await callback();
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auth via Telegram (appel au backend)
  const fetchTelegramData = async (telegramData) =>
    withLoading(async () => {
      const res = await api.post('/auth/telegram', telegramData);
      const { isNew, ...userData } = res.data;
      setUser(userData);

      // 🚀 Rediriger si nouvel utilisateur
      if (isNew) {
        navigate("/welcome");
      }

      return res.data;
    });

  // 🔓 Déconnexion
  const logout = () => {
    setUser(null);
    localStorage.removeItem("telegramUser");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user?.telegram_id,
        fetchTelegramData,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
