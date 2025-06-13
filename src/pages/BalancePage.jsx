import React, { useEffect } from "react";
import { useUser } from "../contexts/UserContext";

const BalancePage = ({ points, pointsHistory }) => {
  const { user, fetchBalance } = useUser();

  useEffect(() => {
    if (user?.telegram_id) {
      fetchBalance(user.telegram_id)
        .then(() => console.log("Balance récupérée"))
        .catch((err) => console.error("Erreur fetch balance :", err));
    }
  }, [user, fetchBalance]);

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
