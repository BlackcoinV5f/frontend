import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

import { FaWallet } from "react-icons/fa";
import { GiReceiveMoney, GiTakeMyMoney } from "react-icons/gi";
import { AiOutlineHistory } from "react-icons/ai";

import CashMoney from "../components/CashMoney";
import RewardPoints from "../components/RewardPoints";

import "./Wallet.css";

const Wallet = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  if (loading || !user) {
    return <div>Chargement...</div>;
  }

  return (
    <motion.div
      className="wallet-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* ===== HEADER ===== */}
      <motion.div
        className="wallet-header"
        whileHover={{ scale: 1.05 }}
      >
        <FaWallet className="wallet-icon" />
        <h2>Mon Wallet</h2>
        <FaWallet className="wallet-icon" />
      </motion.div>

      {/* ===== ACTIONS ===== */}
      <div className="wallet-actions">
        {/* ✅ DEPOT — route corrigée */}
        <motion.button
          type="button"
          className="wallet-button deposit-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/depots")}
        >
          <GiReceiveMoney />
          <span>Dépôt</span>
        </motion.button>

        {/* ✅ RETRAIT — déjà correct */}
        <motion.button
          type="button"
          className="wallet-button withdraw-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/retrait-methode")}
        >
          <GiTakeMyMoney />
          <span>Retrait</span>
        </motion.button>

        {/* ✅ HISTORIQUE */}
        <motion.button
          type="button"
          className="wallet-button history-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/historic")}
        >
          <AiOutlineHistory />
          <span>Historique</span>
        </motion.button>
      </div>

      {/* ===== SOLDES ===== */}
      <div className="wallet-balances">
        <CashMoney />
        <RewardPoints />
      </div>
    </motion.div>
  );
};

export default Wallet;
