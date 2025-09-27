// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import "./Login.css";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { loginUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!emailOrUsername.trim()) {
        throw new Error("Veuillez saisir votre email ou nom d’utilisateur.");
      }
      if (!password) {
        throw new Error("Veuillez saisir votre mot de passe.");
      }

      // Déterminer si c'est un email ou un username
      const isEmail = emailOrUsername.includes("@");

      // Appel login via UserContext (les cookies sont gérés par le backend)
      await loginUser({
        email: isEmail ? emailOrUsername.trim() : undefined,
        username: !isEmail ? emailOrUsername.trim() : undefined,
        password,
      });

      // Redirection après succès
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Erreur login :", err);

      // Gestion rigoureuse des messages d'erreur
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Échec de la connexion. Vérifiez vos identifiants.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Connexion</h2>

        <label htmlFor="emailOrUsername">Email ou Nom d’utilisateur</label>
        <input
          id="emailOrUsername"
          type="text"
          placeholder="email@example.com ou nom_utilisateur"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
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
