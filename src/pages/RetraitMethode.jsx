import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useWithdrawMethods } from "../hooks/useWithdrawMethods";
import { useTranslation } from "react-i18next";
import "./RetraitMethode.css";

export default function RetraitMethode() {
  // ✅ namespace correct
  const { t } = useTranslation("transactions");

  const navigate = useNavigate();
  const { data: methods, isLoading, isError } = useWithdrawMethods();

  const handleSelectMethod = (method) => {
    navigate("/retrait", { state: { selectedMethod: method } });
  };

  if (isLoading) {
    return (
      <p className="withdraw-loading">
        {t("withdraws.loading")}
      </p>
    );
  }

  if (isError) {
    return (
      <p className="withdraw-error">
        ❌ {t("withdraws.error")}
      </p>
    );
  }

  if (!methods || methods.length === 0) {
    return (
      <p className="withdraw-empty">
        {t("withdraws.empty")}
      </p>
    );
  }

  return (
    <div className="withdraw-container">
      <h2 className="withdraw-title">
        💸 {t("withdraws.title")}
      </h2>

      <div className="withdraw-list">
        {methods.map((method) => (
          <motion.div
            key={method.id}
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
              <p>
                {method.country || t("withdraws.noCountry")} {/* ✅ corrigé */}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}