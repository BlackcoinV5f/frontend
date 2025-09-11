// src/pages/Tasks.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTrophy, FaExternalLinkAlt, FaClock } from "react-icons/fa";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Tasks.css";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/tasks";

const Tasks = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [cooldowns, setCooldowns] = useState({}); 
  const [timers, setTimers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const tasksRes = await axios.get(`${API_URL}/me`, { withCredentials: true });
        const completedRes = await axios.get(`${API_URL}/me/completed-count`, { withCredentials: true });

        const platformStyles = {
          youtube: { color: "#FF0000", icon: "/assets/youtube.png" },
          facebook: { color: "#1877F2", icon: "/assets/facebook.png" },
          tiktok: { color: "#000000", icon: "/assets/tiktok.png" },
          twitter: { color: "#1DA1F2", icon: "/assets/twitter.png" },
          telegram: { color: "#0088cc", icon: "/assets/telegram.png" },
        };

        const styledTasks = tasksRes.data.map((t) => {
          const key = t.platform ? t.platform.toLowerCase() : "";
          return {
            ...t,
            color: platformStyles[key]?.color || "#ccc",
            icon: platformStyles[key]?.icon || "/assets/default.png",
          };
        });

        setTasks(styledTasks);
        setCompletedCount(completedRes.data.completed_tasks || 0);
      } catch (err) {
        console.error("Erreur chargement des tâches :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      const now = Date.now();
      const updatedTimers = {};
      Object.keys(cooldowns).forEach(taskId => {
        const endTime = cooldowns[taskId];
        updatedTimers[taskId] = endTime > now ? Math.ceil((endTime - now) / 1000) : 0;
      });
      setTimers(updatedTimers);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [cooldowns]);

  const handleTaskClick = (task) => {
    window.open(task.link, "_blank");
    const endTime = Date.now() + 2 * 60 * 1000;
    setCooldowns((prev) => ({ ...prev, [task.id]: endTime }));
    setTimers((prev) => ({ ...prev, [task.id]: 2 * 60 }));
  };

  const isTaskReady = (taskId) => {
    const endTime = cooldowns[taskId];
    return endTime ? Date.now() >= endTime : false;
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleValidateClick = (task) => {
    navigate(`/tasks/${task.id}/validate`);
  };

  const totalTasks = tasks.length + completedCount;
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <motion.div
      className="tasks-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
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
              animate={{ width: `${progress}%` }}
              transition={{ delay: 0.4, duration: 1, type: "spring" }}
            />
          </div>
          <span className="progress-text">{completedCount}</span>
        </div>
      </motion.div>

      {loading ? (
        <div className="loading-spinner">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
          <p>Chargement des tâches...</p>
        </div>
      ) : (
        <motion.div
          className="tasks-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <AnimatePresence>
            {tasks.map((task, index) => {
              const ready = isTaskReady(task.id);
              const timeRemaining = timers[task.id] || 0;
              const isCooldownActive = timeRemaining > 0 && !ready;
              return (
                <motion.div
                  key={task.id}
                  className="task-item"
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
                        <span>{task.title}</span>
                      </div>
                      <div className="task-points">
                        <FaTrophy className="trophy-icon" />
                        <span>{task.reward_points} pts</span>
                      </div>
                    </div>

                    {!cooldowns[task.id] ? (
                      <motion.button
                        onClick={() => handleTaskClick(task)}
                        className="task-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaExternalLinkAlt /> Commencer
                      </motion.button>
                    ) : isCooldownActive ? (
                      <motion.div 
                        className="cooldown-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="cooldown-timer">
                          <FaClock className="clock-icon" />
                          <span>{formatTime(timeRemaining)}</span>
                        </div>
                        <button className="validate-button disabled" disabled>
                          <FaCheck /> Valider
                        </button>
                      </motion.div>
                    ) : (
                      <motion.button
                        onClick={() => handleValidateClick(task)}
                        className="validate-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <FaCheck /> Valider
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {tasks.length === 0 && !loading && (
            <div className="no-tasks">🎉 Vous avez terminé toutes les tâches !</div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Tasks;
