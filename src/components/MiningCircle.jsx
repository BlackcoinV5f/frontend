// src/components/MiningCircle.jsx
import React, { useState, useEffect, useRef } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./MiningCircle.css";
import { useUser } from "../contexts/UserContext";

import level1 from "../assets/level1.png";
import level2 from "../assets/level2.png";
import level3 from "../assets/level3.png";
import level4 from "../assets/level4.png";
import level5 from "../assets/level5.png";
import level6 from "../assets/level6.png";
import level7 from "../assets/level7.png";
import level8 from "../assets/level8.png";
import level9 from "../assets/level9.png";

const levelImages = {
  1: level1,
  2: level2,
  3: level3,
  4: level4,
  5: level5,
  6: level6,
  7: level7,
  8: level8,
  9: level9,
};

const levelThresholds = {
  1: 0,
  2: 3500,
  3: 6000,
  4: 11000,
  5: 18000,
  6: 29000,
  7: 50000,
  8: 100000,
  9: 160000,
};

const MiningCircle = () => {
  const { user } = useUser();

  const [progress, setProgress] = useState(0);
  const [isMining, setIsMining] = useState(false);
  const [buttonText, setButtonText] = useState("START");
  const [level, setLevel] = useState(1);
  const [points, setPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalCycleMs, setTotalCycleMs] = useState(0);

  const intervalRef = useRef(null);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const calculateLevel = (totalPoints) => {
    let lvl = 1;
    for (let i = 1; i <= 9; i++) {
      if (totalPoints >= levelThresholds[i]) lvl = i;
      else break;
    }
    return lvl;
  };

  const fetchMiningHistory = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/mining/history/${user.id}`,
        { credentials: "include" }
      );
      const data = await res.json();

      const total = data.history.reduce((acc, entry) => acc + entry.points, 0);
      setPoints(total);
      setLevel(calculateLevel(total));
    } catch (err) {
      console.error("Erreur récupération historique :", err);
    }
  };

  const fetchMiningStatus = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/mining/status/${user.id}`,
        { credentials: "include" }
      );
      const data = await res.json();

      clearInterval(intervalRef.current);

      if (data.status === "running") {
        setIsMining(true);
        setTimeLeft(data.remaining_time_ms);
        setTotalCycleMs(data.total_cycle_ms);
        setButtonText(formatTime(data.remaining_time_ms));

        intervalRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1000) {
              clearInterval(intervalRef.current);
              setProgress(100);
              setIsMining(false);
              setButtonText("CLAIM");
              fetchMiningHistory();
              return 0;
            }

            const updated = prev - 1000;
            setProgress(((data.total_cycle_ms - updated) / data.total_cycle_ms) * 100);
            setButtonText(formatTime(updated));
            return updated;
          });
        }, 1000);
      }

      else if (data.status === "ready_to_claim") {
        setProgress(100);
        setIsMining(false);
        setButtonText("CLAIM");
      }

      else {
        setProgress(0);
        setIsMining(false);
        setButtonText("START");
      }
    } catch (err) {
      console.error("Erreur statut minage :", err);
    }
  };

  const startMining = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/mining/start/${user.id}`,
        { method: "POST", credentials: "include" }
      );
      const data = await res.json();

      if (data.status === "authorized") {
        setTotalCycleMs(data.total_cycle_ms);
        fetchMiningStatus();
      }
    } catch (err) {
      console.error("Erreur démarrage minage :", err);
    }
  };

  const claimPoints = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/mining/claim/${user.id}`,
        { method: "POST", credentials: "include" }
      );
      const data = await res.json();

      if (data.status === "success") {
        const newTotal = points + data.points_earned;
        setPoints(newTotal);
        setLevel(calculateLevel(newTotal));
        setProgress(0);
        setIsMining(false);
        setButtonText("START");
      }
    } catch (err) {
      console.error("Erreur claim :", err);
    }
  };

  useEffect(() => {
    fetchMiningStatus();
    fetchMiningHistory();
    return () => clearInterval(intervalRef.current);
  }, [user]);

  return (
    <div className="mining-wrapper">
      <div className="progress-circle">
        <CircularProgressbar
          value={progress}
          text={`${Math.round(progress)}%`}
          styles={buildStyles({
            pathColor: "green",
            textColor: "#fff",
            trailColor: "#333",
            strokeLinecap: "round",
          })}
        />

        <img
          src={levelImages[level]}
          alt={`Level ${level}`}
          className="mining-image"
        />
      </div>

      <button
        className="mining-button"
        disabled={isMining && buttonText !== "CLAIM"}
        onClick={buttonText === "START" ? startMining : claimPoints}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default MiningCircle;
