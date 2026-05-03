// src/pages/LandingRedirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const LandingRedirect = () => {
  const navigate = useNavigate();
  const {
    user,
    loading,
    isAuthenticated,
    isEmailVerified,
    fetchUserProfile,
  } = useUser();

  useEffect(() => {
    const go = async () => {
      if (loading) return;

      try {
        let currentUser = user;

        // 🔄 hydrater si nécessaire
        if (!currentUser) {
          currentUser = await fetchUserProfile();
          if (!currentUser) {
            navigate("/auth-choice", { replace: true });
            return;
          }
        }

        // 🔥 IMPORTANT : on supprime le bypass dangereux
        sessionStorage.removeItem("justLoggedIn");

        // 🔐 logique complète
        if (!isAuthenticated) {
          navigate("/auth-choice", { replace: true });
          return;
        }

        if (!isEmailVerified) {
          navigate("/verify-email", { replace: true });
          return;
        }

        // 🚨 CRITIQUE : welcome obligatoire
        if (!currentUser.has_completed_welcome_tasks) {
          navigate("/welcome", { replace: true });
          return;
        }

        // ✅ accès normal
        navigate("/home", { replace: true });

      } catch (err) {
        console.error("Erreur dans LandingRedirect :", err);
        navigate("/auth-choice", { replace: true });
      }
    };

    go();
  }, [user, loading, isAuthenticated, isEmailVerified, fetchUserProfile, navigate]);

  return null;
};

export default LandingRedirect;