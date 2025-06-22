import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTelegram, FaFacebook, FaTwitter, FaYoutube, FaTiktok, FaCheck, FaLock, FaArrowRight } from "react-icons/fa";
import "./Welcome.css";

const Welcome = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [tasks, setTasks] = useState({
    telegram: false,
    facebook: false,
    twitter: false,
    youtube: false,
    tiktok: false,
  });

  const handleTaskComplete = (taskKey) => {
    setTasks((prev) => ({ ...prev, [taskKey]: true }));
  };

  const allTasksCompleted = Object.values(tasks).every(Boolean);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && allTasksCompleted) {
      // Simulation d'envoi au backend
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  const tasksConfig = [
    {
      key: "telegram",
      icon: <FaTelegram size={24} />,
      name: "Telegram",
      link: "https://t.me/blackcoin202",
      points: 1000,
      color: "#0088cc"
    },
    {
      key: "facebook",
      icon: <FaFacebook size={24} />,
      name: "Facebook",
      link: "https://www.facebook.com/share/1BxkwKdPZL/",
      points: 1000,
      color: "#1877F2"
    },
    {
      key: "twitter",
      icon: <FaTwitter size={24} />,
      name: "Twitter",
      link: "https://x.com/BlackcoinON",
      points: 1000,
      color: "#1DA1F2"
    },
    {
      key: "youtube",
      icon: <FaYoutube size={24} />,
      name: "YouTube",
      link: "https://www.youtube.com/@Blackcoinchaine",
      points: 1000,
      color: "#FF0000"
    },
    {
      key: "tiktok",
      icon: <FaTiktok size={24} />,
      name: "TikTok",
      link: "https://www.tiktok.com/@blackcoinsecurity",
      points: 1000,
      color: "#000000"
    }
  ];

  return (
    <motion.div 
      className="welcome-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            className="welcome-step"
            key="step1"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="welcome-card"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="security-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <FaLock size={32} />
              </motion.div>
              
              <h2>🎉 Bienvenue sur Blackcoin !</h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Merci de rejoindre notre communauté. Pour sécuriser votre compte, 
                activez la <strong>double authentification (2FA)</strong> sur Telegram. 
                Blackcoin vous garantit une expérience fiable, protégée et enrichissante.
              </motion.p>
              
              <motion.button
                className="next-button"
                onClick={handleNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                Continuer <FaArrowRight />
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            className="welcome-step"
            key="step2"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="tasks-container">
              <h2>📝 Activez votre compte</h2>
              <p>Complétez ces tâches pour débloquer toutes les fonctionnalités :</p>
              
              <motion.div 
                className="tasks-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {tasksConfig.map((task, index) => (
                  <motion.div
                    key={task.key}
                    className={`task-item ${tasks[task.key] ? "completed" : ""}`}
                    style={{ borderLeft: `4px solid ${task.color}` }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="task-icon" style={{ color: task.color }}>
                      {task.icon}
                    </div>
                    
                    <div className="task-content">
                      <a 
                        href={task.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="task-link"
                      >
                        Rejoindre {task.name}
                      </a>
                      <span className="task-points">+{task.points} pts</span>
                    </div>
                    
                    {tasks[task.key] ? (
                      <div className="task-status completed">
                        <FaCheck />
                      </div>
                    ) : (
                      <motion.button
                        className="task-button"
                        onClick={() => handleTaskComplete(task.key)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        Valider
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.button
                className={`next-button ${!allTasksCompleted ? "disabled" : ""}`}
                onClick={handleNext}
                disabled={!allTasksCompleted}
                whileHover={allTasksCompleted ? { scale: 1.05 } : {}}
                whileTap={allTasksCompleted ? { scale: 0.95 } : {}}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {allTasksCompleted ? (
                  <>
                    <FaCheck /> Terminer l'activation
                  </>
                ) : (
                  "Complétez toutes les tâches"
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Welcome;