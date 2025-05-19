import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const telegramData = window.Telegram?.WebApp?.initDataUnsafe;
      if (telegramData?.user) {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/telegram`,
          {
            id: telegramData.user.id,
            first_name: telegramData.user.first_name,
            last_name: telegramData.user.last_name,
            username: telegramData.user.username,
            photo_url: telegramData.user.photo_url,
            hash: window.Telegram.WebApp.initData
          }
        );

        if (response.data.success) {
          setUser(response.data.user);
          localStorage.setItem("telegramUser", JSON.stringify(response.data.user));
        } else {
          setUser(null);
          localStorage.removeItem("telegramUser");
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Erreur d'authentification :", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
