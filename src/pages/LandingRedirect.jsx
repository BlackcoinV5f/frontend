// src/pages/LandingRedirect.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const LandingRedirect = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated, isEmailVerified, fetchUserProfile } = useUser();

  useEffect(() => {
    const go = async () => {
      if (loading) return;

      try {
        // Si pas d’utilisateur en mémoire → tenter d’hydrater via cookie
        if (!user) {
          const u = await fetchUserProfile();
          if (!u) {
            navigate("/auth-choice", { replace: true });
            return;
          }
        }

        // Si on vient JUSTE de se connecter, on force /home
        if (sessionStorage.getItem("justLoggedIn") === "1") {
          sessionStorage.removeItem("justLoggedIn");
          navigate("/home", { replace: true });
          return;
        }

        // Sinon, logique d’atterrissage
        if (!isAuthenticated) {
          navigate("/auth-choice", { replace: true });
        } else if (!isEmailVerified) {
          navigate("/verify-email", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
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
