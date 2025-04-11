import React from "react";
import "./Info.css"; // si tu veux styliser proprement

const Info = () => {
  return (
    <div className="info-container">
      <h2>📢 Informations</h2>
      <p>
        Bienvenue sur notre application communautaire. Ce projet est en constante évolution
        pour offrir de nouvelles fonctionnalités et opportunités à nos utilisateurs.
      </p>

      <h3>🚀 Évolution du projet</h3>
      <ul>
        <li>✓ Intégration complète avec Telegram WebApp</li>
        <li>✓ Système de tâches avec validation et récompenses</li>
        <li>✓ Répartition automatique des points (balance & portefeuille)</li>
        <li>✓ Interface responsive et amélioration continue de l'UX</li>
        <li>✓ Fonctionnalités à venir : NFT, marketplace, et plus encore...</li>
      </ul>

      <p>
        Merci de faire partie de l’aventure. Restez connectés pour les prochaines mises à jour !
      </p>
    </div>
  );
};

export default Info;
