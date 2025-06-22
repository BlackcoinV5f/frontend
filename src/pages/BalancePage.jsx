// src/pages/BalancePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { GiMoneyStack } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import { FaCoins, FaHistory, FaArrowRight } from "react-icons/fa";
import "./BalancePage.css";

const formatPoints = (points) => {
  const value = typeof points === "number" ? points : 0;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString().padStart(2, "0");
};

const BalancePage = ({ points = 0, pointsHistory = [] }) => {
  const { user, fetchBalance } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [animatePoints, setAnimatePoints] = useState(false);

  useEffect(() => {
    if (user?.telegram_id) {
      setIsLoading(true);
      fetchBalance(user.telegram_id)
        .then(() => {
          console.log("✅ Balance récupérée");
          setAnimatePoints(true);
          setTimeout(() => setAnimatePoints(false), 1000);
        })
        .catch((err) => console.error("❌ Erreur fetch balance :", err))
        .finally(() => setIsLoading(false));
    }
  }, [user, fetchBalance]);

  const history = Array.isArray(pointsHistory)
    ? pointsHistory.slice(-100).reverse()
    : [];

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Bloc solde avec animation */}
      <motion.div 
        className="balance-card"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.div
          animate={{ 
            rotate: animatePoints ? [0, -10, 10, -5, 5, 0] : 0,
            scale: animatePoints ? [1, 1.1, 1] : 1
          }}
          transition={{ duration: 0.6 }}
        >
          <GiMoneyStack className="balance-icon" />
        </motion.div>
        <motion.span 
          className="balance-text"
          animate={{
            color: animatePoints ? ["#00ff73", "#ffff00", "#00ff73"] : "#00ff73",
            scale: animatePoints ? [1, 1.2, 1] : 1
          }}
          transition={{ duration: 0.6 }}
        >
          {isLoading ? (
            <div className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          ) : (
            formatPoints(points) + " pts"
          )}
        </motion.span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="total-points"
      >
        <FaCoins className="coin-icon" /> Total des points : {points ?? 0} pts
      </motion.p>

      <motion.h3
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <FaHistory className="history-icon" /> Historique des points
      </motion.h3>

      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <AnimatePresence>
          {history.length > 0 ? (
            history.map((entry, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                +{entry} pts
              </motion.li>
            ))
          ) : (
            <motion.li 
              className="no-history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              📭 Aucun historique de points pour le moment.
              <motion.button 
                className="start-task-btn"
                onClick={() => navigate("/tasks")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ➕ Gagner des points <FaArrowRight className="arrow-icon" />
              </motion.button>
            </motion.li>
          )}
        </AnimatePresence>
      </motion.ul>
    </motion.div>
  );
};

export default BalancePage;