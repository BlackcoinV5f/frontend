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
  const taskKey = parseInt(taskId); // ✅ conversion ici
  const task = taskData[taskKey];
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rewardDetails, setRewardDetails] = useState(null);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/tasks");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

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
            <motion.div
              className="success-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              <FaCheck size={60} />
            </motion.div>
            <h2>Tâche validée avec succès !</h2>
            <motion.div
              className="reward-breakdown"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="reward-item">
                <FaCoins color="#FFD700" />{" "}
                <span>Balance principale: +{rewardDetails?.mainReward} pts</span>
              </div>
              <div className="reward-item">
                <FaWallet color="#4CAF50" />{" "}
                <span>Portefeuille: +{rewardDetails?.walletReward} pts</span>
              </div>
              <div className="reward-total">
                Total gagné: {rewardDetails?.total} pts
              </div>
            </motion.div>
            <motion.p
              className="redirect-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Redirection vers les tâches...
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            className="validation-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="task-header"
              style={{ backgroundColor: `${task.color}20` }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="platform-icon">{platformIcons[taskKey]}</div>
              <h2>Validation {task.platform}</h2>
            </motion.div>
            <motion.p
              className="instructions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Entrez le code de validation fourni après avoir complété la tâche sur {task.platform}
            </motion.p>
            <motion.div
              className="input-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Entrez le code ici"
                className={error ? "error-input" : ""}
              />
              {error && (
                <motion.p
                  className="error-message"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FaTimes /> {error}
                </motion.p>
              )}
            </motion.div>
            <motion.button
              className={`validate-button ${isValidating ? "validating" : ""}`}
              onClick={handleValidation}
              disabled={isValidating}
              whileHover={!isValidating ? { scale: 1.05 } : {}}
              whileTap={!isValidating ? { scale: 0.95 } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {isValidating ? <span className="spinner"></span> : (<><FaCheck /> Valider</>)}
            </motion.button>
            <motion.div
              className="reward-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="info-card">
                <h3>💡 Comment obtenir le code ?</h3>
                <p>Complétez la tâche sur {task.platform} et le code vous sera fourni.</p>
              </div>
              <div className="reward-distribution">
                <h4>Répartition des récompenses :</h4>
                <div className="distribution-bar">
                  <div
                    className="main-balance"
                    style={{ width: "80%" }}
                    data-tooltip="80% - Balance principale"
                  ></div>
                  <div
                    className="wallet-balance"
                    style={{ width: "20%" }}
                    data-tooltip="20% - Portefeuille convertible"
                  ></div>
                </div>
                <div className="distribution-labels">
                  <span><FaCoins /> 80% Balance</span>
                  <span><FaWallet /> 20% Portefeuille</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ValidateTask;
