// src/contexts/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

// ✅ Axios instance avec baseURL dynamique
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-7nzi.onrender.com',
});

// 🔐 Ajouter token si nécessaire (future sécurité)
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('telegramUser'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// ❗ Gestion globale des erreurs
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

  // ✅ Chargement initial depuis localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("telegramUser"));
      if (stored) setUser(stored);
    } catch (err) {
      localStorage.removeItem("telegramUser");
    }
  }, []);

  // ✅ Sauvegarde automatique dans localStorage
  useEffect(() => {
    if (user) localStorage.setItem("telegramUser", JSON.stringify(user));
  }, [user]);

  // 🧠 Utilitaire de chargement
  const withLoading = async (callback) => {
    setLoading(true);
    try {
      return await callback();
    } finally {
      setLoading(false);
    }
  };

  // UserContext.jsx (extrait modifié)
const fetchTelegramData = async (initData) =>
  withLoading(async () => {
    const res = await api.post('/auth/telegram/init', initData);
    // res.data = { isNew: bool, user: {...} }
    setUser(res.data.user); // on stocke juste l'objet user
    if (res.data.isNew) {
      navigate("/welcome");
    } else {
      navigate("/"); // page principale, adapte si besoin
    }
    return res.data.user;
  });

  // ✅ Récupération des infos complètes d’un utilisateur (depuis son ID)
  const fetchUserProfile = async (telegramId) =>
    withLoading(async () => {
      const res = await api.get(`/auth/profile/${telegramId}`);
      setUser(res.data);
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
        fetchUserProfile, // 👈 ajouté ici
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
