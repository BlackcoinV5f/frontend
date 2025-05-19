import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import "./AuthChoice.css";

const AuthChoice = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  useEffect(() => {
    // Redirige vers la page d'accueil si l'utilisateur est déjà connecté
    if (!loading && user) {
      navigate("/"); // Redirige vers l'accueil
    }
  }, [user, loading, navigate]);

  return (
    <motion.div
      className="auth-choice-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1>Bienvenue sur BlackCoin 🪙</h1>
      <p>Que souhaites-tu faire ?</p>

      {loading ? (
        // Affiche un indicateur de chargement pendant que les données se chargent
        <div className="loading-indicator">
          <p>Chargement...</p>
        </div>
      ) : (
        <div className="auth-buttons">
          <button
            onClick={() => navigate("/register")}
            title="Créer un compte"
            aria-label="S’inscrire"
          >
            S’inscrire
          </button>
          <button
            onClick={() => navigate("/login")}
            title="Se connecter"
            aria-label="Se connecter"
          >
            Se connecter
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default AuthChoice;
