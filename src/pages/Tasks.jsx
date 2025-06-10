import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Tasks.css";
import youtubeIcon from "../assets/youtube.png";
import facebookIcon from "../assets/facebook.png";
import tiktokIcon from "../assets/tiktok.png";
import twitterIcon from "../assets/twitter.png";

const tasksList = [
  { id: 1, platform: "YouTube", points: 500, link: "https://youtube.com", icon: youtubeIcon, validationCode: "YT123" },
  { id: 2, platform: "Facebook", points: 300, link: "https://facebook.com", icon: facebookIcon, validationCode: "FB456" },
  { id: 3, platform: "TikTok", points: 700, link: "https://tiktok.com", icon: tiktokIcon, validationCode: "TT789" },
  { id: 4, platform: "Twitter", points: 400, link: "https://twitter.com", icon: twitterIcon, validationCode: "TW321" },
];

const Tasks = () => {
  const navigate = useNavigate();
  const [completedTasks, setCompletedTasks] = useState([]);
  
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("completedTasks")) || [];
    setCompletedTasks(stored);
  }, []);

  const handleTaskClick = (task) => {
    window.open(task.link, "_blank");
    setTimeout(() => navigate(`/validate-task/${task.id}`), 1000);
  };

  // Fonction appelée depuis ValidateTask (à propager via contexte ou prop)
  const handleValidateTask = (taskId) => {
    if (!completedTasks.includes(taskId)) {
      const updated = [...completedTasks, taskId];
      setCompletedTasks(updated);
      localStorage.setItem("completedTasks", JSON.stringify(updated));
    }
  };

  const availableTasks = tasksList.filter(t => !completedTasks.includes(t.id));

  return (
    <div className="tasks-container">
      <h2>📋 Tâches à accomplir</h2>
      <p className="tasks-counter">✅ Tâches accomplies : {completedTasks.length} / {tasksList.length}</p>
      <div className="tasks-list">
        {availableTasks.length > 0 ? (
          availableTasks.map(task => (
            <div key={task.id} className="task-item">
              <span>{task.platform} - 🏆 {task.points} pts</span>
              <button onClick={() => handleTaskClick(task)} className="task-button">
                <img src={task.icon} alt={task.platform} className="task-icon" />
              </button>
            </div>
          ))
        ) : (
          <p>🎉 Vous avez accompli toutes les tâches disponibles !</p>
        )}
      </div>
    </div>
  );
};

export default Tasks;
