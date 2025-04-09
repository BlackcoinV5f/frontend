import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL; // URL du backend

const AuthTelegram = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initData = urlParams.get("tgAuth"); // Données Telegram après connexion

    if (!initData) {
      console.error("Aucune donnée Telegram reçue.");
      navigate("/");
      return;
    }

    const authenticateUser = async () => {
      try {
        const response = await axios.post(`${API_URL}/auth/telegram`, { initData });

        if (response.data.success) {
          const userData = response.data.user;

          // ✅ Stocker les infos utilisateur dans localStorage
          localStorage.setItem("telegramUser", JSON.stringify(userData));

          // ✅ Rediriger vers l'accueil
          navigate("/");
        } else {
          console.error("Erreur d'authentification:", response.data.message);
          navigate("/");
        }
      } catch (error) {
        console.error("Erreur de connexion à Telegram:", error);
        navigate("/");
      }
    };

    authenticateUser();
  }, [navigate]);

  return <p>Connexion en cours...</p>;
};

export default AuthTelegram;
