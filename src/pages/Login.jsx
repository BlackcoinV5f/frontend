import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // <-- ajoute ça

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/login", {
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
      alert("Erreur : " + err.message);
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
        <button type="submit">Connexion</button>
      </form>
    </div>
  );
};

export default Login;
