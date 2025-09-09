// src/components/AutoAuth.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import SplashScreen from "./SplashScreen";

export default function AutoAuth({ children }) {
  const { fetchUserProfile, logoutUser } = useUser();
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // ✅ nouvel état
  const navigate = useNavigate();
  const location = useLocation();

  const getAccessSource = () => {
    if (window?.Telegram?.WebApp) return "telegram";
    return "my_app";
  };

  useEffect(() => {
    const controller = new AbortController();

    const init = async () => {
      try {
        const initData = window?.Telegram?.WebApp?.initData || "";
        const source = getAccessSource();

        const timeout = setTimeout(() => controller.abort(), 8000);

        const profile = await fetchUserProfile({
          signal: controller.signal,
          headers: {
            "X-Access-Source": source,
            "X-Telegram-InitData": initData,
          },
        });

        clearTimeout(timeout);

        if (profile && profile.id) {
          setIsAuthenticated(true); // ✅ session valide
        } else {
          await logoutUser(false);
          setIsAuthenticated(false);
        }
      } catch (err) {
        await logoutUser(false);
        setIsAuthenticated(false);
      } finally {
        setChecking(false);
      }
    };

    init();
    return () => controller.abort();
  }, [fetchUserProfile, logoutUser]);

  // ⏳ Pendant la vérif
  if (checking) {
    return <SplashScreen message="Vérification de la session..." />;
  }

  // ❌ Pas authentifié → redirection sauf si déjà sur /auth-choice
  if (!isAuthenticated && location.pathname !== "/auth-choice") {
    navigate("/auth-choice", { replace: true });
    return null;
  }

  // ✅ Session OK ou déjà sur /auth-choice
  return children;
}
