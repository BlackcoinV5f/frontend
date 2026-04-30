import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import { useCashMoney } from "../hooks/useCashMoney";
import { GiCash } from "react-icons/gi";
import { useTranslation } from "react-i18next";
import "./CashMoney.css";

const CashMoney = () => {
  // ✅ namespace correct
  const { t, i18n } = useTranslation("transactions");

  const { user } = useUser();
  const controls = useAnimation();

  const [animate, setAnimate] = useState(false);

  const { data, isLoading, isError } = useCashMoney();

  const cashBalance = data?.cash_balance ?? 0;

  // animation déclenchée quand le solde change
  useEffect(() => {
    if (!isLoading && data) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cashBalance, isLoading, data]);

  // animation visuelle
  useEffect(() => {
    if (animate) {
      controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.5 },
      });
    }
  }, [animate, controls]);

  if (!user) return null;

  if (isError) {
    return (
      <div className="cashmoney-card">
        {t("cash.error")}
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
      <p className="cashmoney-label">
        {t("cash.realBalance")} {/* ✅ corrigé */}
      </p>

      <motion.div
        className="cashmoney-amount"
        animate={controls}
        onClick={() => setAnimate(true)}
      >
        {isLoading ? (
          <span className="loading">
            {t("common.loading")}
          </span>
        ) : (
          <>
            <GiCash className="cash-icon" />
            {cashBalance.toLocaleString(
              i18n.language.split("-")[0], // ✅ plus propre
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}{" "}
            USDT
          </>
        )}
      </motion.div>

      <p className="cashmoney-hint">
        {t("cash.hint")}
      </p>
    </motion.div>
  );
};

export default CashMoney;