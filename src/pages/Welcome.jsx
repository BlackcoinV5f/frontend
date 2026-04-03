// src/pages/Welcome.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import { useTranslation } from "react-i18next";
import {
  FaTelegram,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaTiktok,
  FaCheck,
  FaLock,
  FaArrowRight,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import axios from "axios";
import "./Welcome.css";

/* ============================
   CONFIGURATION DES TÂCHES
============================ */

const TASKS_CONFIG = [
  {
    key: "telegram",
    icon: <FaTelegram size={24} />,
    name: "Telegram",
    link: "https://t.me/+2VYCu2Ygs0Q1YTk0",
    points: 1000,
    color: "#0088cc",
  },
  {
    key: "facebook",
    icon: <FaFacebook size={24} />,
    name: "Facebook",
    link: "https://www.facebook.com/share/1CjsWSj1P3/",
    points: 1000,
    color: "#1877F2",
  },
  {
    key: "twitter",
    icon: <FaTwitter size={24} />,
    name: "Twitter",
    link: "https://x.com/BlackcoinON",
    points: 1000,
    color: "#1DA1F2",
  },
  {
    key: "youtube",
    icon: <FaYoutube size={24} />,
    name: "YouTube",
    link: "https://www.youtube.com/@Blackcoinchaine",
    points: 1000,
    color: "#FF0000",
  },
  {
    key: "tiktok",
    icon: <FaTiktok size={24} />,
    name: "TikTok",
    link: "https://www.tiktok.com/@blackcoin_official",
    points: 1000,
    color: "#000000",
  },
];

const TOTAL_AVAILABLE_POINTS = TASKS_CONFIG.reduce(
  (acc, t) => acc + t.points,
  0
);

/* ============================
   COMPONENT PRINCIPAL
============================ */

export default function Welcome() {
  const navigate = useNavigate();
  const { user, persistUserData } = useUser();
  const { t } = useTranslation();

  const [step, setStep] = useState(1);
  const [tasks, setTasks] = useState(() =>
    TASKS_CONFIG.reduce((acc, task) => {
      acc[task.key] = false;
      return acc;
    }, {})
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const totalPoints = useMemo(() => {
    return TASKS_CONFIG.reduce(
      (acc, task) => (tasks[task.key] ? acc + task.points : acc),
      0
    );
  }, [tasks]);

  const allTasksCompleted = useMemo(
    () => Object.values(tasks).every(Boolean),
    [tasks]
  );

  const handleTaskComplete = (taskKey) => {
    if (!tasks[taskKey]) {
      setTasks((prev) => ({ ...prev, [taskKey]: true }));
    }
  };

  const completeWelcomeTasks = async () => {
    if (!allTasksCompleted) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/welcome/complete-tasks`,
        { total_points: TOTAL_AVAILABLE_POINTS },
        { withCredentials: true }
      );

      persistUserData(data.user);
      navigate("/login", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        t("welcome.error");

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1) setStep(2);
    else completeWelcomeTasks();
  };

  if (!user) return <div className="loader">{t("welcome.loading")}</div>;

  return (
    <motion.div className="welcome-container">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <Step1 user={user} handleNext={handleNext} />
        ) : (
          <Step2
            tasks={tasks}
            totalPoints={totalPoints}
            allTasksCompleted={allTasksCompleted}
            loading={loading}
            error={error}
            handleTaskComplete={handleTaskComplete}
            handleNext={handleNext}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ============================
   STEP 1
============================ */

function Step1({ user, handleNext }) {
  const { t } = useTranslation();

  return (
    <motion.div className="welcome-step">
      <div className="welcome-card">
        <h2>{t("welcome.step1.title", { name: user.first_name })}</h2>

        <p>{t("welcome.step1.description")}</p>

        <p className="warning-text">{t("welcome.step1.warning")}</p>

        <div className="security-badge">
          <FaLock size={32} />
        </div>

        <button className="next-button" onClick={handleNext}>
          {t("welcome.step1.continue")} <FaArrowRight />
        </button>
      </div>
    </motion.div>
  );
}

/* ============================
   STEP 2
============================ */

function Step2({
  tasks,
  totalPoints,
  allTasksCompleted,
  loading,
  error,
  handleTaskComplete,
  handleNext,
}) {
  const { t } = useTranslation();

  return (
    <motion.div className="welcome-step">
      <div className="tasks-container">
        <h2>{t("welcome.step2.title")}</h2>

        <div className="total-points">
          {t("welcome.step2.points")} :
          <strong>
            {totalPoints}/{TOTAL_AVAILABLE_POINTS}
          </strong>
        </div>

        {error && (
          <div className="error-message">
            <FaExclamationTriangle /> {error}
          </div>
        )}

        <div className="tasks-list scrollable">
          {TASKS_CONFIG.map((task, index) => (
            <TaskItem
              key={task.key}
              task={task}
              completed={tasks[task.key]}
              loading={loading}
              index={index}
              onComplete={handleTaskComplete}
            />
          ))}
        </div>

        <button
          className="next-button"
          disabled={!allTasksCompleted || loading}
          onClick={handleNext}
        >
          {loading ? (
            <>
              <FaSpinner className="spin" /> {t("welcome.step2.processing")}
            </>
          ) : allTasksCompleted ? (
            <>
              <FaCheck /> {t("welcome.step2.finish")}
            </>
          ) : (
            t("welcome.step2.completeAll")
          )}
        </button>
      </div>
    </motion.div>
  );
}

/* ============================
   TASK ITEM
============================ */

function TaskItem({ task, completed, loading, onComplete, index }) {
  const { t } = useTranslation();
  const [visited, setVisited] = useState(false);
  const [delayActive, setDelayActive] = useState(false);

  const handleVisit = () => {
    if (completed) return;

    setVisited(true);
    setDelayActive(false);

    setTimeout(() => {
      setDelayActive(true);
    }, 10000);
  };

  const handleValidate = () => {
    if (delayActive && !loading && !completed) {
      onComplete(task.key);
    }
  };

  return (
    <motion.div
      className={`task-item ${completed ? "completed" : ""}`}
      style={{ borderLeft: `4px solid ${task.color}` }}
    >
      <div className="task-icon">{task.icon}</div>

      <div className="task-content">
        <a
          href={task.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleVisit}
        >
          {t("welcome.task.join", { name: task.name })}
        </a>

        <span>
          {t("welcome.task.points", { points: task.points })}
        </span>
      </div>

      {completed ? (
        <div className="task-status">
          <FaCheck />
        </div>
      ) : (
        <button onClick={handleValidate} disabled={!delayActive || loading}>
          {!visited
            ? t("welcome.task.visitFirst")
            : !delayActive
            ? t("welcome.task.wait")
            : t("welcome.task.validate")}
        </button>
      )}
    </motion.div>
  );
}