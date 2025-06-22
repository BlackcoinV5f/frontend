// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaRegCalendarCheck } from "react-icons/fa";

import "./Home.css";
import "../styles/DinoLauncher.css";

import MiningCircle from "../components/MiningCircle";
import CryptoList from "../components/CryptoList";
import dinoIcon from "../assets/DinoGame/dino-icon.png";

const Home = ({ points, setPoints, level, setLevel }) => {
  return (
    <div className="home">
      {/* 🎮 Dino Game */}
      <div className="dino-launcher">
        <Link to="/dino">
          <img src={dinoIcon} alt="Play Dino Game" />
        </Link>
      </div>

      {/* 📅 Bouton calendrier en haut à gauche */}
      <Link to="/daily" className="calendar-button" title="Récompense quotidienne">
        <FaRegCalendarCheck />
      </Link>

      {/* 💰 Liste des cryptos */}
      <CryptoList />

      {/* ⛏️ Cercle de minage */}
      <MiningCircle
        points={points}
        setPoints={setPoints}
        level={level}
        setLevel={setLevel}
      />
    </div>
  );
};

export default Home;
