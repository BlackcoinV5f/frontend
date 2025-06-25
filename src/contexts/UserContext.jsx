import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

// Axios instance avec baseURL dynamique
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-7nzi.onrender.com',
});

// ➕ Ajout du token si disponible
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('telegramUser'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// 🛑 Gestion globale des erreurs
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("🔴 API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [level, setLevel] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [friends, setFriends] = useState([]);
  const [status, setStatus] = useState(null);
  const [myActions, setMyActions] = useState([]);
  const [availableActions, setAvailableActions] = useState([]);
  const [loading, setLoading] = useState(false);

  // ▶️ Initialiser user depuis localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("telegramUser"));
      if (stored) setUser(stored);
    } catch (err) {
      console.warn("🟡 Données corrompues localStorage. Reset.");
      localStorage.removeItem("telegramUser");
    }
  }, []);

  // 💾 Synchroniser user -> localStorage
  useEffect(() => {
    if (user) localStorage.setItem("telegramUser", JSON.stringify(user));
  }, [user]);

  const withLoading = async (callback) => {
    setLoading(true);
    try {
      return await callback();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("telegramUser");
  };

  // 🔐 Auth / Profil
  const registerUser = async (userData) =>
    withLoading(async () => {
      const res = await api.post('/auth/register', userData);
      setUser(res.data);
      return res.data;
    });

  const updateUser = async (telegramId, updates) =>
    withLoading(async () => {
      const res = await api.put(`/user/update/${telegramId}`, updates);
      setUser((prev) => ({ ...prev, ...res.data }));
      return res.data;
    });

  const fetchTelegramData = async (telegramData) =>
    withLoading(async () => {
      const res = await api.post('/telegram/verify', telegramData);
      setUser(res.data);
      return res.data;
    });

  const fetchUserProfile = async (telegramId) => {
    const res = await api.get(`/user/profile/${telegramId}`);
    setUser(res.data);
    return res.data;
  };

  const fetchBalance = async (telegramId) => {
    const res = await api.get(`/wallet/${telegramId}/balance`);
    return res.data?.balance ?? 0;
  };

  // 📦 Données supplémentaires
  const fetchWallet = async (telegramId) => {
    const res = await api.get(`/wallet/${telegramId}`);
    setWallet(res.data);
    return res.data;
  };

  const fetchLevel = async (telegramId) => {
    const res = await api.get(`/level/${telegramId}`);
    setLevel(res.data);
    return res.data;
  };

  const fetchRanking = async () => {
    if (ranking) return ranking;
    const res = await api.get('/ranking/top');
    setRanking(res.data);
    return res.data;
  };

  const fetchTasks = async () => {
    if (tasks.length > 0) return tasks;
    const res = await api.get('/tasks');
    setTasks(res.data);
    return res.data;
  };

  const validateTask = async (telegramId, taskId) => {
    const res = await api.post(`/tasks/validate`, { telegramId, taskId });
    return res.data;
  };

  const fetchFriends = async (telegramId) => {
    const res = await api.get(`/friends/${telegramId}`);
    setFriends(res.data);
    return res.data;
  };

  const fetchStatus = async (telegramId) => {
    const res = await api.get(`/status/${telegramId}`);
    setStatus(res.data);
    return res.data;
  };

  const fetchAvailableActions = async () => {
    if (availableActions.length > 0) return availableActions;
    const res = await api.get(`/actions`);
    setAvailableActions(res.data);
    return res.data;
  };

  const fetchUserActions = async (telegramId) => {
    const res = await api.get(`/myactions/${telegramId}`);
    setMyActions(res.data);
    return res.data;
  };

  // 📅 Fonctionnalités Quotidiennes
  const fetchDailyStreak = async (telegramId) => {
    const res = await api.get(`/daily-streak/${telegramId}`);
    return res.data; // { streak, claimed_today }
  };

  const claimDailyReward = async (telegramId) => {
    const res = await api.post(`/daily-streak/claim`, { telegram_id: telegramId });
    return res.data; // { streak, reward_points }
  };

  // ✅ États utiles globalement
  const isAuthenticated = !!user?.telegram_id;
  const isEmailVerified = !!user?.email_verified;

  return (
    <UserContext.Provider
      value={{
        user,
        wallet,
        soldeBKC: wallet?.balance, // ✅ Ajout ici
        level,
        ranking,
        tasks,
        friends,
        status,
        myActions,
        availableActions,
        loading,
        isAuthenticated,
        isEmailVerified,
        registerUser,
        updateUser,
        fetchTelegramData,
        fetchUserProfile,
        fetchWallet,
        fetchBalance,
        fetchLevel,
        fetchRanking,
        fetchTasks,
        validateTask,
        fetchFriends,
        fetchStatus,
        fetchAvailableActions,
        fetchUserActions,
        fetchDailyStreak, // ✅ Ajout ici
        claimDailyReward, // ✅ Ajout ici
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
