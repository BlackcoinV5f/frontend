import React, { useState } from "react";
import "./DinoLauncher.css";
import dinoLogo from "../assets/dinoGame/dino.gif";
import DinoGame from "./DinoGame";

const DinoLauncher = () => {
  const [showGame, setShowGame] = useState(false);

  const handleClick = () => {
    setShowGame(true);
  };

  const handleClose = () => {
    setShowGame(false);
  };

  return (
    <>
      <div className="dino-launcher" onClick={handleClick}>
        <img src={dinoLogo} alt="Play Dino Game" />
      </div>

      {showGame && (
        <div className="dino-modal">
          <div className="dino-modal-content">
            <button className="close-btn" onClick={handleClose}>×</button>
            <DinoGame />
          </div>
        </div>
      )}
    </>
  );
};

export default DinoLauncher;
