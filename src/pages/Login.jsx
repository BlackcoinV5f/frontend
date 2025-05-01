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
    setLoading(true);
    setError("");

    if (!telegramUsername.startsWith("@")) {
      setError("Le nom d'utilisateur Telegram doit commencer par @");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, telegramUsername }),
      });

      if (!res.ok) throw new Error("Échec de connexion");

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
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Se connecter</h2>
        <input
          type="email"
          placeholder="Adresse mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nom d’utilisateur Telegram"
          value={telegramUsername}
          onChange={(e) => setTelegramUsername(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Connexion"}
        </button>
        <p className="register-link">
          Pas encore de compte ?{" "}
          <span onClick={() => navigate("/register")} className="link">
            S’inscrire
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
