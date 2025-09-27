// src/pages/BalancePage.jsx
import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaBalanceScale } from "react-icons/fa";
import { GiCash } from "react-icons/gi";
import { RiCoinsFill } from "react-icons/ri";
import { useUser } from "../contexts/UserContext";
import "./BalancePage.css";

const BalancePage = () => {
  const { user, fetchBalance } = useUser(); // ✅ utilise la fonction du contexte
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [animateBalance, setAnimateBalance] = useState(false);
  const controls = useAnimation();

  // ✅ Fetch balance via UserContext (axiosInstance + refresh auto)
  useEffect(() => {
    const loadBalance = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const balance = await fetchBalance(); // ✅ via axiosInstance
        setPoints(balance || 0);
        setAnimateBalance(true);
        setTimeout(() => setAnimateBalance(false), 1000);
      } catch (err) {
        console.error("❌ Erreur récupération balance:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBalance();
  }, [user, fetchBalance]);

  useEffect(() => {
    if (animateBalance) {
      controls.start({
        scale: [1, 1.2, 1],
        color: ["#ffd700", "#ffff00", "#ffd700"],
        transition: { duration: 0.8 },
      });
    }
  }, [animateBalance, controls]);

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <motion.div
      className="balance-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div className="balance-header" whileHover={{ scale: 1.05 }}>
        <FaBalanceScale className="balance-icon" />
        <motion.h2>Ma Balance</motion.h2>
        <FaBalanceScale className="balance-icon" />
      </motion.div>

      <motion.div
        className="balance-card"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="coins-animation">
          <motion.div
            animate={{
              rotate: [0, 360],
              transition: { duration: 20, repeat: Infinity, ease: "linear" },
            }}
          >
            <RiCoinsFill className="rotating-coin rotating-coin-1" />
          </motion.div>
          <motion.div
            animate={{
              rotate: [360, 0],
              transition: { duration: 25, repeat: Infinity, ease: "linear" },
            }}
          >
            <RiCoinsFill className="rotating-coin rotating-coin-2" />
          </motion.div>
        </div>

        <p className="balance-label">Solde Balance (points)</p>

        <motion.div className="balance-amount" animate={controls}>
          {isLoading ? (
            <div className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          ) : (
            <>
              <GiCash className="cash-icon" />
              {points.toLocaleString()} points
            </>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default BalancePage;
