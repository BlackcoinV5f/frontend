                                                                                                                                                                                                                                                  import React from "react";
import "./Check.css";

export default function Check() {

  const criteria = [
    "5 amis",
    "Level 5",
    "50 tasks",
    "Pack payé (optionnel)",
    "Bonus (optionnel)",
    "50M pts",
    "21 jours d'utilisation"
  ];

  return (
    <div className="check-page">
      <h2>Eligibility Check</h2>

      <div className="criteria-list">
        {criteria.map((item, index) => (
          <div key={index} className="criteria-item">
            <span>{item}</span>
            <span>❌</span>
          </div>
        ))}
      </div>

    </div>
  );
}