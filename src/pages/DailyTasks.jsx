import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { useDailyTasks } from "../hooks/useDailyTasks";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import "./DailyTasks.css";

export default function DailyTasks() {
  const { t } = useTranslation("tasks");
  const { packId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const TASK_DURATION = 3600;

  // =========================
  // ⏱ TIME CALC
  // =========================
  const getRemainingTime = (started_at) => {
    if (!started_at) return null;

    const start = new Date(started_at).getTime();
    if (isNaN(start)) return null;

    const elapsed = (Date.now() - start) / 1000;
    return Math.max(0, TASK_DURATION - elapsed);
  };

  // =========================
  // 🔄 SYNC DATA
  // =========================
  useEffect(() => {
    if (!data) return;

    const enriched = data.map((task) => ({
      ...task,
      time_left: getRemainingTime(task.started_at),
    }));

    setTasks(enriched);
  }, [data]);

  // =========================
  // ⏱ TIMER
  // =========================
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prev) =>
        prev.map((task) => ({
          ...task,
          time_left: getRemainingTime(task.started_at),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // 🚫 AUTH
  // =========================
  if (!user) {
    return (
      <div className="daily-tasks-container">
        ⚠️ {t("dailyPage.login_required")}
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="daily-tasks-container">
        ❌ {t("dailyPage.error")}
      </div>
    );
  }

  // =========================
  // 🧠 HELPERS
  // =========================
  const canCompleteTask = (task) =>
    task.started_at &&
    task.time_left !== null &&
    task.time_left <= 0 &&
    !task.completed;

  const formatCountdown = (seconds) => {
    if (!seconds || seconds <= 0) return "00:00";

    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);

    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // =========================
  // ▶️ START
  // =========================
  const handleStart = async (task) => {
    try {
      const res = await startTask.mutateAsync({ taskId: task.id });

      const startedAt =
        res?.started_at ||
        res?.data?.started_at ||
        new Date().toISOString();

      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? {
                ...t,
                started_at: startedAt,
                time_left: getRemainingTime(startedAt),
              }
            : t
        )
      );

      if (task.video_url) {
        window.open(task.video_url, "_blank");
      }
    } catch (err) {
      console.error(err);
      setMessage(`❌ ${t("dailyPage.start_error")}`);
    }
  };

  // =========================
  // ✅ COMPLETE
  // =========================
  const handleComplete = async (task) => {
    try {
      await completeTask.mutateAsync({ taskId: task.id });

      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, completed: true } : t
        )
      );

      setMessage(`✅ ${t("dailyPage.completed")}`);
    } catch (error) {
      queryClient.invalidateQueries({
        queryKey: ["dailyTasks", packId, user?.id],
      });

      setMessage(
        error?.response?.data?.detail ||
          `❌ ${t("dailyPage.complete_error")}`
      );
    }
  };

  // =========================
  // 🎁 CLAIM
  // =========================
  const handleClaim = async () => {
    try {
      const res = await claimReward.mutateAsync(packId);
      setRewardInfo(res);
      setModalVisible(true);
    } catch (error) {
      setMessage(
        error?.response?.data?.detail ||
          `❌ ${t("dailyPage.claim_error")}`
      );
    }
  };

  const allCompleted =
    tasks.length > 0 && tasks.every((t) => t.completed);

  // =========================
  // 🧱 RENDER
  // =========================
  return (
    <div className="daily-tasks-container">
      <h2>{t("dailyPage.pack_title", { id: packId })}</h2>

      {message && <p className="feedback">{message}</p>}

      {tasks.length === 0 && <p>{t("dailyPage.no_tasks")}</p>}

      <ul className="tasks-list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`task-item ${task.completed ? "completed" : ""}`}
          >
            <span>
              {t(`taskspk.${task.description}`)} (
              {t(`platform.${task.platform}`)})
            </span>

            {!task.completed && (
              <button
                className={`action-btn ${
                  task.started_at ? "active" : ""
                } ${canCompleteTask(task) ? "ready" : ""}`}
                disabled={task.started_at && !canCompleteTask(task)}
                onClick={() => {
                  if (!task.started_at) handleStart(task);
                  else if (canCompleteTask(task)) handleComplete(task);
                }}
              >
                {!task.started_at && (
                  <span>▶️ {t("dailyPage.start")}</span>
                )}

                {task.started_at && !canCompleteTask(task) && (
                  <div className="timer-box">
                    <div className="timer-text">
                      ⏳ {formatCountdown(task.time_left)}
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${
                            (1 - task.time_left / TASK_DURATION) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {task.started_at && canCompleteTask(task) && (
                  <span className="ready-text">
                    ✅ {t("dailyPage.validate")}
                  </span>
                )}
              </button>
            )}

            {task.completed && (
              <span>{t("dailyPage.done")} ✔️</span>
            )}
          </li>
        ))}
      </ul>

      {/* 🎉 ALL COMPLETED */}
      {allCompleted && (
        <div className="all-completed-msg">
          <p>🎉 {t("dailyPage.all_done")}</p>
          <button className="claim-btn" onClick={handleClaim}>
            {t("dailyPage.claim")}
          </button>
        </div>
      )}

      {/* 🎁 MODAL */}
      {modalVisible && rewardInfo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>🎉 {t("dailyPage.reward")}</h3>
            <p>{rewardInfo.message}</p>
            <button
              className="ok-btn"
              onClick={() => navigate("/actions")}
            >
              {t("common.ok")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}