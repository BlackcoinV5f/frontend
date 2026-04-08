// src/components/RewardPoints.jsx
import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { RiCoinsFill } from "react-icons/ri";
import "./RewardPoints.css";

const RewardPoints = () => {
  const { user, axiosInstance } = useUser();
  const controls = useAnimation();

  const [animate, setAnimate] = useState(false);

  // ✅ React Query
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["rewardPoints", user?.id],
    queryFn: async () => {
      const res = await axiosInstance.get("/wallet/");
      return res.data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  });

  // ✅ extraction correcte
  const rewardPoints = data?.balance ?? 0;

  // ✅ animation quand données changent
  useEffect(() => {
    if (!isLoading && data) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 800);
      return () => clearTimeout(timer);
    }
  }, [rewardPoints, isLoading, data]);

  // ⚡ animation
  useEffect(() => {
    if (animate) {
      controls.start({
        scale: [1, 1.15, 1],
        transition: { duration: 0.6 },
      });
    }
  }, [animate, controls]);

  if (isError) {
    return (
      <div className="rewardpoints-card">
        ❌ Erreur chargement points
      </div>
    );
  }

  return (
    <motion.div
      className="rewardpoints-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={() => setAnimate(true)}
    >
      <div className="coins-animation">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <RiCoinsFill className="rotating-coin" />
        </motion.div>
      </div>

      <p className="rewardpoints-label">Points de récompense</p>

      <motion.div className="rewardpoints-amount" animate={controls}>
        {isLoading ? (
          <span className="loading">Chargement...</span>
        ) : (
          <>
            {rewardPoints.toLocaleString()}{" "}
            <span className="unit">BKC</span>
          </>
        )}
      </motion.div>

      <p className="rewardpoints-hint">
        Récompenses • Packs • Services premium
      </p>
    </motion.div>
  );
};

export default RewardPoints;