import React from "react";
import "./LevelPage.css";

const LevelPage = ({ level }) => {
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
