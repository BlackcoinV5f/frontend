import React, { useEffect, useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import { FaTrophy, FaCrown, FaStar, FaArrowUp } from "react-icons/fa";
import "./LevelPage.css";

const LevelPage = ({ level }) => {
  const { user, fetchBalance } = useUser();
  const [progress, setProgress] = useState(0);
  const [isLevelUp, setIsLevelUp] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (user?.telegram_id) {
      fetchBalance(user.telegram_id)
        .then(() => console.log("Solde mis à jour."))
        .catch((err) => console.error("Erreur de récupération du solde :", err));
    }
  }, [user, fetchBalance]);

  useEffect(() => {
    // Animation de la barre de progression
    const targetProgress = (level / 9) * 100;
    const animateProgress = async () => {
      await controls.start({
        width: `${targetProgress}%`,
        transition: { duration: 1.5, ease: "easeInOut" }
      });
      
      // Effet de niveau supérieur si le niveau a augmenté
      if (level > 1 && progress < targetProgress) {
        setIsLevelUp(true);
        setTimeout(() => setIsLevelUp(false), 2000);
      }
      setProgress(targetProgress);
    };
    animateProgress();
  }, [level, controls]);

  return (
    <motion.div
      className="level-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="level-header"
        whileHover={{ scale: 1.05 }}
      >
        <FaTrophy className="trophy-icon" />
        <motion.h2 className="level-title">
          Niveau {level}
          <AnimatePresence>
            {isLevelUp && (
              <motion.span
                className="level-up-badge"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <FaArrowUp /> Level Up!
              </motion.span>
            )}
          </AnimatePresence>
        </motion.h2>
        <FaTrophy className="trophy-icon" />
      </motion.div>

      <div className="level-progress-container">
        <div className="level-progress-bar">
          <motion.div
            className="level-progress"
            animate={controls}
            initial={{ width: "0%" }}
          />
          <div className="progress-stars">
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                className={`progress-star ${i < level ? "active" : ""}`}
                animate={{
                  scale: i < level ? [1, 1.2, 1] : 1,
                  opacity: i < level ? 1 : 0.3
                }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <FaStar />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <motion.p 
        className="level-info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Progression vers le niveau {level + 1}
      </motion.p>

      <div className="level-badges">
        <motion.div
          className={`level-badge ${level >= 5 ? "unlocked" : "locked"}`}
          whileHover={{ scale: 1.1 }}
        >
          <FaCrown />
          <span>Expert</span>
        </motion.div>
        
        <motion.div
          className={`level-badge ${level >= 9 ? "unlocked" : "locked"}`}
          whileHover={{ scale: 1.1 }}
        >
          <FaStar />
          <span>Maître</span>
        </motion.div>
      </div>

      <motion.div 
        className="level-milestones"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h3>Prochains niveaux :</h3>
        <ul>
          {[2, 3, 5, 9].map((milestone) => (
            <motion.li
              key={milestone}
              className={level >= milestone ? "achieved" : ""}
              whileHover={{ scale: 1.05 }}
            >
              Niveau {milestone} - {getMilestoneReward(milestone)}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
};

// Fonction pour obtenir la récompense du palier
const getMilestoneReward = (level) => {
  const rewards = {
    2: "Badge Bronze",
    3: "Badge Argent",
    5: "Badge Or",
    9: "Badge Diamant"
  };
  return rewards[level] || "Récompense spéciale";
};

export default LevelPage;