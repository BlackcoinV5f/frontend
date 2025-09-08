// src/pages/Welcome.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import {
  FaTelegram, FaFacebook, FaTwitter, FaYoutube, FaTiktok,
  FaCheck, FaLock, FaArrowRight, FaExclamationTriangle, FaSpinner
} from "react-icons/fa";
import axios from "axios";
import "./Welcome.css";

const TASKS_CONFIG = [
  { key: "telegram", icon: <FaTelegram size={24} />, name: "Telegram", link: "https://t.me/blackcoin202", points: 1000, color: "#0088cc" },
  { key: "facebook", icon: <FaFacebook size={24} />, name: "Facebook", link: "https://www.facebook.com/share/1BxkwKdPZL/", points: 1000, color: "#1877F2" },
  { key: "twitter", icon: <FaTwitter size={24} />, name: "Twitter", link: "https://x.com/BlackcoinON", points: 1000, color: "#1DA1F2" },
  { key: "youtube", icon: <FaYoutube size={24} />, name: "YouTube", link: "https://www.youtube.com/@Blackcoinchaine", points: 1000, color: "#FF0000" },
  { key: "tiktok", icon: <FaTiktok size={24} />, name: "TikTok", link: "https://www.tiktok.com/@blackcoinsecurity", points: 1000, color: "#000000" }
];

export default function Welcome() {
  const navigate = useNavigate();
  const { user, persistUserData } = useUser();

  const [step, setStep] = useState(1);
  const [tasks, setTasks] = useState(() =>
    TASKS_CONFIG.reduce((acc, t) => ({ ...acc, [t.key]: false }), {})
  );
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  const handleTaskComplete = (taskKey) => {
    if (!tasks[taskKey]) {
      setTasks(prev => ({ ...prev, [taskKey]: true }));
      const task = TASKS_CONFIG.find(t => t.key === taskKey);
      if (task) setTotalPoints(prev => prev + task.points);
    }
  };

  const allTasksCompleted = Object.values(tasks).every(Boolean);

  const completeWelcomeTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = {
        total_points: TASKS_CONFIG.reduce((acc, t) => acc + t.points, 0)
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/welcome/complete-tasks`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // ✅ envoie le cookie JWT
        }
      );

      persistUserData(data.user);
      navigate("/login", { replace: true });
    } catch (err) {
      let errorMessage = "Erreur inconnue";

      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === "string") errorMessage = err.response.data.detail;
        else if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map(e => e.msg || JSON.stringify(e)).join(", ");
        } else errorMessage = JSON.stringify(err.response.data.detail);
      } else if (err.message) errorMessage = err.message;

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (allTasksCompleted) completeWelcomeTasks();
  };

  if (!user) return <div className="loader">Chargement...</div>;

  return (
    <motion.div className="welcome-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <AnimatePresence mode="wait">
        {step === 1
          ? <Step1 user={user} handleNext={handleNext} />
          : <Step2
              tasks={tasks}
              loading={loading}
              error={error}
              totalPoints={totalPoints}
              allTasksCompleted={allTasksCompleted}
              handleTaskComplete={handleTaskComplete}
              handleNext={handleNext}
            />
        }
      </AnimatePresence>
    </motion.div>
  );
}

function Step1({ user, handleNext }) {
  return (
    <motion.div className="welcome-step" key="step1" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 50, opacity: 0 }}>
      <div className="welcome-card">
        {user.avatar_url && <motion.img src={user.avatar_url} alt="Profile" className="welcome-avatar" initial={{ scale: 0 }} animate={{ scale: 1 }} />}
        <h2>🎉 Bienvenue {user.first_name} !</h2>
        <p>Activez la <strong>double authentification</strong> sur Telegram pour sécuriser votre compte.</p>
        <div className="security-badge"><FaLock size={32} /></div>
        <motion.button className="next-button" onClick={handleNext} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Continuer <FaArrowRight />
        </motion.button>
      </div>
    </motion.div>
  );
}

function Step2({ tasks, loading, error, totalPoints, allTasksCompleted, handleTaskComplete, handleNext }) {
  return (
    <motion.div className="welcome-step" key="step2" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }}>
      <div className="tasks-container">
        <h2>📝 Activez votre compte</h2>
        <p>Complétez ces tâches pour débloquer toutes les fonctionnalités :</p>
        <div className="total-points">
          🎯 Points : <strong>{totalPoints}/{TASKS_CONFIG.reduce((acc, t) => acc + t.points, 0)}</strong>
        </div>
        {error && <div className="error-message"><FaExclamationTriangle /> {error}</div>}
        <div className="tasks-list scrollable">
          {TASKS_CONFIG.map((task, index) => (
            <TaskItem key={task.key} task={task} completed={tasks[task.key]} loading={loading} onComplete={handleTaskComplete} index={index} />
          ))}
        </div>
        <motion.button
          className={`next-button ${!allTasksCompleted ? "disabled" : ""}`}
          onClick={handleNext}
          disabled={!allTasksCompleted || loading}
          whileHover={{ scale: allTasksCompleted ? 1.05 : 1 }}
        >
          {loading ? <><FaSpinner className="spin" /> Traitement...</> : allTasksCompleted ? <><FaCheck /> Terminer</> : "Complétez toutes les tâches"}
        </motion.button>
      </div>
    </motion.div>
  );
}

function TaskItem({ task, completed, loading, onComplete, index }) {
  return (
    <motion.div
      className={`task-item ${completed ? "completed" : ""}`}
      style={{ borderLeft: `4px solid ${task.color}` }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 * index }}
    >
      <div className="task-icon" style={{ color: task.color }}>{task.icon}</div>
      <div className="task-content">
        <a href={task.link} target="_blank" rel="noopener noreferrer">Rejoindre {task.name}</a>
        <span>+{task.points} pts</span>
      </div>
      {completed
        ? <div className="task-status"><FaCheck /></div>
        : <button onClick={() => onComplete(task.key)} disabled={loading}>Valider</button>}
    </motion.div>
  );
}
