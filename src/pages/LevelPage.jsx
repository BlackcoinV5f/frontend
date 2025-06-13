import React, { useEffect } from "react";
import "./LevelPage.css";
import { useUser } from "../contexts/UserContext";

const LevelPage = ({ level }) => {
  const { user, fetchBalance } = useUser();

  useEffect(() => {
    if (user?.telegram_id) {
      fetchBalance(user.telegram_id)
        .then(() => console.log("Solde mis à jour."))
        .catch((err) => console.error("Erreur de récupération du solde :", err));
    }
  }, [user, fetchBalance]);

  return (
    <div className="page-container">
      <h2>🏆 Niveau actuel : {level}</h2>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${(level / 9) * 100}%` }}></div>
      </div>
      <p>Vous êtes au niveau {level} sur 9.</p>
    </div>
  );
};

export default LevelPage;
