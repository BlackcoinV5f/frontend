// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegCalendarCheck } from "react-icons/fa";

import { useUser } from "../contexts/UserContext";
import MiningCircle from "../components/MiningCircle";
import UserProfile from "../components/UserProfile.jsx";
import LuckyGameLogo from "../components/LuckyGameLogo"; 
import TradeGameLogo from "../components/TradeGameLogo"; 
import ActionsLogo from "../components/ActionsLogo"; // ✅ Nouveau logo d’investissement

import "./Home.css";

const Home = ({ points, setPoints, level, setLevel }) => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useUser();
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    console.log("État utilisateur :", {
      loading,
      isAuthenticated,
      userData: user,
    });
  }, [user, loading, isAuthenticated]);

  // ⚡ Redirection si non authentifié
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
      {/* 📅 Récompense quotidienne */}
      <Link to="/daily" className="calendar-button" title="Récompense quotidienne">
        <FaRegCalendarCheck />
      </Link>

      {/* ⛏️ Cercle de minage */}
      <MiningCircle
        points={points}
        setPoints={setPoints}
        level={level}
        setLevel={setLevel}
      />

      {/* 🎰 Logo Lucky Game */}
      <LuckyGameLogo />

      {/* 💹 Logo Trade Game */}
      <TradeGameLogo />

      {/* 📈 Nouveau : Logo Actions (investissement personnel) */}
      <ActionsLogo />

      {/* 👤 Bouton profil */}
      <button
        className="guest-button"
        onClick={() => setShowProfile(true)}
      >
        {user?.username || "Guest"} (profil)
      </button>

      {/* 👤 Modal UserProfile */}
      {showProfile && (
        <div className="modal-overlay" onClick={() => setShowProfile(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <UserProfile onClose={() => setShowProfile(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
