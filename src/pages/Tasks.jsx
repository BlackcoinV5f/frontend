import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Tasks.css";
import youtubeIcon from "../assets/youtube.png";
import facebookIcon from "../assets/facebook.png";
import tiktokIcon from "../assets/tiktok.png";
import twitterIcon from "../assets/twitter.png";

const tasksList = [
  { id: 1, platform: "YouTube", points: 500, link: "https://youtube.com", icon: youtubeIcon },
  { id: 2, platform: "Facebook", points: 300, link: "https://facebook.com", icon: facebookIcon },
  { id: 3, platform: "TikTok", points: 700, link: "https://tiktok.com", icon: tiktokIcon },
  { id: 4, platform: "Twitter", points: 400, link: "https://twitter.com", icon: twitterIcon },
];

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    setTasks(tasksList.filter(task => !completedTasks.includes(task.id))); // Filtrer les tâches non effectuées
  }, []);

  const handleTaskClick = (task) => {
    window.open(task.link, "_blank"); // Ouvre le lien de la tâche
    setTimeout(() => navigate(`/validate-task/${task.id}`), 1000); // Redirection après 1 seconde
  };

  return (
    <div className="tasks-container">
      <h2>📋 Tâches à accomplir</h2>
      <div className="tasks-list">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <div key={task.id} className="task-item">
              <span>{task.platform} - 🏆 {task.points} pts</span>
              <button onClick={() => handleTaskClick(task)} className="task-button">
                <img src={task.icon} alt={task.platform} className="task-icon" />
              </button>
            </div>
          ))
        ) : (
          <p>Aucune tâche disponible pour le moment.</p>
        )}
      </div>
    </div>
  );
};

export default Tasks;
