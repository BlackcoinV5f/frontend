import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTrophy, FaExternalLinkAlt, FaClock } from "react-icons/fa";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { useTranslation } from "react-i18next";
import "./Tasks.css";

const Tasks = () => {
  const { t } = useTranslation("tasks");
  const { user } = useUser();
  const navigate = useNavigate();
  const { data, isLoading, isError, startTask } = useTasks();
  const [tasks, setTasks] = useState([]);

  // =========================
  // 🔄 FORMAT DATA
  // =========================
  useEffect(() => {
    if (!data?.tasks) return;
    const styledTasks = data.tasks.map((task) => ({
      ...task,
      icon: task.logo ? `/${task.logo}` : "/default.png",
      color: "#ccc",
      time_left: task.time_left || 0,
    }));
    setTasks(styledTasks);
  }, [data]);

  // =========================
  // ⏱ TIMER
  // =========================
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prev) =>
        prev.map((task) =>
          task.time_left > 0
            ? { ...task, time_left: task.time_left - 1 }
            : task
        )
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // =========================
  // ❌ NOT LOGGED
  // =========================
  if (!user) {
    return (
      <div className="tasks-container">
        <p>{t("tasksPage.login_required")}</p>
      </div>
    );
  }

  // =========================
  // ⏳ LOADING
  // =========================
  if (isLoading) {
    return (
      <div className="tasks-container" style={{ justifyContent: "center", alignItems: "center" }}>
        <div className="loading-spinner">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  // =========================
  // ❌ ERROR
  // =========================
  if (isError) {
    return (
      <div className="tasks-container">
        <p>{t("tasksPage.error")}</p>
      </div>
    );
  }

  // =========================
  // 📊 PROGRESS
  // =========================
  const completedCount = data?.completedCount || 0;
  const totalTasks = (data?.tasks?.length || 0) + completedCount;
  const progress = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  // =========================
  // 🎯 ACTIONS
  // =========================
  const handleTaskClick = (task) => {
    startTask.mutate(task.id);
    window.open(task.link, "_blank");
  };

  const handleValidateClick = (task) => {
    navigate(`/tasks/${task.id}/validate`);
  };

  // =========================
  // ⏱ FORMAT TIME
  // =========================
  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // =========================
  // 🧱 RENDER
  // =========================
  return (
    <motion.div className="tasks-container">

      {/* ── HEADER ── */}
      <div className="tasks-header">
        <h2>{t("tasksPage.title")}</h2>
        <div className="progress-container">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              animate={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">{completedCount}</span>
        </div>
      </div>

      {/* ── LISTE : chaque tâche = carte séparée ── */}
      <div className="tasks-list">
        <AnimatePresence>
          {tasks.map((task) => {
            const isValid = task.completed;

            return (
              <motion.div
                key={task.id}
                className="task-item"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="task-content">

                  {/* Info gauche */}
                  <div className="task-info">
                    <div className="task-platform">
                      <img src={task.icon} alt={task.title} />
                      <span>{task.title}</span>
                    </div>
                    <div className="task-points">
                      <FaTrophy />
                      <span>{task.reward_points} {t("tasksPage.points")}</span>
                    </div>
                  </div>

                  {/* Action droite */}
                  <div className="task-actions">
                    {isValid ? (
                      <span className="completed-badge">
                        {t("tasksPage.completed")}
                      </span>
                    ) : task.started_at && task.time_left > 0 ? (
                      <div className="cooldown-container">
                        <div className="cooldown-timer">
                          <FaClock />
                          <span>{formatTime(task.time_left)}</span>
                        </div>
                        <button className="validate-button disabled" disabled>
                          <FaCheck /> {t("tasksPage.validate")}
                        </button>
                      </div>
                    ) : task.started_at ? (
                      <button
                        className="validate-button"
                        onClick={() => handleValidateClick(task)}
                      >
                        <FaCheck /> {t("tasksPage.validate")}
                      </button>
                    ) : (
                      <button
                        className="task-button"
                        onClick={() => handleTaskClick(task)}
                      >
                        <FaExternalLinkAlt /> {t("tasksPage.start")}
                      </button>
                    )}
                  </div>

                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="no-tasks">{t("tasksPage.done")}</div>
        )}
      </div>

    </motion.div>
  );
};

export default Tasks;
