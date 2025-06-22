// src/pages/Quotidien.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Quotidien.css";

const Quotidien = () => {
  const [streak, setStreak] = useState(0);
  const [claimedToday, setClaimedToday] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedStreak = parseInt(localStorage.getItem("dailyStreak")) || 0;
    const savedLastTime = localStorage.getItem("lastClaimTime");

    setStreak(savedStreak);

    if (savedLastTime) {
      const lastDate = new Date(savedLastTime);
      const now = new Date();
      const diffHours = (now - lastDate) / (1000 * 60 * 60);

      if (diffHours < 24 && now.getDate() === lastDate.getDate()) {
        setClaimedToday(true);
      } else if (diffHours >= 48 || now.getDate() - lastDate.getDate() > 1) {
        setStreak(0);
        localStorage.setItem("dailyStreak", "0");
      }
    }
  }, []);

  const handleClaim = () => {
    if (claimedToday) {
      setMessage("✅ Récompense déjà réclamée aujourd'hui !");
      return;
    }

    const now = new Date();
    const newStreak = streak + 1;
    const rewardPoints = 500;

    setStreak(newStreak);
    setClaimedToday(true);
    setMessage(`🎉 +${rewardPoints} points ! Streak : ${newStreak} jours`);

    localStorage.setItem("dailyStreak", newStreak.toString());
    localStorage.setItem("lastClaimTime", now.toISOString());

    const userId = JSON.parse(localStorage.getItem("telegramUser"))?.id;
    if (userId) {
      const balanceKey = `balance_${userId}`;
      const currentBalance = parseInt(localStorage.getItem(balanceKey)) || 0;
      localStorage.setItem(balanceKey, (currentBalance + rewardPoints).toString());
    }

    // ✅ Toast
    const toast = document.createElement("div");
    toast.textContent = `+${rewardPoints} points`;
    toast.className = "reward-toast";
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("fade-out"), 1500);
    setTimeout(() => toast.remove(), 2000);
  };

  return (
    <div className="quotidien-page">
      <h2>🎁 Récompense Quotidienne</h2>
      <p>🔥 Jours consécutifs : <strong>{streak}</strong></p>
      <button className="claim-btn" onClick={handleClaim} disabled={claimedToday}>
        {claimedToday ? "Déjà réclamé aujourd'hui" : "Réclamer ma récompense"}
      </button>
      <button className="close-btn" onClick={() => navigate("/")}>Fermer</button>
      <p className="message">{message}</p>
    </div>
  );
};

export default Quotidien;
