import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Tasks.css";
import youtubeIcon from "../assets/youtube.png";
import facebookIcon from "../assets/facebook.png";
import tiktokIcon from "../assets/tiktok.png";
import twitterIcon from "../assets/twitter.png";
import { useUser } from "../contexts/UserContext";

// 📌 Liste des tâches (tâche Telegram en premier avec id = 0)
const tasksList = [
  {
    id: 0,
    platform: "Rejoindre le canal Telegram",
    points: 1000,
    link: "https://t.me/blackcoin202",
    icon: twitterIcon, // tu peux remplacer par une icône Telegram si tu en as une
    validationCode: null, // pas nécessaire
  },
  {
    id: 1,
    platform: "YouTube",
    points: 500,
    link: "https://youtube.com",
    icon: youtubeIcon,
    validationCode: "YT123",
  },
  {
    id: 2,
    platform: "Facebook",
    points: 300,
    link: "https://facebook.com",
    icon: facebookIcon,
    validationCode: "FB456",
  },
  {
    id: 3,
    platform: "TikTok",
    points: 700,
    link: "https://tiktok.com",
    icon: tiktokIcon,
    validationCode: "TT789",
  },
  {
    id: 4,
    platform: "Twitter",
    points: 400,
    link: "https://twitter.com",
    icon: twitterIcon,
    validationCode: "TW321",
  },
];

const Tasks = () => {
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState([]);
  const { user } = useUser();

  // 📦 Chargement initial des tâches accomplies et marquage automatique de la tâche Telegram
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("completedTasks")) || [];

    // ✅ Si l'utilisateur a déjà rejoint le canal Telegram (via useTelegram.js)
    const hasJoinedTelegram = localStorage.getItem("joinedTelegramChannel") === "true";

    if (hasJoinedTelegram && !stored.includes(0)) {
      stored.push(0);
      localStorage.setItem("completedTasks", JSON.stringify(stored));
    }

    setCompletedTasks(stored);
  }, []);

  const handleTaskClick = (task) => {
    // Si c'est la tâche Telegram, juste ouvrir le lien et ne pas rediriger
    if (task.id === 0) {
      window.open(task.link, "_blank");
      return;
    }

    // Autres tâches => redirection après ouverture
    window.open(task.link, "_blank");
    setTimeout(() => navigate(`/validate-task/${task.id}`), 1000);
  };

  const isCompleted = (id) => completedTasks.includes(id);

  return (
    <div className="tasks-container">
      <h2>📋 Tâches à accomplir</h2>
      <p className="tasks-counter">
        ✅ Tâches accomplies : {completedTasks.length} / {tasksList.length}
      </p>

      <div className="tasks-list">
        {tasksList.map((task) => (
          <div key={task.id} className={`task-item ${isCompleted(task.id) ? "task-completed" : ""}`}>
            <div className="task-content">
              <span>
                {task.platform} – 🏆 {task.points} pts{" "}
                {isCompleted(task.id) && <span className="badge-check">✅</span>}
              </span>
              <button
                onClick={() => handleTaskClick(task)}
                className="task-button"
                title={`Aller sur ${task.platform}`}
                disabled={isCompleted(task.id)}
              >
                <img src={task.icon} alt={task.platform} className="task-icon" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
