import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useTranslation } from "react-i18next";

import { FaWallet } from "react-icons/fa";
import { GiReceiveMoney, GiTakeMyMoney } from "react-icons/gi";
import { AiOutlineHistory } from "react-icons/ai";

import CashMoney from "../components/CashMoney";
import RewardPoints from "../components/RewardPoints";

import "./Wallet.css";

const Wallet = () => {
  // ✅ namespace correct
  const { t } = useTranslation("transactions");

  const { user, loading } = useUser();
  const navigate = useNavigate();

  const goWithdraw = useCallback(() => {
    navigate("/retrait-methode");
  }, [navigate]);

  const goHistory = useCallback(() => {
    navigate("/historic");
  }, [navigate]);

  // ⏳ Loading
  if (loading) {
    return (
      <div className="wallet-loading">
        {t("wallet.loading")}
      </div>
    );
  }

  // 🚫 Sécurité
  if (!user) {
    return (
      <div className="wallet-error">
        {t("wallet.loading")} {/* fallback propre */}
      </div>
    );
  }

  return (
    <motion.div
      className="wallet-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* HEADER */}
      <motion.div
        className="wallet-header"
        whileHover={{ scale: 1.05 }}
      >
        <FaWallet className="wallet-icon" />
        <h2>{t("wallet.title")}</h2>
        <FaWallet className="wallet-icon" />
      </motion.div>

      {/* ACTIONS */}
      <div className="wallet-actions">

        {/* DEPOT */}
        <motion.button
          type="button"
          className="wallet-button deposit-button disabled"
          disabled
        >
          <GiReceiveMoney />
          <span>{t("wallet.depositComing")}</span>
        </motion.button>

        {/* RETRAIT */}
        <motion.button
          type="button"
          className="wallet-button withdraw-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={goWithdraw}
        >
          <GiTakeMyMoney />
          <span>{t("wallet.withdraw")}</span>
        </motion.button>

        {/* HISTORIQUE */}
        <motion.button
          type="button"
          className="wallet-button history-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={goHistory}
        >
          <AiOutlineHistory />
          <span>{t("wallet.history")}</span>
        </motion.button>

      </div>

      {/* SOLDES */}
      <div className="wallet-balances">
        <CashMoney />
        <RewardPoints />
      </div>
    </motion.div>
  );
};

export default React.memo(Wallet);