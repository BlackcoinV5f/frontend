import React from "react";

const BalancePage = ({ points, pointsHistory }) => {
  // ✅ Vérifier si pointsHistory est défini avant d'utiliser slice()
  const history = pointsHistory ? pointsHistory.slice(-100).reverse() : [];

  return (
    <div className="page-container">
      <h2>💰 Balance des Points</h2>
      <p>Total des points : {points} pts</p>

      <h3>📜 Historique des derniers points gagnés :</h3>
      <ul>
        {history.length > 0 ? (
          history.map((entry, index) => (
            <li key={index}>{entry} pts</li>
          ))
        ) : (
          <p>Aucun historique de points pour le moment.</p>
        )}
      </ul>
    </div>
  );
};

export default BalancePage;
