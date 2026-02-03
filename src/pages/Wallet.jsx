import React from "react";
import { motion } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { FaWallet } from "react-icons/fa";
import { GiReceiveMoney, GiTakeMyMoney } from "react-icons/gi";
import { AiOutlineHistory } from "react-icons/ai";
import CashMoney from "../components/CashMoney";
import RewardPoints from "../components/RewardPoints";
import "./Wallet.css";

const Wallet = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) return <div>Chargement...</div>;

  return (
    <motion.div
      className="wallet-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* ===== HEADER ===== */}
      <motion.div className="wallet-header" whileHover={{ scale: 1.05 }}>
        <FaWallet className="wallet-icon" />
        <h2>Mon Wallet</h2>
        <FaWallet className="wallet-icon" />
      </motion.div>

      {/* ===== ACTIONS ===== */}
      <div className="wallet-actions">
        <motion.button
          className="wallet-button deposit-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled
        >
          <GiReceiveMoney />
          Dépôt
        </motion.button>

        <motion.button
          className="wallet-button withdraw-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/retrait-methode")}
        >
          <GiTakeMyMoney />
          Retrait
        </motion.button>

        <motion.button
          className="wallet-button history-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/historic")}
        >
          <AiOutlineHistory />
          Historique
        </motion.button>
      </div>

      {/* ===== SOLDES ===== */}
      <div className="wallet-balances">
        <CashMoney />      {/* 💰 USDT réel */}
        <RewardPoints />   {/* ⭐ Points packs & premium */}
      </div>
    </motion.div>
  );
};

export default Wallet;
