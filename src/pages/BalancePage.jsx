import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaBalanceScale } from "react-icons/fa";
import { GiCash } from "react-icons/gi";
import { RiCoinsFill } from "react-icons/ri";
import { useUser } from "../contexts/UserContext";
import { useBalance } from "../hooks/useBalance";
import "./BalancePage.css";

const BalancePage = () => {
  const { user } = useUser();

  const controls = useAnimation();
  const [animateBalance, setAnimateBalance] = useState(false);

  // ✅ Hook centralisé
  const { data, isLoading, isError } = useBalance();

  const points = data ?? 0;

  // ✅ Animation quand points change
  useEffect(() => {
    if (!isLoading && data) {
      setAnimateBalance(true);
      const timer = setTimeout(() => setAnimateBalance(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [points, isLoading, data]);

  // ✨ Animation visuelle
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
    return <div className="page-container balance-container">Chargement...</div>;
  }

  if (isError) {
    return (
      <div className="page-container balance-container">
        ❌ Erreur chargement balance
      </div>
    );
  }

  return (
    <motion.div
      className="page-container balance-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div className="balance-header" whileHover={{ scale: 1.05 }}>
        <FaBalanceScale className="balance-icon" />
        <motion.h2>Ma Balance</motion.h2>
        <FaBalanceScale className="balance-icon" />
      </motion.div>

      {/* Card */}
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