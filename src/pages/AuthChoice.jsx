                                                                                                                                                                                                                                                  // src/pages/AuthChoice.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./AuthChoice.css"; // Tu peux styliser ça comme tu veux

const AuthChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-choice-container">
      <h1>Bienvenue 👋</h1>
      <p>Que souhaites-tu faire ?</p>
      <div className="auth-buttons">
        <button onClick={() => navigate("/register")}>S’inscrire</button>
        <button onClick={() => navigate("/login")}>Se connecter</button>
      </div>
    </div>
  );
};

export default AuthChoice;
