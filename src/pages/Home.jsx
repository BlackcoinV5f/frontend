// src/pages/Home.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../contexts/UserContext";
import MiningCircle from "../components/MiningCircle";
import LuckyGameLogo from "../components/LuckyGameLogo";
import TradeGameLogo from "../components/TradeGameLogo";
import BonusLogo from "../components/BonusLogo";
import ActionsLogo from "../components/ActionsLogo";

import "./Home.css";

const Home = ({ points, setPoints, level, setLevel }) => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useUser();

  // Suivi de l’état utilisateur (dev)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("État utilisateur :", { loading, isAuthenticated, user });
    }
  }, [user, loading, isAuthenticated]);

  // Redirection si non authentifié
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth-choice", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  // Aller à la page Bonus
  const goToBonus = () => {
    navigate("/bonus");
  };

  // Aller à la page Profil
  const goToProfile = () => {
    navigate("/profile");
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
      {/* ⛏️ Cercle de minage au centre */}
      <MiningCircle
        points={points}
        setPoints={setPoints}
        level={level}
        setLevel={setLevel}
      />

      {/* 🎰 Conteneur pour logos fixes */}
      <div className="logos-container">
        <LuckyGameLogo className="lucky-game-logo" />
        <TradeGameLogo className="trade-game-logo" />
        <ActionsLogo className="actions-logo" />
        <BonusLogo className="bonus-logo" onClick={goToBonus} />
      </div>

      {/* 👤 Bouton profil utilisateur */}
      <button className="guest-button" onClick={goToProfile}>
        {user?.username || "Guest"} (profil)
      </button>
    </div>
  );
};

export default Home;
