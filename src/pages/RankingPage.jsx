import React from "react";

const RankingPage = ({ players }) => {
  // ✅ Vérifier si players est défini avant d'utiliser slice()
  const topPlayers = players ? [...players].sort((a, b) => b.points - a.points).slice(0, 100) : [];

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
