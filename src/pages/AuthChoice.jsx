// src/components/AuthChoice.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import "./AuthChoice.css";

const AuthChoice = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  useEffect(() => {
    console.log("✅ AuthChoice monté");
    if (!loading && user) {
      console.log("🔁 Utilisateur connecté, redirection vers /");
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleRegister = () => {
    console.log("➡️ Redirection vers /register");
    navigate("/register");
  };

  const handleLogin = () => {
    console.log("➡️ Redirection vers /login");
    navigate("/login");
  };

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
        <div className="loading-indicator">
          <p>Chargement...</p>
        </div>
      ) : (
        <div className="auth-buttons">
          <button
            type="button"
            onClick={handleRegister}
            className="auth-btn"
          >
            S’inscrire
          </button>
          <button
            type="button"
            onClick={handleLogin}
            className="auth-btn"
          >
            Se connecter
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default AuthChoice;
