import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import { useRewardPoints } from "../hooks/useRewardPoints";
import { RiCoinsFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import "./RewardPoints.css";

const RewardPoints = () => {
  const { t, i18n } = useTranslation();
  const { user } = useUser();
  const controls = useAnimation();

  const [animate, setAnimate] = useState(false);

  // données
  const { data, isLoading, isError } = useRewardPoints();

  const rewardPoints = data?.balance ?? 0;

  // animation déclenchée
  useEffect(() => {
    if (!isLoading && data) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [rewardPoints, isLoading, data]);

  // animation visuelle
  useEffect(() => {
    if (animate) {
      controls.start({
        scale: [1, 1.12, 1],
        transition: { duration: 0.5 },
      });
    }
  }, [animate, controls]);

  if (!user) return null;

  if (isError) {
    return (
      <div className="rewardpoints-card">
        {t("rewards.error")}
      </div>
    );
  }

  return (
    <motion.div
      className="rewardpoints-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={() => setAnimate(true)}
    >
      {/* animation rotation */}
      <div className="coins-animation">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <RiCoinsFill className="rotating-coin" />
        </motion.div>
      </div>

      <p className="rewardpoints-label">
        {t("rewards.title")}
      </p>

      <motion.div className="rewardpoints-amount" animate={controls}>
        {isLoading ? (
          <span className="loading">
            {t("common.loading")}
          </span>
        ) : (
          <>
            {rewardPoints.toLocaleString(i18n.language)}{" "}
            <span className="unit">BKC</span>
          </>
        )}
      </motion.div>

      <p className="rewardpoints-hint">
        {t("rewards.hint")}
      </p>
    </motion.div>
  );
};

export default RewardPoints;