import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTrophy, FaExternalLinkAlt, FaClock } from "react-icons/fa";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import { useTranslation } from "react-i18next";
import "./Tasks.css";

const Tasks = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const navigate = useNavigate();

  const { data, isLoading, isError, startTask } = useTasks();
  const [tasks, setTasks] = useState([]);

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
        ⚠️ {t("tasks.login_required")}
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
        ❌ {t("tasks.error")}
      </div>
    );
  }

  const completedCount = data?.completedCount || 0;
  const totalTasks = tasks.length + completedCount;
  const progress =
    totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  const handleTaskClick = (task) => {
    startTask.mutate(task.id);
    window.open(task.link, "_blank");
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
    <motion.div className="tasks-container">
      <div className="tasks-header">
        <h2>📋 {t("tasks.title")}</h2>

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

      <div className="tasks-list">
        <AnimatePresence>
          {tasks.map((task, index) => {
            const isValid = task.completed;

            return (
              <motion.div key={task.id} className="task-item">
                <div className="task-content">
                  <div className="task-info">
                    <div className="task-platform">
                      <img src={task.icon} alt={task.title} />
                      <span>{task.title}</span>
                    </div>

                    <div className="task-points">
                      <FaTrophy />
                      <span>
                        {task.reward_points} {t("tasks.points")}
                      </span>
                    </div>
                  </div>

                  {isValid ? (
                    <div className="completed-badge">
                      ✅ {t("tasks.completed")}
                    </div>
                  ) : task.started_at && task.time_left > 0 ? (
                    <div>
                      <FaClock />
                      <span>{formatTime(task.time_left)}</span>
                      <button disabled>
                        <FaCheck /> {t("tasks.validate")}
                      </button>
                    </div>
                  ) : task.started_at ? (
                    <button onClick={() => handleValidateClick(task)}>
                      <FaCheck /> {t("tasks.validate")}
                    </button>
                  ) : (
                    <button onClick={() => handleTaskClick(task)}>
                      <FaExternalLinkAlt /> {t("tasks.start")}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {tasks.length === 0 && (
          <div className="no-tasks">
            🎉 {t("tasks.done")}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Tasks;