import React from "react";
import { DollarSign, Building2, Sparkles } from "lucide-react";
import "./ActionCard.css";

// 🔹 Fonction pour retourner une icône selon la catégorie
const getCategoryIcon = (category) => {
  switch (category) {
    case "finance":
      return <DollarSign size={28} color="#16a34a" />;
    case "immobilier":
      return <Building2 size={28} color="#3b82f6" />;
    case "opportunite":
      return <Sparkles size={28} color="#facc15" />;
    default:
      return <Sparkles size={28} color="#a1a1aa" />;
  }
};

const ActionCard = ({ action }) => {
  const icon = getCategoryIcon(action.category);

  return (
    <div className="action-card">
      <div className="card-header">
        <div className="icon-container">{icon}</div>
        <h3 className="action-name">{action.name}</h3>
      </div>

      <div className="card-body">
        <p className="category">
          Catégorie : <span>{action.category}</span>
        </p>
        <p className="type">
          Type : <span>{action.type}</span>
        </p>
        <p className="price">
          Prix par part : <strong>{action.price_per_part} BTC</strong>
        </p>
        <p className="parts">
          Parts totales : <span>{action.total_parts}</span>
        </p>
      </div>

      <div className="card-footer">
        <button className="contribute-btn">Contribuer</button>
      </div>
    </div>
  );
};

export default ActionCard;
