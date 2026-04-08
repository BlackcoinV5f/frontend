// src/pages/Tasks.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTrophy, FaExternalLinkAlt, FaClock } from "react-icons/fa";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./Tasks.css";

const Tasks = () => {
  const { user, axiosInstance } = useUser();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  // ✅ React Query (même logique que Check.jsx)
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["tasks", user?.id],
    queryFn: async () => {
      const [tasksRes, completedRes] = await Promise.all([
        axiosInstance.get("/tasks/me/pending"),
        axiosInstance.get("/tasks/me/completed-count"),
      ]);

      return {
        tasks: tasksRes.data,
        completedCount: completedRes.data.completed_tasks || 0,
      };
    },
    enabled: !!user,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // ✅ Transformer les tâches quand data arrive
  useEffect(() => {
    if (!data?.tasks) return;

    const styledTasks = data.tasks.map((t) => ({
      ...t,
      icon: t.logo ? `/${t.logo}` : "/default.png",
      color: "#ccc",
      time_left: t.time_left || 0,
    }));

    setTasks(styledTasks);
  }, [data]);

  // ✅ Timer local (comme avant)
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t.time_left > 0 ? { ...t, time_left: t.time_left - 1 } : t
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!user) {
    return (
      <div className="tasks-container">
        ⚠️ Connecte-toi pour voir les tâches
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="tasks-container">
        ❌ Erreur chargement des tâches
      </div>
    );
  }

  const completedCount = data?.completedCount || 0;
  const totalTasks = tasks.length + completedCount;
  const progress =
    totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  const handleTaskClick = async (task) => {
    try {
      await axiosInstance.post(`/tasks/${task.id}/start`);
      window.open(task.link, "_blank");
      refetch(); // ✅ refresh propre React Query
    } catch (err) {
      console.error("❌ Erreur démarrage tâche :", err);
    }
  };

  const handleValidateClick = (task) => {
    navigate(`/tasks/${task.id}/validate`);
  };

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

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

      <motion.div
        className="tasks-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <AnimatePresence>
          {tasks.map((task, index) => (
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
                    <img
                      src={task.icon}
                      alt={task.title}
                      className="platform-icon"
                    />
                    <span>{task.title}</span>
                  </div>

                  <div className="task-points">
                    <FaTrophy className="trophy-icon" />
                    <span>{task.reward_points} pts</span>
                  </div>
                </div>

                {/* LOGIQUE */}
                {task.completed ? (
                  <div className="completed-badge">✅ Complétée</div>
                ) : task.started_at && task.time_left > 0 ? (
                  <div className="cooldown-container">
                    <div className="cooldown-timer">
                      <FaClock />
                      <span>{formatTime(task.time_left)}</span>
                    </div>
                    <button className="validate-button disabled" disabled>
                      <FaCheck /> Valider
                    </button>
                  </div>
                ) : task.started_at && task.time_left === 0 ? (
                  <button
                    onClick={() => handleValidateClick(task)}
                    className="validate-button"
                  >
                    <FaCheck /> Valider
                  </button>
                ) : (
                  <button
                    onClick={() => handleTaskClick(task)}
                    className="task-button"
                  >
                    <FaExternalLinkAlt /> Commencer
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="no-tasks">
            🎉 Vous avez terminé toutes les tâches !
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Tasks;