import React, { useEffect, useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import { FaCoins, FaPercentage, FaUserFriends, FaWallet } from "react-icons/fa";
import { GiCash, GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { RiCoinsFill } from "react-icons/ri";
import "./Wallet.css";

const Wallet = () => {
  const { user, soldeBKC, fetchWallet } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [animateBalance, setAnimateBalance] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (user?.telegram_id) {
      setIsLoading(true);
      fetchWallet(user.telegram_id)
        .then(() => {
          setAnimateBalance(true);
          setTimeout(() => setAnimateBalance(false), 1000);
        })
        .finally(() => setIsLoading(false));
    }
  }, [user, fetchWallet]);

  useEffect(() => {
    if (animateBalance) {
      controls.start({
        scale: [1, 1.2, 1],
        color: ["#ffd700", "#ffff00", "#ffd700"],
        transition: { duration: 0.8 }
      });
    }
  }, [animateBalance, controls]);

  return (
    <motion.div
      className="wallet-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="wallet-header"
        whileHover={{ scale: 1.05 }}
      >
        <FaWallet className="wallet-icon" />
        <motion.h2>Mon Wallet</motion.h2>
        <FaWallet className="wallet-icon" />
      </motion.div>

      <motion.div
        className="wallet-balance-card"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="coins-animation">
          <motion.div
            animate={{
              rotate: [0, 360],
              transition: { duration: 20, repeat: Infinity, ease: "linear" }
            }}
          >
            <RiCoinsFill className="rotating-coin rotating-coin-1" />
          </motion.div>
          <motion.div
            animate={{
              rotate: [360, 0],
              transition: { duration: 25, repeat: Infinity, ease: "linear" }
            }}
          >
            <RiCoinsFill className="rotating-coin rotating-coin-2" />
          </motion.div>
        </div>

        <p className="balance-label">Solde Wallet ($BKC)</p>
        <motion.p
          className="solde-amount"
          animate={controls}
        >
          {isLoading ? (
            <div className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          ) : (
            <>
              <GiCash className="cash-icon" />
              {soldeBKC !== undefined ? soldeBKC.toLocaleString() : "0"} $BKC
            </>
          )}
        </motion.p>
      </motion.div>

      <motion.div 
        className="wallet-info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div 
          className="info-item"
          whileHover={{ scale: 1.03 }}
        >
          <FaPercentage className="info-icon" />
          <p>
            <span className="highlight">20%</span> des points gagnés via les tâches
            <motion.div 
              className="money-flow in"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <GiReceiveMoney />
            </motion.div>
          </p>
        </motion.div>

        <motion.div 
          className="info-item"
          whileHover={{ scale: 1.03 }}
        >
          <FaUserFriends className="info-icon" />
          <p>
            <span className="highlight">15%</span> des points issus du parrainage
            <motion.div 
              className="money-flow in"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <GiReceiveMoney />
            </motion.div>
          </p>
        </motion.div>

        <motion.div 
          className="info-item"
          whileHover={{ scale: 1.03 }}
        >
          <FaCoins className="info-icon" />
          <p>
            <span className="highlight">100%</span> des récompenses spéciales
            <motion.div 
              className="money-flow in"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <GiReceiveMoney />
            </motion.div>
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="wallet-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.button
          className="transfer-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <GiPayMoney className="transfer-icon" />
          Transférer des points
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Wallet;