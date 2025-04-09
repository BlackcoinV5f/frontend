// src/components/DinoLauncher.jsx

import React, { useState } from "react";
import "./DinoLauncher.css";
import dinoSprite from "../assets/dino-sprite.png";
import DinoGame from "./DinoGame";

const DinoLauncher = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div>
      {/* Logo du Dino */}
      <div
        className="dino-container"
        onClick={handleToggle}
        style={{ backgroundImage: `url(${dinoSprite})` }}
      >
        <div className="dino-runner" />
      </div>

      {/* Modal du jeu */}
      {open && (
        <div className="dino-modal">
          <div className="dino-modal-content">
            <button className="close-btn" onClick={handleToggle}>
              ✕
            </button>
            <DinoGame />
          </div>
        </div>
      )}
    </div>
  );
};

export default DinoLauncher;