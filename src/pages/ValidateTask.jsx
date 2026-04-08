// src/pages/ValidateTask.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheck,
  FaTimes,
  FaCoins,
  FaWallet,
  FaArrowLeft,
} from "react-icons/fa";
import { useUser } from "../contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
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
  const { axiosInstance, user } = useUser();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rewardDetails, setRewardDetails] = useState(null);

  // ✅ React Query (comme Check.jsx)
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const res = await axiosInstance.get("/tasks/");
      return res.data.find(
        (t) => String(t.id) === String(taskId)
      );
    },
    enabled: !!user && !!taskId,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // ✅ Redirection après succès
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
      const res = await axiosInstance.post(
        `/tasks/${taskId}/validate`,
        { code }
      );

      setRewardDetails(res.data.reward);
      setIsSuccess(true);
    } catch (err) {
      console.error("❌ Erreur validation :", err);

      if (err.response?.status === 400) {
        setError(err.response.data?.detail || "Code invalide");
      } else if (err.response?.status === 401) {
        setError("⚠️ Non autorisé. Veuillez vous reconnecter.");
      } else {
        setError("Erreur lors de la validation");
      }
    } finally {
      setIsValidating(false);
    }
  };

  // ❌ Pas connecté
  if (!user) {
    return (
      <div className="validate-container">
        ⚠️ Connecte-toi pour valider une tâche
      </div>
    );
  }

  // ⏳ Loading
  if (isLoading) {
    return (
      <div className="validate-container">
        Chargement...
      </div>
    );
  }

  // ❌ Erreur
  if (isError || !data) {
    return (
      <motion.div
        className="validate-container error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p>❌ Tâche introuvable.</p>
        <button onClick={() => navigate("/tasks")}>
          Retour aux tâches
        </button>
      </motion.div>
    );
  }

  const task = data;

  return (
    <motion.div
      className="validate-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
            >
              <FaCheck size={60} />
            </motion.div>

            <h2>Tâche validée avec succès 🎉</h2>

            <motion.div
              className="reward-breakdown"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="reward-item">
                <FaCoins color="#FFD700" /> +{rewardDetails?.balance} pts
              </div>
              <div className="reward-item">
                <FaWallet color="#4CAF50" /> +{rewardDetails?.bonus} pts
              </div>
              <div className="reward-total">
                Total gagné : {rewardDetails?.total} pts
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
              <div className="platform-icon">
                {platformIcons[task.platform]}
              </div>
              <h2>Validation</h2>
            </motion.div>

            <p>Entrez le code de validation fourni après la tâche</p>

            <div className="input-container">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Code de validation"
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