import { useState } from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = (userData) => {
    sessionStorage.setItem("telegramUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem("telegramUser");
    setUser(null);
  };

  const checkAuth = async () => {
    try {
      const telegram = window.Telegram?.WebApp;
      const localData = sessionStorage.getItem("telegramUser");

      if (!telegram?.initDataUnsafe?.user && !localData) {
        setLoading(false);
        return;
      }

      if (localData) {
        setUser(JSON.parse(localData));
        setLoading(false);
        return;
      }

      const initData = telegram.initData;
      const userId = telegram.initDataUnsafe.user?.id;

      if (!userId) throw new Error("Utilisateur Telegram non identifié");

      const res = await fetch(`${API_URL}/auth/telegram`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ initData }),
      });

      if (!res.ok) throw new Error("Échec de l'authentification");

      const authData = await res.json();
      login(authData);
    } catch (err) {
      setError(err.message || "Erreur lors de la vérification");
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, login, logout, checkAuth };
};
