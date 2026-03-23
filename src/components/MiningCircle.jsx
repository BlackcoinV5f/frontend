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

const MiningCircle = () => {
  const { user } = useUser();

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | running | ready
  const [buttonText, setButtonText] = useState("START");

  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycleMs, setCycleMs] = useState(0);

  const intervalRef = useRef(null);

  // -------------------------
  // Format time
  // -------------------------
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // -------------------------
  // Fetch mining status (SOURCE UNIQUE)
  // -------------------------
  const fetchMiningStatus = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/mining/status/${user.id}`,
        { credentials: "include" }
      );

      const data = await res.json();

      // 🔥 LEVEL DIRECTEMENT DU BACKEND
      setLevel(data.level || 1);

      clearInterval(intervalRef.current);

      if (data.status === "running") {
        setStatus("running");
        setTimeLeft(data.remaining_time_ms);
        setCycleMs(data.total_cycle_ms);

        setButtonText(formatTime(data.remaining_time_ms));

        intervalRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1000) {
              clearInterval(intervalRef.current);
              setProgress(100);
              setStatus("ready");
              setButtonText("CLAIM");
              return 0;
            }

            const updated = prev - 1000;

            const progressValue =
              ((data.total_cycle_ms - updated) / data.total_cycle_ms) * 100;

            setProgress(progressValue);
            setButtonText(formatTime(updated));

            return updated;
          });
        }, 1000);
      } else if (data.status === "ready_to_claim") {
        setProgress(100);
        setStatus("ready");
        setButtonText("CLAIM");
      } else {
        setProgress(0);
        setStatus("idle");
        setButtonText("START");
      }
    } catch (err) {
      console.error("Erreur statut :", err);
    }
  };

  // -------------------------
  // Start mining
  // -------------------------
  const startMining = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/mining/start/${user.id}`,
        { method: "POST", credentials: "include" }
      );

      const data = await res.json();

      if (data.status === "authorized") {
        fetchMiningStatus();
      }
    } catch (err) {
      console.error("Erreur start :", err);
    }
  };

  // -------------------------
  // Claim
  // -------------------------
  const claimPoints = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/mining/claim/${user.id}`,
        { method: "POST", credentials: "include" }
      );

      const data = await res.json();

      if (data.status === "success") {
        setProgress(0);
        setStatus("idle");
        setButtonText("START");

        // 🔥 refresh mining status (pas fetchStats)
        await fetchMiningStatus();
      }
    } catch (err) {
      console.error("Erreur claim :", err);
    }
  };

  // -------------------------
  // INIT
  // -------------------------
  useEffect(() => {
    fetchMiningStatus();

    return () => clearInterval(intervalRef.current);
  }, [user]);

  return (
    <div className="mining-wrapper">
      <div className="progress-circle">
        <CircularProgressbar
          value={progress}
          text={status === "running" ? `${Math.round(progress)}%` : ""}
          styles={buildStyles({
            pathColor: "#00ff88",
            textColor: "#fff",
            trailColor: "#333",
            strokeLinecap: "round",
          })}
        />

        <img
          src={levelImages[level] || level1}
          alt={`Level ${level}`}
          className="mining-image"
        />
      </div>

      <button
        className="mining-button"
        disabled={status === "running" && buttonText !== "CLAIM"}
        onClick={status === "idle" ? startMining : claimPoints}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default MiningCircle;