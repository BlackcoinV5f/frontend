import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
// Optional: import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!telegramUsername.startsWith("@")) {
      setError("Ton nom d'utilisateur Telegram doit commencer par @");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, telegramUsername }),
      });

      if (!res.ok) throw new Error("Identifiants incorrects ou utilisateur inconnu");

      const userData = await res.json();
      localStorage.setItem("telegramUser", JSON.stringify(userData));
      localStorage.setItem("isRegistered", "true");

      navigate("/");
    } catch (err) {
      setError("Erreur : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* <motion.form ...> si framer-motion activé */}
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Connexion</h2>

        <label htmlFor="email">Adresse e-mail</label>
        <input
          id="email"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="telegram">Nom d’utilisateur Telegram</label>
        <input
          id="telegram"
          type="text"
          placeholder="@tonusername"
          value={telegramUsername}
          onChange={(e) => setTelegramUsername(e.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Connexion en cours..." : "Se connecter"}
        </button>

        <p className="register-link">
          Pas encore inscrit ?{" "}
          <span className="link" onClick={() => navigate("/register")}>
            Créer un compte
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
