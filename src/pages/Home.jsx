// src/pages/Home.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import MiningCircle from "../components/MiningCircle";

import ActionsLogoImg from "../assets/ActionsLogo.png";
import LuckyGameLogoImg from "../assets/LuckyGameLogo.png";
import TradeGameLogoImg from "../assets/TradeGameLogo.png";
import BonusLogoImg from "../assets/BonusLogo.png";

import "./Home.css";

const Home = ({ points, setPoints, level, setLevel }) => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useUser();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth-choice", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Chargement en cours...</p>
      </div>
    );
  }

  return (
    <div className="home">

      {/* BONUS À GAUCHE */}
      <img
        src={BonusLogoImg}
        alt="Bonus"
        className="bonus-logo"
        onClick={() => navigate("/bonus")}
      />

      {/* CERCLE DE MINAGE CENTRÉ */}
      <div className="mining-container">
        <MiningCircle
          points={points}
          setPoints={setPoints}
          level={level}
          setLevel={setLevel}
        />
      </div>

      {/* LOGOS À DROITE */}
      <div className="logos-container">
        <img
          src={LuckyGameLogoImg}
          alt="Lucky Game"
          className="logo"
          onClick={() => navigate("/lucky-game")}
        />

        <img
          src={TradeGameLogoImg}
          alt="Trade Game"
          className="logo"
          onClick={() => navigate("/trade-game")}
        />

        <img
          src={ActionsLogoImg}
          alt="Actions"
          className="logo"
          onClick={() => navigate("/actions")}
        />
      </div>
    </div>
  );
};

export default Home;
