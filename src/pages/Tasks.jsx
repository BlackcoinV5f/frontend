import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Tasks.css";
import youtubeIcon from "../assets/youtube.png";
import facebookIcon from "../assets/facebook.png";
import tiktokIcon from "../assets/tiktok.png";
import twitterIcon from "../assets/twitter.png";
import telegramIcon from "../assets/telegram.png";
import { useUser } from "../contexts/UserContext";
import { FaCheck, FaTrophy, FaExternalLinkAlt } from "react-icons/fa";

const tasksList = [
  {
    id: 0,
    platform: "Rejoindre le canal Telegram",
    points: 1000,
    link: "https://t.me/blackcoin202",
    icon: telegramIcon,
    validationCode: null,
    color: "#0088cc",
  },
  {
    id: 1,
    platform: "YouTube",
    points: 500,
    link: "https://youtube.com",
    icon: youtubeIcon,
    validationCode: "YT123",
    color: "#FF0000",
  },
  {
    id: 2,
    platform: "Facebook",
    points: 300,
    link: "https://facebook.com",
    icon: facebookIcon,
    validationCode: "FB456",
    color: "#1877F2",
  },
  {
    id: 3,
    platform: "TikTok",
    points: 700,
    link: "https://tiktok.com",
    icon: tiktokIcon,
    validationCode: "TT789",
    color: "#000000",
  },
  {
    id: 4,
    platform: "Twitter",
    points: 400,
    link: "https://twitter.com",
    icon: twitterIcon,
    validationCode: "TW321",
    color: "#1DA1F2",
  },
];

const Tasks = () => {
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompletedTasks = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("completedTasks")) || [];
        const hasJoinedTelegram = localStorage.getItem("joinedTelegramChannel") === "true";

        let updatedTasks = [...stored];
        
        if (hasJoinedTelegram && !stored.includes(0)) {
          updatedTasks = [...stored, 0];
          localStorage.setItem("completedTasks", JSON.stringify(updatedTasks));
        }

        setCompletedTasks(updatedTasks);
      } catch (error) {
        console.error("Error loading tasks:", error);
        setCompletedTasks([]);
      } finally {
        setLoading(false);
      }
    };

    loadCompletedTasks();
  }, []);

  const handleTaskClick = (task) => {
    if (isCompleted(task.id)) return;

    // Pour les tâches nécessitant une validation
    if (task.validationCode) {
      localStorage.setItem("pendingTaskId", task.id);
      localStorage.setItem("taskStartTime", Date.now());
    }

    window.open(task.link, "_blank");
  };

  // Vérifie si une tâche est en attente de validation au retour dans l'app
  useEffect(() => {
    const checkPendingTask = () => {
      const pendingId = localStorage.getItem("pendingTaskId");
      const taskStartTime = localStorage.getItem("taskStartTime");

      if (pendingId && taskStartTime) {
        const timeElapsed = Date.now() - parseInt(taskStartTime);
        
        // Seulement rediriger si l'utilisateur revient dans un délai raisonnable (5 minutes)
        if (timeElapsed < 5 * 60 * 1000) {
          navigate(`/validate-task/${pendingId}`);
        } else {
          // Nettoyer si trop de temps a passé
          localStorage.removeItem("pendingTaskId");
          localStorage.removeItem("taskStartTime");
        }
      }
    };

    const interval = setInterval(checkPendingTask, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  const isCompleted = (id) => completedTasks.includes(id);

  return (
    <motion.div 
      className="tasks-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="tasks-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2>📋 Tâches à accomplir</h2>
        <div className="progress-container">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(completedTasks.length / tasksList.length) * 100}%` }}
              transition={{ delay: 0.4, duration: 1, type: "spring" }}
            />
          </div>
          <span className="progress-text">
            {completedTasks.length} {/* Affiche seulement le nombre de tâches complétées */}
          </span>
        </div>
      </motion.div>

      {loading ? (
        <div className="loading-spinner">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        </div>
      ) : (
        <motion.div 
          className="tasks-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <AnimatePresence>
            {tasksList.map((task, index) => (
              <motion.div
                key={task.id}
                className={`task-item ${isCompleted(task.id) ? "task-completed" : ""}`}
                style={{ borderLeft: `4px solid ${task.color}` }}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index, type: "spring" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="task-content">
                  <div className="task-info">
                    <div className="task-platform">
                      <img src={task.icon} alt={task.platform} className="platform-icon" />
                      <span>{task.platform}</span>
                    </div>
                    <div className="task-points">
                      <FaTrophy className="trophy-icon" />
                      <span>{task.points} pts</span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => handleTaskClick(task)}
                    className="task-button"
                    disabled={isCompleted(task.id)}
                    whileHover={!isCompleted(task.id) ? { scale: 1.05 } : {}}
                    whileTap={!isCompleted(task.id) ? { scale: 0.95 } : {}}
                  >
                    {isCompleted(task.id) ? (
                      <div className="completed-badge">
                        <FaCheck /> Complété
                      </div>
                    ) : (
                      <>
                        <FaExternalLinkAlt /> Commencer
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Tasks;