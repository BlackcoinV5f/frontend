import React, { useEffect } from "react";
import { useUser } from "../contexts/UserContext";

const RankingPage = ({ players }) => {
  const { user, fetchBalance } = useUser();

  useEffect(() => {
    if (user?.telegram_id) {
      fetchBalance(user.telegram_id)
        .then(() => console.log("Solde mis à jour."))
        .catch((err) => console.error("Erreur de récupération du solde :", err));
    }
  }, [user, fetchBalance]);

  const topPlayers = players
    ? [...players].sort((a, b) => b.points - a.points).slice(0, 100)
    : [];

  return (
    <div className="page-container">
      <h2>📊 Classement des meilleurs joueurs</h2>
      <ul>
        {topPlayers.length > 0 ? (
          topPlayers.map((player, index) => (
            <li key={player.id}>
              {index + 1}. {player.username} - {player.points} pts
            </li>
          ))
        ) : (
          <p>Aucun joueur classé pour le moment.</p>
        )}
      </ul>
    </div>
  );
};

export default RankingPage;
