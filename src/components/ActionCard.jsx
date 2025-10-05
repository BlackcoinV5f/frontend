// src/components/ActionCard.jsx
import React from "react";
import "./ActionCard.css"; // ✅ chemin corrigé, CSS dans le même dossier

const ActionCard = ({ action, token }) => {
  return (
    <div className="action-card">
      <h3>{action.name}</h3>
      <p>Catégorie : {action.category}</p>
      <p>Prix par part : {action.price_per_part} BTC</p>
    </div>
  );
};

export default ActionCard;
