import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ValidateTask.css";

const validationCodes = {
  1: "YT123",
  2: "FB456",
  3: "TK789",
  4: "TW321",
  5: "TW123",
};

const ValidateTask = ({ points, setPoints, wallet, setWallet }) => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const task = {
    1: { platform: "YouTube", points: 500 },
    2: { platform: "Facebook", points: 300 },
    3: { platform: "TikTok", points: 700 },
    4: { platform: "Twitter", points: 400 },
    5: { platform: "YouTube", points: 100 },
  }[taskId];

  if (!task) return <p>❌ Tâche introuvable.</p>;

  const handleValidation = () => {
    if (code === validationCodes[taskId]) {
      let newPoints = points + Math.floor(task.points * 0.8);
      let newWallet = wallet + Math.floor(task.points * 0.2);
      setPoints(newPoints);
      setWallet(newWallet);
      localStorage.setItem("points", JSON.stringify(newPoints));
      localStorage.setItem("wallet", JSON.stringify(newWallet));

      let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
      completedTasks.push(parseInt(taskId));
      localStorage.setItem("completedTasks", JSON.stringify(completedTasks));

      alert(`✅ Tâche validée ! Vous avez gagné ${task.points} points.`);
      navigate("/tasks");
    } else {
      setError("❌ Code incorrect. Réessayez.");
    }
  };

  return (
    <div className="validate-container">
      <h2>🎯 Validation de la tâche {task.platform}</h2>
      <p>Entrez le code de validation fourni après l’accomplissement de la tâche.</p>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Code de validation"
      />
      {error && <p className="error">{error}</p>}
      <button onClick={handleValidation}>✅ Vérifier</button>
      <p className="info-message">
        The points collected in the tasks section are distributed over two balances:{" "}
        <strong>80%</strong> in your main balance and <strong>20%</strong> in your wallet.{" "}
        The 20% will be converted into UST or Ton and you can withdraw them at any time you wish.
      </p>
    </div>
  );
};

export default ValidateTask;
