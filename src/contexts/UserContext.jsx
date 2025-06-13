// src/context/UserContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

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

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  });

  // ⬇️ Chargement localStorage au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem("telegramUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // ⬇️ Sync user -> localStorage
  useEffect(() => {
    if (user) localStorage.setItem("telegramUser", JSON.stringify(user));
  }, [user]);

  // ⬇️ Fonction générique pour setLoading
  const withLoading = async (callback) => {
    setLoading(true);
    try {
      return await callback();
    } finally {
      setLoading(false);
    }
  };

  // ⬇️ Auth & profil
  const registerUser = async (userData) => {
    return withLoading(async () => {
      const res = await api.post('/auth/register', userData);
      setUser(res.data);
      return res.data;
    });
  };

  const updateUser = async (telegramId, updates) => {
    return withLoading(async () => {
      const res = await api.put(`/user/update/${telegramId}`, updates);
      setUser(res.data);
      return res.data;
    });
  };

  const fetchTelegramData = async (telegramData) => {
    return withLoading(async () => {
      const res = await api.post('/telegram/verify', telegramData);
      setUser(res.data);
      return res.data;
    });
  };

  const fetchUserProfile = async (telegramId) => {
    const res = await api.get(`/user/profile/${telegramId}`);
    setUser(res.data);
    return res.data;
  };

  // ⬇️ Données associées
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
    const res = await api.get('/ranking/top');
    setRanking(res.data);
    return res.data;
  };

  const fetchTasks = async () => {
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
    const res = await api.get(`/actions`);
    setAvailableActions(res.data);
    return res.data;
  };

  const fetchUserActions = async (telegramId) => {
    const res = await api.get(`/myactions/${telegramId}`);
    setMyActions(res.data);
    return res.data;
  };

  const isAuthenticated = !!user?.telegram_id;
  const isEmailVerified = !!user?.email_verified;

  return (
    <UserContext.Provider
      value={{
        user,
        wallet,
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
        fetchLevel,
        fetchRanking,
        fetchTasks,
        validateTask,
        fetchFriends,
        fetchStatus,
        fetchAvailableActions,
        fetchUserActions,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
