import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./SplashScreen.css";

const SplashScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!onFinish) {
      console.error("⚠️ onFinish manquant");
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 45);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onFinish(), 600);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="splash-container"
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: "blur(6px)" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* 🔝 TOP LOADING BAR */}
          <div className="top-loading">
            <motion.div
              className="top-progress"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.15 }}
            />
          </div>

          {/* ✨ PARTICLES */}
          <div className="particles">
            {[...Array(18)].map((_, i) => (
              <motion.div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  width: `${2 + Math.random() * 3}px`,
                  height: `${2 + Math.random() * 3}px`,
                }}
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 0.6, 0],
                  y: [0, -80, -160],
                  x: [0, Math.random() * 60 - 30],
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          {/* 🔥 CENTER CONTENT */}
          <div className="center-content">

            {/* 🔷 LOGO + HALO */}
            <div className="logo-wrapper">

              {/* Cercle halo externe */}
              <motion.div
                className="halo-ring halo-outer"
                animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Cercle halo interne */}
              <motion.div
                className="halo-ring halo-inner"
                animate={{ scale: [1, 1.03, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />

              {/* LOGO */}
              <motion.img
                src="/logo.png"
                alt="LTN Logo"
                className="splash-logo"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: [1, 1.06, 1], opacity: 1 }}
                transition={{
                  scale: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  opacity: { duration: 1 },
                }}
              />
            </div>

            {/* 🏷️ BRAND */}
            <motion.div
              className="brand-wrapper"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h1 className="brand-title">
                LITON <span>NETWORK</span>
              </h1>

              <div className="brand-sub">
                <div className="line" />
                <p>LTN</p>
                <div className="line" />
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;