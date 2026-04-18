import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useWithdrawMethods } from "../hooks/useWithdrawMethods";
import "./RetraitMethode.css";

export default function RetraitMethode() {
  const navigate = useNavigate();

  const { data: methods, isLoading, isError } = useWithdrawMethods();

  const handleSelectMethod = (method) => {
    navigate("/retrait", { state: { selectedMethod: method } });
  };

  if (isLoading) {
    return (
      <p className="withdraw-loading">
        Chargement des méthodes...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="withdraw-error">
        ❌ Impossible de charger les méthodes de retrait
      </p>
    );
  }

  if (!methods || methods.length === 0) {
    return (
      <p className="withdraw-empty">
        Aucune méthode de retrait disponible.
      </p>
    );
  }

  return (
    <div className="withdraw-container">
      <h2 className="withdraw-title">
        💸 Choisissez votre méthode de retrait
      </h2>

      <div className="withdraw-list">
        {methods.map((method) => (
          <motion.div
            key={method.id} // ✅ fix important (pas index)
            className="withdraw-card"
            onClick={() => handleSelectMethod(method)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={method.icon_url}
              alt={method.name}
              className="withdraw-icon"
              loading="lazy"
            />

            <div className="withdraw-info">
              <h3>{method.name}</h3>
              <p>{method.country || "Pays non spécifié"}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}