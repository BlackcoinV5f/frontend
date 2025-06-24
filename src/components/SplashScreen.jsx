import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./SplashScreen.css";

const SplashScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!onFinish) {
      console.error("⚠️ ERREUR : onFinish n'est pas défini !");
      return;
    }

    // Animation de la barre de progression
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    // Animation de disparition
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onFinish(), 500); // Attend que l'animation se termine
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
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="particles">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="particle"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.6, 0],
                  y: [0, -50, -100],
                  x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50]
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 10, stiffness: 100 }}
          >
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="splash-logo"
              onLoad={() => console.log("Logo chargé")}
            />
          </motion.div>

          <motion.div 
            className="loading-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="loading-bar">
              <motion.div
                className="loading-progress"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <motion.div
              className="progress-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {progress}%
            </motion.div>
          </motion.div>

          <motion.div
            className="brand-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Chargement de l'expérience...
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;