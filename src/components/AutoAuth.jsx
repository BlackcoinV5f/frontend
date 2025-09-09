// src/components/AutoAuth.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import SplashScreen from "./SplashScreen";

export default function AutoAuth({ children }) {
  const { fetchUserProfile, logoutUser } = useUser();
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Identifie la source de la requête
  const getAccessSource = () => {
    if (window?.Telegram?.WebApp) return "telegram";
    return "my_app"; // sinon c’est ton app officielle
  };

  useEffect(() => {
    const controller = new AbortController();

    const safeRedirect = () => {
      if (location.pathname !== "/auth-choice") {
        navigate("/auth-choice", { replace: true });
      }
    };

    const init = async () => {
      try {
        const initData = window?.Telegram?.WebApp?.initData || "";
        const source = getAccessSource();

        // Timeout de sécurité
        const timeout = setTimeout(() => controller.abort(), 8000);

        // ✅ On envoie automatiquement les headers requis
        const profile = await fetchUserProfile({
          signal: controller.signal,
          headers: {
            "X-Access-Source": source,
            "X-Telegram-InitData": initData,
          },
        });

        clearTimeout(timeout);

        if (!profile || !profile.id) {
          await logoutUser(false);
          safeRedirect();
        }
      } catch (err) {
        if (err.name === "AbortError") {
          console.warn("⏳ Vérification de session expirée");
        } else {
          console.warn("❌ Session invalide ou erreur réseau");
        }
        await logoutUser(false);
        safeRedirect();
      } finally {
        setChecking(false);
      }
    };

    init();
    return () => controller.abort();
  }, [fetchUserProfile, logoutUser, navigate, location.pathname]);

  if (checking) {
    return <SplashScreen message="Vérification de la session..." />;
  }

  return children;
}
