import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import { RiCoinsFill } from "react-icons/ri";
import "./RewardPoints.css";

const RewardPoints = () => {
  const { user, axiosInstance } = useUser();
  const controls = useAnimation();

  const [rewardPoints, setRewardPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  // 🔄 Charger les points BKC (récompenses)
  useEffect(() => {
    const loadRewardPoints = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/wallet/");
        setRewardPoints(res.data.balance ?? 0);
        setAnimate(true);
        setTimeout(() => setAnimate(false), 800);
      } catch (error) {
        console.error("Erreur récupération points BKC :", error);
        setRewardPoints(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadRewardPoints();
  }, [user, axiosInstance]);

  // ⚡ Animation légère
  useEffect(() => {
    if (animate) {
      controls.start({
        scale: [1, 1.15, 1],
        transition: { duration: 0.6 },
      });
    }
  }, [animate, controls]);

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
            {rewardPoints.toLocaleString()} <span className="unit">BKC</span>
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
