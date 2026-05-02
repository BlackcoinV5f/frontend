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
    }, 50);

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
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: "blur(6px)",
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* 🔝 BARRE EN HAUT */}
          <div className="top-loading">
            <motion.div
              className="top-progress"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.15 }}
            />
          </div>

          {/* Particles */}
          <div className="particles">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="particle"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.6, 0],
                  y: [0, -50, -100],
                  x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* 🔥 LOGO PLUS GRAND */}
          <div className="center-logo">
            <motion.img
              src="/logo.png"
              alt="Logo"
              className="splash-logo"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: 1,
              }}
              transition={{
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                opacity: { duration: 0.8 },
              }}
            />
          </div>

          {/* 🔽 POURCENTAGE SEUL (texte supprimé) */}
          <div className="progress-text">{progress}%</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;