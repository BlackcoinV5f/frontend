import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DinoLauncher.css";

// Import des assets
import roadImg from "../assets/DinoGame/road.png";
import dinoGif from "../assets/DinoGame/dino.gif";
import cactus1 from "../assets/DinoGame/cactus1.png";
import cactus2 from "../assets/DinoGame/cactus2.png";
import cactus3 from "../assets/DinoGame/cactus3.png";
import cactus4 from "../assets/DinoGame/cactus4.png";
import cactus5 from "../assets/DinoGame/cactus5.png";
import cactus6 from "../assets/DinoGame/cactus6.png";
import cactus7 from "../assets/DinoGame/cactus7.png";
import cactus8 from "../assets/DinoGame/cactus8.png";

const cactusImages = [
  cactus1,
  cactus2,
  cactus3,
  cactus4,
  cactus5,
  cactus6,
  cactus7,
  cactus8,
];

const DinoGame = () => {
  const navigate = useNavigate();
  const [obstacles, setObstacles] = useState([]);
  const [isJumping, setIsJumping] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const dinoRef = useRef(null);

  // Génère des obstacles à intervalles réguliers
  useEffect(() => {
    let obstacleInterval;
    if (gameStarted) {
      obstacleInterval = setInterval(() => {
        const randomObstacle =
          cactusImages[Math.floor(Math.random() * cactusImages.length)];
        setObstacles((prev) => [
          ...prev,
          {
            id: Date.now(),
            img: randomObstacle,
            left: 1000,
          },
        ]);
      }, 2000);
    }
    return () => clearInterval(obstacleInterval);
  }, [gameStarted]);

  // Fait avancer les obstacles
  useEffect(() => {
    let moveInterval;
    if (gameStarted) {
      moveInterval = setInterval(() => {
        setObstacles((prev) =>
          prev
            .map((obs) => ({
              ...obs,
              left: obs.left - 5,
            }))
            .filter((obs) => obs.left > -50)
        );
      }, 20);
    }
    return () => clearInterval(moveInterval);
  }, [gameStarted]);

  // Gérer le saut du dinosaure
  const handleJump = () => {
    if (!gameStarted) setGameStarted(true);
    if (!isJumping && dinoRef.current) {
      setIsJumping(true);
      dinoRef.current.classList.add("jump");
      setTimeout(() => {
        dinoRef.current.classList.remove("jump");
        setIsJumping(false);
      }, 700); // durée du saut
    }
  };

  // Fermer le jeu
  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="dino-game">
      {/* Bouton Fermer */}
      <button className="close-btn" onClick={handleClose}>×</button>

      <div className="dino-game-background">
        <div className="ground" style={{ backgroundImage: `url(${roadImg})` }}></div>

        {/* Dinosaure */}
        <div className="dino-character" ref={dinoRef}>
          <img src={dinoGif} alt="Dino" />
        </div>

        {/* Obstacles */}
        {obstacles.map((obs) => (
          <div key={obs.id} className="obstacle" style={{ left: `${obs.left}px` }}>
            <img src={obs.img} alt="Obstacle" />
          </div>
        ))}
      </div>

      {/* Bouton Lancer / Sauter */}
      <button className="jump-btn" onClick={handleJump}>
        {gameStarted ? "Jump" : "Start Game"}
      </button>
    </div>
  );
};

export default DinoGame;
