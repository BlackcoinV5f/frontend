// src/pages/Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import MiningCircle from "../components/MiningCircle";

import ActionsLogoImg from "../assets/ActionsLogo.png";
import LuckyGameLogoImg from "../assets/LuckyGameLogo.png";
import TradeGameLogoImg from "../assets/TradeGameLogo.png";
import BonusLogoImg from "../assets/BonusLogo.png";
import AirdropLogoImg from "../assets/AirdropLogo.png";
import BlackAiLogoImg from "../assets/BlackAiLogo.png";

import "./Home.css";

const Home = ({ points, setPoints, level, setLevel }) => {
  const navigate = useNavigate();
  const { loading } = useUser();

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Chargement en cours...</p>
      </div>
    );
  }

  return (
    <div className="home">

      {/* 🎁 BONUS */}
      <button
        type="button"
        className="logo-button bonus-logo"
        onClick={() => handleNavigate("/bonus")}
      >
        <img src={BonusLogoImg} alt="Bonus" />
      </button>

      {/* 🖤 BLACK AI */}
      <button
        type="button"
        className="logo-button blackai-logo"
        onClick={() => handleNavigate("/black-ai")}
      >
        <img src={BlackAiLogoImg} alt="BlackAI" />
      </button>

      {/* ⛏️ MINING */}
      <div className="mining-container">
        <MiningCircle
          points={points}
          setPoints={setPoints}
          level={level}
          setLevel={setLevel}
        />
      </div>

      {/* 📦 COLONNE DROITE */}
      <div className="logos-container">

        <button
          type="button"
          className="logo-button"
          onClick={() => handleNavigate("/airdrop")}
        >
          <img src={AirdropLogoImg} alt="Airdrop" />
        </button>

        <button
          type="button"
          className="logo-button"
          onClick={() => handleNavigate("/lucky-game")}
        >
          <img src={LuckyGameLogoImg} alt="Lucky Game" />
        </button>

        <button
          type="button"
          className="logo-button"
          onClick={() => handleNavigate("/trade-game")}
        >
          <img src={TradeGameLogoImg} alt="Trade Game" />
        </button>

        <button
          type="button"
          className="logo-button"
          onClick={() => handleNavigate("/actions")}
        >
          <img src={ActionsLogoImg} alt="Actions" />
        </button>

      </div>
    </div>
  );
};

export default Home;