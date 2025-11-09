// src/pages/DailyTasks.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import LoadingSpinner from "../components/LoadingSpinner";
import "./DailyTasks.css";

export default function DailyTasks() {
  const { packId } = useParams();
  const { user, axiosInstance } = useUser();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [rewardInfo, setRewardInfo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 🔹 Récupère les tâches depuis le backend
  const fetchTasks = async () => {
    if (!user) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await axiosInstance.get(`/actions/packs/${packId}/daily-tasks`);
      setTasks(res.data || []);
    } catch (error) {
      console.error(error);
      setMessage("❌ Impossible de récupérer les tâches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [packId, user]);

  // 🔹 Démarrer une tâche
  const startTask = async (taskId, url) => {
    try {
      await axiosInstance.post(`/actions/packs/daily-tasks/${taskId}/start`);
      window.open(url, "_blank");
      await fetchTasks();
    } catch (error) {
      console.error(error);
      setMessage("❌ Impossible de démarrer la tâche.");
    }
  };

  // 🔹 Vérifie si une tâche peut être complétée
  const canCompleteTask = (task) => {
    return task.time_left <= 0 && task.started_at && !task.completed;
  };

  // 🔹 Formate le compte à rebours à partir de time_left
  const formatCountdown = (seconds) => {
    if (!seconds || seconds <= 0) return null;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // 🔹 Compléter une tâche
  const completeTask = async (taskId) => {
    setMessage(null);
    try {
      await axiosInstance.post(`/actions/packs/daily-tasks/${taskId}/complete`);
      await fetchTasks();
      setMessage("✅ Tâche complétée !");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.detail || "❌ Impossible de compléter la tâche.");
    }
  };

  // 🔹 Réclamer la récompense
  const claimReward = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await axiosInstance.post(`/actions/claim/${packId}`);
      setRewardInfo(res.data);
      setModalVisible(true);
      await fetchTasks();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.detail || "❌ Impossible de réclamer la récompense.");
    } finally {
      setLoading(false);
    }
  };

  const allCompleted = tasks.length > 0 && tasks.every((t) => t.completed);

  // 🔹 Décrémente time_left chaque seconde pour le compte à rebours
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.time_left > 0) {
            return { ...task, time_left: task.time_left - 1 };
          }
          return task;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="daily-tasks-container">
      <h2>Tâches du Pack #{packId}</h2>

      {message && (
        <p
          style={{
            color: message.startsWith("✅") ? "#16a34a" : "#ef4444",
            fontWeight: 500,
            marginBottom: "12px",
          }}
        >
          {message}
        </p>
      )}

      {tasks.length === 0 && <p>Aucune tâche disponible pour ce pack.</p>}

      {tasks.length > 0 && (
        <ul className="tasks-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
              <span>{task.description} ({task.platform})</span>

              {!task.completed && (
                <div className="task-buttons">
                  <button
                    className={`action-btn ${task.started_at ? "countdown-btn" : "play-btn"}`}
                    onClick={async () => {
                      if (!task.started_at) {
                        await startTask(task.id, task.video_url);
                      } else if (canCompleteTask(task)) {
                        await completeTask(task.id);
                      }
                    }}
                  >
                    {!task.started_at && "▶️ Play"}
                    {task.started_at && !canCompleteTask(task) && formatCountdown(task.time_left)}
                    {task.started_at && canCompleteTask(task) && "✅ Valider"}
                  </button>
                </div>
              )}

              {task.completed && <span className="status-completed">Complétée ✔️</span>}
            </li>
          ))}
        </ul>
      )}

      {allCompleted && (
        <div className="all-completed-msg">
          🎉 Toutes les tâches sont terminées ! Vous pouvez maintenant réclamer votre récompense.
          <button className="claim-btn" onClick={claimReward}>
            Réclamer
          </button>
        </div>
      )}

      {modalVisible && rewardInfo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>🎉 Récompense Réclamée !</h3>
            <p>{rewardInfo.message}</p>
            <p>💰 Montant: {rewardInfo.claimed_amount} BKC</p>
            <p>💼 Solde wallet: {rewardInfo.wallet_balance}</p>
            <p>
              ⏳ Prochaine réclamation:{" "}
              {rewardInfo.next_claim_available
                ? new Date(rewardInfo.next_claim_available).toLocaleString()
                : "—"}
            </p>
            <button
              className="ok-btn"
              onClick={() => {
                setModalVisible(false);
                navigate("/actions");
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
