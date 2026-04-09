// src/components/MiningCircle.jsx
import React, { useEffect, useRef, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useUser } from "../contexts/UserContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  const { user, axiosInstance } = useUser();
  const queryClient = useQueryClient();
  const intervalRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle");
  const [buttonText, setButtonText] = useState("START");
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycleMs, setCycleMs] = useState(0);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // ✅ QUERY PROPRE (aucun refetch inutile)
  const { data } = useQuery({
    queryKey: ["mining"], // ✅ stable

    queryFn: async () => {
      const res = await axiosInstance.get(`/mining/status/${user.id}`);
      return res.data;
    },

    enabled: !!user,

    staleTime: 1000 * 60 * 15, // ✅ 15 min réel
    cacheTime: 1000 * 60 * 30,

    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // ✅ SYNC LOCAL (ZÉRO API ici)
  useEffect(() => {
    if (!data) return;

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

    return () => clearInterval(intervalRef.current);
  }, [data]);

  // 🚀 START (SANS invalidate)
  const { mutate: startMining } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/mining/start/${user.id}`);
      return res.data;
    },
    onSuccess: (newData) => {
      // ✅ mise à jour directe du cache (pas de refetch)
      queryClient.setQueryData(["mining"], newData);
    },
  });

  // 🎁 CLAIM (SANS invalidate)
  const { mutate: claimPoints } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/mining/claim/${user.id}`);
      return res.data;
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(["mining"], newData);
    },
  });

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
        onClick={() =>
          status === "idle" ? startMining() : claimPoints()
        }
      >
        {buttonText}
      </button>
    </div>
  );
};

export default MiningCircle;