import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./MiningCircle.css";

// Import des images des niveaux
import level1 from "../assets/level1.png";
import level2 from "../assets/level2.png";
import level3 from "../assets/level3.png";
import level4 from "../assets/level4.png";
import level5 from "../assets/level5.png";
import level6 from "../assets/level6.png";
import level7 from "../assets/level7.png";
import level8 from "../assets/level8.png";
import level9 from "../assets/level9.png";

// Seuils des niveaux
const levelThresholds = [0, 5000, 14000, 32000, 65000, 100000, 160000, 230000, 310000];
const levelImages = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7, 8: level8, 9: level9 };
const MINING_DURATION = 12 * 60 * 60 * 1000;

const MiningCircle = ({ points, setPoints, level, setLevel }) => {
  const [progress, setProgress] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [buttonText, setButtonText] = useState("START");

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

  // Vérifier et mettre à jour le niveau du joueur
  useEffect(() => {
    const newLevel = levelThresholds.findIndex(threshold => points >= threshold) + 1;
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

      let progressInterval = setInterval(() => {
        setProgress((prev) => {
          const elapsedTime = Date.now() - startTime;
          const newProgress = Math.min((elapsedTime / MINING_DURATION) * 100, 100);

          if (newProgress >= 100) {
            clearInterval(progressInterval);
            setIsMining(false);
            setButtonText("CLAIM");
            return 100;
          }
          return newProgress;
        });
      }, 60000);
    }
  };

  const claimPoints = () => {
    if (!isMining) {
      setPoints(points + 1000);
      setProgress(0);
      setButtonText("START");
      localStorage.removeItem("miningStartTime");
      localStorage.setItem("miningProgress", "0");
      localStorage.setItem("isMining", "false");
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
        <img src={levelImages[level]} alt="Level" className="mining-image" />
      </div>
      <button className="mining-button" onClick={buttonText === "START" ? startMining : claimPoints} disabled={isMining}>
        {buttonText}
      </button>
    </div>
  );
};

export default MiningCircle;
