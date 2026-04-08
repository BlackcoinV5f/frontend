// src/pages/DepositMethods.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdm } from "../contexts/AdmContext"; // ✅ serveur dépôt/retrait
import { FaMoneyBillWave } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import "./DepositMethods.css";

export default function DepositMethods() {
  const { axiosDeposit } = useAdm();
  const navigate = useNavigate();

  // ✅ React Query
  const {
    data: methods,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["depositMethods"],
    queryFn: async () => {
      const res = await axiosDeposit.get("/transaction-methods/");
      return res.data || [];
    },
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="methods-loading">
        <div className="spinner" />
        <p>Chargement des méthodes de dépôt...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="methods-loading">
        ❌ Impossible de charger les méthodes de dépôt
      </div>
    );
  }

  return (
    <motion.div
      className="methods-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="methods-header">
        <FaMoneyBillWave className="methods-header-icon" />
        <h2>Choisissez une méthode de dépôt</h2>
      </div>

      <div className="methods-grid">
        {methods.map((method) => (
          <motion.div
            key={method.id}
            className="method-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/deposits/${method.id}`)}
          >
            <div className="method-image-wrapper">
              <img
                src={method.icon_url}
                alt={method.name}
                className="method-icon"
              />
              {method.flag_url && (
                <img
                  src={method.flag_url}
                  alt={method.country}
                  className="country-flag"
                />
              )}
            </div>
            <p className="method-name">{method.name}</p>
          </motion.div>
        ))}
      </div>

      <motion.button
        className="back-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/wallet")}
      >
        ⬅ Retour au Wallet
      </motion.button>
    </motion.div>
  );
}