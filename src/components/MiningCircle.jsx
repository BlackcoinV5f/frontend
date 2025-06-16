import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./MiningCircle.css";
import { useUser } from "../contexts/UserContext";

// Images des niveaux
import level1 from "../assets/level1.png";
import level2 from "../assets/level2.png";
import level3 from "../assets/level3.png";
import level4 from "../assets/level4.png";
import level5 from "../assets/level5.png";
import level6 from "../assets/level6.png";
import level7 from "../assets/level7.png";
import level8 from "../assets/level8.png";
import level9 from "../assets/level9.png";

const levelThresholds = [0, 5000, 14000, 32000, 65000, 100000, 160000, 230000, 310000];
const levelImages = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7, 8: level8, 9: level9 };
const MINING_DURATION = 12 * 60 * 60 * 1000;

const MiningCircle = ({ points, setPoints, level, setLevel }) => {
  const [progress, setProgress] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [buttonText, setButtonText] = useState("START");
  const { user, fetchBalance } = useUser();

  useEffect(() => {
    const savedStartTime = localStorage.getItem("miningStartTime");
    const savedProgress = parseFloat(localStorage.getItem("miningProgress")) || 0;
    const savedMiningState = localStorage.getItem("isMining") === "true";

    if (savedStartTime && savedMiningState) {
      const elapsedTime = Date.now() - parseInt(savedStartTime, 10);
      const newProgress = Math.min((elapsedTime / MINING_DURATION) * 100, 100);

      if (newProgress >= 100) {
        setProgress(100);
        setIsMining(false);
        setButtonText("CLAIM");
      } else {
        setProgress(newProgress);
        setIsMining(true);
        setButtonText("En cours...");
      }
    } else {
      setProgress(savedProgress);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("miningProgress", progress);
    localStorage.setItem("isMining", isMining);
  }, [progress, isMining]);

  useEffect(() => {
    const newLevel = levelThresholds.findIndex((threshold) => points >= threshold) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
    }
  }, [points, level, setLevel]);

  const startMining = () => {
    if (!isMining) {
      const startTime = Date.now();
      localStorage.setItem("miningStartTime", startTime);
      setIsMining(true);
      setButtonText("En cours...");

      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / MINING_DURATION) * 100, 100);
        setProgress(newProgress);

        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setIsMining(false);
          setButtonText("CLAIM");
        }
      }, 60000);
    }
  };

  const claimPoints = async () => {
    if (!user?.telegram_id) {
      alert("Utilisateur non authentifié.");
      return;
    }

    try {
      // Envoi des 1000 points au backend pour mise à jour de la balance
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/balance/update/${user.telegram_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ points: 1000 }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour de la balance.");
      }

      // Recharge la balance réelle après la récompense
      await fetchBalance(user.telegram_id);
      setPoints((prev) => prev + 1000);

      // Réinitialisation
      setProgress(0);
      setButtonText("START");
      localStorage.removeItem("miningStartTime");
      localStorage.setItem("miningProgress", "0");
      localStorage.setItem("isMining", "false");

    } catch (error) {
      console.error("Erreur lors de la récolte des points :", error);
      alert("Impossible de récolter les points. Réessaie plus tard.");
    }
  };

  return (
    <div className="mining-container">
      <div className="progress-circle">
        <CircularProgressbar
          value={progress}
          text={`${Math.round(progress)}%`}
          styles={buildStyles({
            pathColor: "green",
            textColor: "#fff",
            trailColor: "#ddd",
            strokeLinecap: "round",
            textSize: "16px",
          })}
        />
        <img src={levelImages[level]} alt={`Level ${level}`} className="mining-image" />
      </div>
      <button
        className="mining-button"
        onClick={buttonText === "START" ? startMining : claimPoints}
        disabled={isMining}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default MiningCircle;
