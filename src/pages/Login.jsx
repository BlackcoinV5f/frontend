import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanedTelegram = telegramUsername.trim().replace(/^@/, "");

    if (!cleanedTelegram) {
      setError("Le nom d'utilisateur Telegram est requis.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          telegram_username: cleanedTelegram,
        }),
      });

      const result = await response.json();

      if (response.status === 202) {
        // Utilisateur non encore vérifié
        localStorage.setItem("emailToVerify", email);
        navigate("/validation");
        return;
      }

      if (!response.ok) {
        throw new Error(result.detail || "Erreur lors de la connexion.");
      }

      // Connexion réussie
      localStorage.setItem("accessToken", result.access_token);
      localStorage.setItem("isAuthenticated", "true");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Connexion</h2>

        <label htmlFor="email">Adresse e-mail</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="email@example.com"
        />

        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />

        <label htmlFor="telegram">Nom d’utilisateur Telegram</label>
        <input
          id="telegram"
          type="text"
          value={telegramUsername}
          onChange={(e) => setTelegramUsername(e.target.value)}
          required
          placeholder="@tonusername (le @ sera ignoré)"
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
