import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { useDailyTasks } from "../hooks/useDailyTasks";
import "./DailyTasks.css";

export default function DailyTasks() {
  const { packId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    startTask,
    completeTask,
    claimReward,
  } = useDailyTasks(packId);

  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState(null);
  const [rewardInfo, setRewardInfo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 🔹 Sync data + nettoyage immédiat
  useEffect(() => {
    if (!data) return;

    const cleaned = data.map((task) => ({
      ...task,
      time_left: Math.max(0, Math.floor(task.time_left || 0)),
    }));

    setTasks(cleaned);
  }, [data]);

  // 🔹 Timer propre
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prev) =>
        prev.map((task) => {
          if (!task.started_at || task.time_left <= 0) return task;

          return {
            ...task,
            time_left: Math.max(0, task.time_left - 1),
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!user) {
    return <div className="daily-tasks-container">⚠️ Connecte-toi</div>;
  }

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return <div className="daily-tasks-container">❌ Erreur</div>;
  }

  // 🔹 helpers corrigés
  const canCompleteTask = (task) =>
    task.started_at && task.time_left <= 0 && !task.completed;

  const formatCountdown = (seconds) => {
    if (!seconds || seconds <= 0) return "00:00";

    const total = Math.floor(seconds);
    const m = Math.floor(total / 60);
    const s = total % 60;

    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // 🔥 actions
  const handleStart = async (task) => {
    try {
      await startTask.mutateAsync({ taskId: task.id });

      // ⚠️ update local immédiat pour éviter latence UI
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? {
                ...t,
                started_at: new Date().toISOString(),
              }
            : t
        )
      );

      window.open(task.video_url, "_blank");
    } catch {
      setMessage("❌ Impossible de démarrer la tâche.");
    }
  };

  const handleComplete = async (task) => {
    try {
      await completeTask.mutateAsync({ taskId: task.id });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, completed: true } : t
        )
      );

      setMessage("✅ Tâche complétée !");
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          "❌ Impossible de compléter."
      );
    }
  };

  const handleClaim = async () => {
    try {
      const res = await claimReward.mutateAsync();
      setRewardInfo(res);
      setModalVisible(true);
    } catch (error) {
      setMessage(
        error.response?.data?.detail ||
          "❌ Impossible de réclamer."
      );
    }
  };

  const allCompleted =
    tasks.length > 0 && tasks.every((t) => t.completed);

  return (
    <div className="daily-tasks-container">
      <h2>Tâches du Pack #{packId}</h2>

      {message && <p className="feedback">{message}</p>}

      {tasks.length === 0 && <p>Aucune tâche disponible.</p>}

      {tasks.length > 0 && (
        <ul className="tasks-list">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`task-item ${
                task.completed ? "completed" : ""
              }`}
            >
              <span>
                {task.description} ({task.platform})
              </span>

              {!task.completed && (
                <button
                  onClick={() => {
                    if (!task.started_at) handleStart(task);
                    else if (canCompleteTask(task))
                      handleComplete(task);
                  }}
                >
                  {!task.started_at && "▶️ Play"}

                  {task.started_at &&
                    !canCompleteTask(task) &&
                    formatCountdown(task.time_left)}

                  {task.started_at &&
                    canCompleteTask(task) &&
                    "✅ Valider"}
                </button>
              )}

              {task.completed && <span>Complétée ✔️</span>}
            </li>
          ))}
        </ul>
      )}

      {allCompleted && (
        <div>
          🎉 Toutes les tâches terminées !
          <button onClick={handleClaim}>Réclamer</button>
        </div>
      )}

      {modalVisible && rewardInfo && (
        <div className="modal">
          <h3>🎉 Récompense</h3>
          <p>{rewardInfo.message}</p>
          <button onClick={() => navigate("/actions")}>
            OK
          </button>
        </div>
      )}
    </div>
  );
}