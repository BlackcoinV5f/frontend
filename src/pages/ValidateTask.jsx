import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaCheck,
  FaTimes,
  FaCoins,
  FaWallet,
  FaArrowLeft,
} from "react-icons/fa";
import "./ValidateTask.css";

const platformIcons = {
  YouTube: <span style={{ color: "#FF0000" }}>▶</span>,
  Facebook: <span style={{ color: "#1877F2" }}>f</span>,
  TikTok: <span style={{ color: "#000000" }}>♫</span>,
  Twitter: <span style={{ color: "#1DA1F2" }}>🐦</span>,
};

const ValidateTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rewardDetails, setRewardDetails] = useState(null);

  // Charger la tâche depuis l’API
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/tasks/`)
      .then((res) => {
        const foundTask = res.data.find((x) => x.id === parseInt(taskId));
        setTask(foundTask || null);
      })
      .catch(() => setTask(null));
  }, [taskId]);

  // Redirection après validation réussie
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/tasks");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const handleValidation = async () => {
    if (!code.trim()) {
      setError("Veuillez entrer un code de validation");
      return;
    }

    setIsValidating(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      // On envoie le code au backend
      const res = await axios.post(
        `http://127.0.0.1:8000/tasks/${taskId}/validate`,
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Le backend doit renvoyer { mainReward, walletReward, total }
      setRewardDetails(res.data);
      setIsSuccess(true);

    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        setError("❌ Code invalide");
      } else if (err.response?.status === 401) {
        setError("⚠️ Non autorisé (connectez-vous)");
      } else {
        setError("Erreur lors de la validation");
      }
    } finally {
      setIsValidating(false);
    }
  };

  if (!task) {
    return (
      <motion.div
        className="validate-container error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p>❌ Tâche introuvable.</p>
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
            <motion.div className="success-icon" initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <FaCheck size={60} />
            </motion.div>
            <h2>Tâche validée avec succès !</h2>
            <motion.div
              className="reward-breakdown"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="reward-item">
                <FaCoins color="#FFD700" /> +{rewardDetails?.mainReward} pts (Balance principale)
              </div>
              <div className="reward-item">
                <FaWallet color="#4CAF50" /> +{rewardDetails?.walletReward} pts (Portefeuille)
              </div>
              <div className="reward-total">
                Total gagné: {rewardDetails?.total} pts
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            className="validation-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="task-header"
              style={{ backgroundColor: `${task.color || "#ccc"}20` }}
            >
              <div className="platform-icon">{platformIcons[task.platform]}</div>
              <h2>Validation {task.platform}</h2>
            </motion.div>

            <p>Entrez le code de validation fourni après avoir complété la tâche</p>
            
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

            <motion.button
              className={`validate-button ${isValidating ? "validating" : ""}`}
              onClick={handleValidation}
              disabled={isValidating}
              whileHover={!isValidating ? { scale: 1.05 } : {}}
              whileTap={!isValidating ? { scale: 0.95 } : {}}
            >
              {isValidating ? (
                <span className="spinner"></span>
              ) : (
                <>
                  <FaCheck /> Valider
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ValidateTask;
