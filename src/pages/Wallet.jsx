// src/components/Wallet.jsx
import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { FaWallet } from "react-icons/fa";
import { GiCash, GiReceiveMoney, GiTakeMyMoney } from "react-icons/gi";
import { RiCoinsFill } from "react-icons/ri";
import "./Wallet.css";

const Wallet = () => {
  const { user, axiosInstance } = useUser();
  const [walletPoints, setWalletPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [animateWallet, setAnimateWallet] = useState(false);
  const controls = useAnimation();
  const navigate = useNavigate();

  /** 🔄 Charge le solde du wallet via axiosInstance */
  useEffect(() => {
    const loadWallet = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/wallet/");
        setWalletPoints(res.data.amount || 0);
        setAnimateWallet(true);
        setTimeout(() => setAnimateWallet(false), 1000);
      } catch (err) {
        console.error("❌ Erreur récupération wallet:", err);
        setWalletPoints(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadWallet();
  }, [user, axiosInstance]);

  /** ⚡ Animation du solde */
  useEffect(() => {
    if (animateWallet) {
      controls.start({
        scale: [1, 1.2, 1],
        color: ["#ffd700", "#ffff00", "#ffd700"],
        transition: { duration: 0.8 },
      });
    }
  }, [animateWallet, controls]);

  if (!user) return <div>Chargement...</div>;

  return (
    <motion.div
      className="wallet-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ====== HEADER ====== */}
      <motion.div className="wallet-header" whileHover={{ scale: 1.05 }}>
        <FaWallet className="wallet-icon" />
        <motion.h2>Mon Wallet</motion.h2>
        <FaWallet className="wallet-icon" />
      </motion.div>

      {/* ====== ACTIONS (remontés ici) ====== */}
      <motion.div
        className="wallet-actions"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          className="wallet-button deposit-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/depots")}
        >
          <GiReceiveMoney className="button-icon" />
          Dépôt
        </motion.button>

        <motion.button
          className="wallet-button withdraw-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/retraits")}
        >
          <GiTakeMyMoney className="button-icon" />
          Retrait
        </motion.button>
      </motion.div>

      {/* ====== BALANCE ====== */}
      <motion.div
        className="wallet-balance-card"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={() => setAnimateWallet(true)}
      >
        <div className="coins-animation">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <RiCoinsFill className="rotating-coin rotating-coin-1" />
          </motion.div>
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <RiCoinsFill className="rotating-coin rotating-coin-2" />
          </motion.div>
        </div>

        <p className="balance-label">Solde Wallet ($BKC)</p>
        <motion.div className="solde-amount" animate={controls}>
          {isLoading ? (
            <div className="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
          ) : (
            <>
              <GiCash className="cash-icon" />
              {walletPoints.toLocaleString()} $BKC
            </>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Wallet;
