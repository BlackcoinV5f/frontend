// src/components/LuckyGameLogo.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./LuckyGameLogo.css";

export default function LuckyGameLogo() {
  return (
    <div className="lucky-game-logo">
      <Link to="/lucky-game" aria-label="Ouvrir le jeu Lucky">
        <div className="logo-container">
          <div className="logo" aria-hidden="true">
            <span className="x1">X</span>
            <span className="x2">x</span>
            <span className="number">1000</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
