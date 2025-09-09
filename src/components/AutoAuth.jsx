// src/components/AutoAuth.jsx
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import SplashScreen from "./SplashScreen"; // réutilisation cohérente

export default function AutoAuth({ children }) {
  const { fetchUserProfile, logoutUser } = useUser();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const init = async () => {
      try {
        // ✅ Timeout de sécurité
        const timeout = setTimeout(() => controller.abort(), 8000);

        const profile = await fetchUserProfile({ signal: controller.signal });

        clearTimeout(timeout);

        // ✅ Vérification stricte de l’objet utilisateur
        if (!profile || !profile.id) {
          await logoutUser();
        }
      } catch (err) {
        if (err.name === "AbortError") {
          console.warn("⏳ Vérification de session expirée");
        } else {
          console.warn("❌ Session invalide ou erreur réseau");
        }
        await logoutUser();
      } finally {
        setChecking(false);
      }
    };

    init();

    return () => controller.abort(); // cleanup en cas d’unmount
  }, [fetchUserProfile, logoutUser]);

  if (checking) {
    // 🎨 Tu peux afficher un vrai splash screen animé ici
    return <SplashScreen message="Vérification de la session..." />;
  }

  return children;
}
