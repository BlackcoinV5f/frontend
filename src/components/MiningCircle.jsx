import React, { useEffect, useRef, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useUser } from "../contexts/UserContext";
import { useMining } from "../hooks/useMining";

import "react-circular-progressbar/dist/styles.css";
import "./MiningCircle.css";

import level1 from "../assets/level1.png";
import level2 from "../assets/level2.png";
import level3 from "../assets/level3.png";
import level4 from "../assets/level4.png";
import level5 from "../assets/level5.png";
import level6 from "../assets/level6.png";
import level7 from "../assets/level7.png";
import level8 from "../assets/level8.png";
import level9 from "../assets/level9.png";

const levelImages = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7, 8: level8, 9: level9 };

const MiningCircle = () => {
  const { user } = useUser();
  const { data, startMining, claimMining } = useMining();

  const intervalRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle");
  const [buttonText, setButtonText] = useState("START");
  const [level, setLevel] = useState(1);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // 🔥 TON LOGIC RESTE INTACT
  useEffect(() => {
    if (!data) return;

    setLevel(data.level || 1);
    clearInterval(intervalRef.current);

    if (data.status === "running") {
      setStatus("running");

      let timeLeft = data.remaining_time_ms;

      setButtonText(formatTime(timeLeft));

      intervalRef.current = setInterval(() => {
        timeLeft -= 1000;

        if (timeLeft <= 0) {
          clearInterval(intervalRef.current);
          setProgress(100);
          setStatus("ready");
          setButtonText("CLAIM");
          return;
        }

        const progressValue =
          ((data.total_cycle_ms - timeLeft) / data.total_cycle_ms) * 100;

        setProgress(progressValue);
        setButtonText(formatTime(timeLeft));
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

    return () => clearInterval(intervalRef.current);
  }, [data]);

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
        onClick={() =>
          status === "idle"
            ? startMining.mutate()
            : claimMining.mutate()
        }
      >
        {buttonText}
      </button>
    </div>
  );
};

export default MiningCircle;