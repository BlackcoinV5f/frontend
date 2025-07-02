// src/contexts/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://backend-7nzi.onrender.com',
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('telegramUser'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

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

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("telegramUser"));
      if (stored) setUser(stored);
    } catch (err) {
      localStorage.removeItem("telegramUser");
    }
  }, []);

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

  const fetchTelegramData = async (initData) =>
    withLoading(async () => {
      const res = await api.post('/auth/telegram/init', initData);
      setUser(res.data.user);
      if (res.data.isNew) {
        navigate("/welcome");
      } else {
        navigate("/");
      }
      return res.data.user;
    });

  const fetchUserProfile = async (telegramId) =>
    withLoading(async () => {
      const res = await api.get(`/auth/profile/${telegramId}`);
      setUser(res.data);
      return res.data;
    });

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
        fetchUserProfile,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
