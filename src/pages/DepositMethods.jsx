import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMoneyBillWave } from "react-icons/fa";
import { useDepositMethods } from "../hooks/useDepositMethods";
import { useTranslation } from "react-i18next";
import "./DepositMethods.css";

export default function DepositMethods() {
  // ✅ namespace correct
  const { t } = useTranslation("transactions");

  const navigate = useNavigate();
  const { data = [], isLoading, isError } = useDepositMethods();

  const goToDeposit = useCallback(
    (id) => {
      navigate(`/deposits/${id}`);
    },
    [navigate]
  );

  const goBack = useCallback(() => {
    navigate("/wallet");
  }, [navigate]);

  // ================= STATES =================

  if (isLoading) {
    return (
      <div className="methods-loading">
        <div className="spinner" />
        <p>{t("deposits.loading")}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="methods-error">
        ❌ {t("deposits.error")}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="methods-empty">
        ⚠️ {t("deposits.empty")}
      </div>
    );
  }

  // ================= RENDER =================

  return (
    <motion.div
      className="methods-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* HEADER */}
      <div className="methods-header">
        <FaMoneyBillWave className="methods-header-icon" />
        <h2>{t("deposits.title")}</h2>
      </div>

      {/* METHODS */}
      <div className="methods-grid">
        {data.map((method) => (
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

      {/* BACK */}
      <motion.button
        className="back-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={goBack}
      >
        ⬅ {t("deposits.back")}
      </motion.button>
    </motion.div>
  );
}