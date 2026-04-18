import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMoneyBillWave } from "react-icons/fa";
import { useDepositMethods } from "../hooks/useDepositMethods";
import "./DepositMethods.css";

export default function DepositMethods() {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useDepositMethods();

  const methods = useMemo(() => data || [], [data]);

  const goToDeposit = useCallback(
    (id) => {
      navigate(`/deposits/${id}`);
    },
    [navigate]
  );

  const goBack = useCallback(() => {
    navigate("/wallet");
  }, [navigate]);

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

  if (!methods.length) {
    return (
      <div className="methods-loading">
        ⚠️ Aucune méthode disponible
      </div>
    );
  }

  return (
    <motion.div
      className="methods-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
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
            onClick={() => goToDeposit(method.id)}
          >
            <div className="method-image-wrapper">
              <img
                src={method.icon_url}
                alt={method.name}
                className="method-icon"
                loading="lazy"
              />

              {method.flag_url && (
                <img
                  src={method.flag_url}
                  alt={method.country}
                  className="country-flag"
                  loading="lazy"
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
        onClick={goBack}
      >
        ⬅ Retour au Wallet
      </motion.button>
    </motion.div>
  );
}