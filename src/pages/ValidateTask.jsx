import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheck,
  FaTimes,
  FaCoins,
  FaWallet,
  FaArrowLeft,
  FaYoutube,
  FaFacebook,
  FaTwitter,
  FaTiktok,
} from "react-icons/fa";
import "./ValidateTask.css";

// Clés = nombres
const validationCodes = {
  1: "YT123",
  2: "FB456",
  3: "TK789",
  4: "TW321",
  5: "TW123",
};

const platformIcons = {
  1: <FaYoutube size={32} color="#FF0000" />,
  2: <FaFacebook size={32} color="#1877F2" />,
  3: <FaTiktok size={32} color="#000000" />,
  4: <FaTwitter size={32} color="#1DA1F2" />,
  5: <FaYoutube size={32} color="#FF0000" />,
};

const taskData = {
  1: { platform: "YouTube", points: 500, color: "#FF0000" },
  2: { platform: "Facebook", points: 300, color: "#1877F2" },
  3: { platform: "TikTok", points: 700, color: "#000000" },
  4: { platform: "Twitter", points: 400, color: "#1DA1F2" },
  5: { platform: "YouTube", points: 100, color: "#FF0000" },
};

const ValidateTask = ({ points, setPoints, wallet, setWallet }) => {
  const { taskId } = useParams();
  const taskKey = parseInt(taskId); // Conversion en entier
  const task = taskData[taskKey];
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rewardDetails, setRewardDetails] = useState(null);

  // Redirection après validation
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/tasks");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  // Vérification des données et console.log pour débogage
  useEffect(() => {
    console.log("TaskId:", taskId, "TaskKey:", taskKey, "Task:", task);
    if (!task) {
      console.error("Tâche introuvable ou mal configurée.");
    }
  }, [taskId, taskKey, task]);

  const handleValidation = () => {
    if (!code.trim()) {
      setError("Veuillez entrer un code de validation");
      return;
    }

    setIsValidating(true);
    setError("");

    setTimeout(() => {
      if (code === validationCodes[taskKey]) {
        const mainReward = Math.floor(task.points * 0.8);
        const walletReward = Math.floor(task.points * 0.2);

        const newPoints = points + mainReward;
        const newWallet = wallet + walletReward;

        setPoints(newPoints);
        setWallet(newWallet);
        localStorage.setItem("points", JSON.stringify(newPoints));
        localStorage.setItem("wallet", JSON.stringify(newWallet));

        let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
        if (!completedTasks.includes(taskKey)) {
          completedTasks.push(taskKey);
        }
        localStorage.setItem("completedTasks", JSON.stringify(completedTasks));

        setRewardDetails({
          mainReward,
          walletReward,
          total: task.points,
        });

        setIsSuccess(true);
      } else {
        setError("Code incorrect. Réessayez.");
      }
      setIsValidating(false);
    }, 1500);
  };

  // Gestion de tâche introuvable
  if (!task) {
    return (
      <motion.div
        className="validate-container error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1>Erreur : Tâche introuvable</h1>
        <button onClick={() => navigate("/tasks")}>Retour aux tâches</button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="validate-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        className="back-button"
        onClick={() => navigate("/tasks")}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft /> Retour
      </motion.button>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            className="success-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <motion.div
              className="success-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <FaCheck size={60} />
            </motion.div>
            <h2>Tâche validée avec succès !</h2>
            <div className="reward-breakdown">
              <div className="reward-item">
                <FaCoins color="#FFD700" />
                <span>Balance principale: +{rewardDetails?.mainReward} pts</span>
              </div>
              <div className="reward-item">
                <FaWallet color="#4CAF50" />
                <span>Portefeuille: +{rewardDetails?.walletReward} pts</span>
              </div>
              <div className="reward-total">Total gagné: {rewardDetails?.total} pts</div>
            </div>
            <p className="redirect-message">Redirection vers les tâches...</p>
          </motion.div>
        ) : (
          <motion.div key="form" className="validation-form">
            <div className="task-header" style={{ backgroundColor: `${task.color}20` }}>
              <div className="platform-icon">{platformIcons[taskKey]}</div>
              <h2>Validation {task.platform}</h2>
            </div>
            <p className="instructions">
              Entrez le code de validation fourni après avoir complété la tâche sur {task.platform}.
            </p>
            <div className="input-container">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Entrez le code ici"
                className={error ? "error-input" : ""}
              />
              {error && (
                <p className="error-message">
                  <FaTimes /> {error}
                </p>
              )}
            </div>
            <button
              className={`validate-button ${isValidating ? "validating" : ""}`}
              onClick={handleValidation}
              disabled={isValidating}
            >
              {isValidating ? <span className="spinner"></span> : <><FaCheck /> Valider</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ValidateTask;
