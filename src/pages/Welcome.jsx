// src/pages/Welcome.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../contexts/UserContext";
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
    link: "https://t.me/+VXuf93TxzKxlMzE0",
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

  const [step, setStep] = useState(1);
  const [tasks, setTasks] = useState(
    () =>
      TASKS_CONFIG.reduce((acc, task) => {
        acc[task.key] = false;
        return acc;
      }, {})
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirection si non connecté
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
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      persistUserData(data.user);
      navigate("/login", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Une erreur est survenue.";
      setError(
        Array.isArray(message)
          ? message.map((e) => e.msg).join(", ")
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1) setStep(2);
    else completeWelcomeTasks();
  };

  if (!user) return <div className="loader">Chargement...</div>;

  return (
    <motion.div
      className="welcome-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
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
  return (
    <motion.div
      className="welcome-step"
      key="step1"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 50, opacity: 0 }}
    >
      <div className="welcome-card">
        {user.avatar_url && (
          <motion.img
            src={user.avatar_url}
            alt="Profile"
            className="welcome-avatar"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}

        <h2>🎉 Bienvenue {user.first_name} !</h2>

        <p>
          Merci de rejoindre notre communauté. Votre sécurité est notre
          priorité.
        </p>

        <p className="warning-text">
          ⚠️ Ne partagez jamais vos informations sensibles.
        </p>

        <div className="security-badge">
          <FaLock size={32} />
        </div>

        <motion.button
          className="next-button"
          onClick={handleNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continuer <FaArrowRight />
        </motion.button>
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
  return (
    <motion.div
      className="welcome-step"
      key="step2"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
    >
      <div className="tasks-container">
        <h2>📝 Activez votre compte</h2>

        <div className="total-points">
          🎯 Points : <strong>{totalPoints}/{TOTAL_AVAILABLE_POINTS}</strong>
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

        <motion.button
          className="next-button"
          disabled={!allTasksCompleted || loading}
          onClick={handleNext}
        >
          {loading ? (
            <>
              <FaSpinner className="spin" /> Traitement...
            </>
          ) : allTasksCompleted ? (
            <>
              <FaCheck /> Terminer
            </>
          ) : (
            "Complétez toutes les tâches"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ============================
   TASK ITEM
============================ */

function TaskItem({ task, completed, loading, onComplete, index }) {
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
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="task-icon" style={{ color: task.color }}>
        {task.icon}
      </div>

      <div className="task-content">
        <a
          href={task.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleVisit}
        >
          Rejoindre {task.name}
        </a>

        <span>+{task.points} pts</span>
      </div>

      {completed ? (
        <div className="task-status">
          <FaCheck />
        </div>
      ) : (
        <button
          onClick={handleValidate}
          disabled={!delayActive || loading}
        >
          {!visited
            ? "Visitez d’abord"
            : !delayActive
            ? "Patientez 10s..."
            : "Valider"}
        </button>
      )}
    </motion.div>
  );
}
