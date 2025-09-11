// src/components/AutoAuth.jsx
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import SplashScreen from "./SplashScreen";
import { useNavigate, useLocation } from "react-router-dom";

export default function AutoAuth({ children }) {
  const { fetchUserProfile } = useUser();
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const controller = new AbortController();

    // 🚨 Routes publiques qui ne nécessitent pas de check token
    const publicRoutes = ["/auth-choice", "/login", "/register"];

    // 👉 Si on est déjà sur une route publique → pas de vérification
    if (publicRoutes.includes(location.pathname)) {
      setChecking(false);
      return;
    }

    const init = async () => {
      try {
        const timeout = setTimeout(() => controller.abort(), 8000);

        const profile = await fetchUserProfile({ signal: controller.signal });

        clearTimeout(timeout);

        // ❌ Pas de profil → redirection vers AuthChoice
        if (!profile || !profile.id) {
          navigate("/auth-choice", { replace: true });
        }
      } catch (err) {
        console.warn("❌ Session invalide ou erreur réseau");
        navigate("/auth-choice", { replace: true });
      } finally {
        setChecking(false);
      }
    };

    init();

    return () => controller.abort();
  }, [fetchUserProfile, navigate, location]);

  if (checking) {
    return <SplashScreen message="Vérification de la session..." />;
  }

  return children;
}
