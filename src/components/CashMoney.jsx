// src/components/CashMoney.jsx
import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { GiCash } from "react-icons/gi";
import "./CashMoney.css";

const CashMoney = () => {
  const { user, axiosInstance } = useUser();
  const controls = useAnimation();

  const [animate, setAnimate] = useState(false);

  // ✅ React Query optimisé
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cashBalance"], // ✅ stable (plus de user.id ici)
    
    queryFn: async () => {
      const res = await axiosInstance.get("/wallet/realcash/");
      return res.data;
    },

    enabled: !!user, // ✅ évite bug au démarrage

    // 🔥 CONFIG CACHE PRO
    staleTime: 1000 * 60 * 15, // 15 min sans refetch
    cacheTime: 1000 * 60 * 30, // garde en mémoire 30 min

    // 🔥 bloque les refetch automatiques
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // ✅ extraction sécurisée
  const cashBalance = data?.cash_balance ?? 0;

  // ✅ animation quand valeur change
  useEffect(() => {
    if (!isLoading && data) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cashBalance, isLoading, data]);

  // ✅ animation framer
  useEffect(() => {
    if (animate) {
      controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.5 },
      });
    }
  }, [animate, controls]);

  // ❌ erreur
  if (isError) {
    return (
      <div className="cashmoney-card">
        ❌ Erreur chargement solde
      </div>
    );
  }

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