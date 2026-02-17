import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import { GiCash } from "react-icons/gi";
import "./CashMoney.css";

const CashMoney = () => {
  const { user, axiosInstance } = useUser(); // récupération de l'utilisateur connecté
  const controls = useAnimation();

  const [cashBalance, setCashBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  // 🔄 Charger le solde d'argent réel
  useEffect(() => {
    const loadCashBalance = async () => {
      if (!user?.id) return; // si utilisateur non connecté, rien faire

      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/wallet/realcash");
        setCashBalance(res.data.cash_balance ?? 0);
        setAnimate(true);
        setTimeout(() => setAnimate(false), 800);
      } catch (error) {
        console.error("Erreur chargement solde USDT :", error);
        setCashBalance(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadCashBalance();
  }, [user, axiosInstance]);

  // ⚡ Animation légère lors du clic ou du chargement
  useEffect(() => {
    if (animate) {
      controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.6 },
      });
    }
  }, [animate, controls]);

  return (
    <motion.div
      className="cashmoney-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="cashmoney-label">Solde argent réel</p>

      <motion.div
        className="cashmoney-amount"
        animate={controls}
        onClick={() => setAnimate(true)}
      >
        {isLoading ? (
          <span className="loading">Chargement...</span>
        ) : (
          <>
            <GiCash className="cash-icon" />
            {cashBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            USDT
          </>
        )}
      </motion.div>

      <p className="cashmoney-hint">
        Retirable • Dépôts réels • Valeur monétaire
      </p>
    </motion.div>
  );
};

export default CashMoney;
