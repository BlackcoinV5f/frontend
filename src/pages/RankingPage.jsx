import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../contexts/UserContext";
import { FaTrophy, FaCrown, FaMedal, FaUserAlt, FaFire } from "react-icons/fa";
import { GiLaurelsTrophy, GiPodiumWinner } from "react-icons/gi";
import "./RankingPage.css";

const RankingPage = ({ players }) => {
  const { user, fetchBalance } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [topPlayers, setTopPlayers] = useState([]);

  useEffect(() => {
    if (user?.telegram_id) {
      setIsLoading(true);
      fetchBalance(user.telegram_id)
        .then(() => {
          console.log("Solde mis à jour.");
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Erreur de récupération du solde :", err);
          setIsLoading(false);
        });
    }
  }, [user, fetchBalance]);

  useEffect(() => {
    if (players) {
      const sorted = [...players]
        .sort((a, b) => b.points - a.points)
        .slice(0, 100)
        .map((player, index) => ({
          ...player,
          rank: index + 1,
          isCurrentUser: user?.telegram_id === player.id
        }));
      setTopPlayers(sorted);
    }
  }, [players, user]);

  const getRankColor = (rank) => {
    if (rank === 1) return "#ffd700";
    if (rank === 2) return "#c0c0c0";
    if (rank === 3) return "#cd7f32";
    if (rank <= 10) return "#4cc9f0";
    return "#ffffff";
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <GiLaurelsTrophy className="rank-icon" />;
    if (rank === 2) return <GiPodiumWinner className="rank-icon" />;
    if (rank === 3) return <FaMedal className="rank-icon" />;
    if (rank <= 10) return <FaFire className="rank-icon" />;
    return <FaUserAlt className="rank-icon" />;
  };

  return (
    <motion.div
      className="ranking-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="ranking-header"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <FaTrophy className="header-icon" />
        <motion.h2>
          Classement des meilleurs joueurs
        </motion.h2>
        <FaTrophy className="header-icon" />
      </motion.div>

      {isLoading ? (
        <motion.div 
          className="loading-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="loading-spinner"></div>
          <p>Chargement du classement...</p>
        </motion.div>
      ) : (
        <>
          {topPlayers.length > 0 ? (
            <motion.ul className="leaderboard">
              <AnimatePresence>
                {topPlayers.map((player, index) => (
                  <motion.li
                    key={player.id}
                    className={`player-card ${player.isCurrentUser ? "current-user" : ""}`}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="player-rank" style={{ color: getRankColor(player.rank) }}>
                      {player.rank <= 3 ? (
                        <motion.div 
                          className="podium-badge"
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, -5, 5, 0]
                          }}
                          transition={{ 
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                        >
                          {getRankIcon(player.rank)}
                          <span>{player.rank}</span>
                        </motion.div>
                      ) : (
                        <>
                          {getRankIcon(player.rank)}
                          <span>{player.rank}</span>
                        </>
                      )}
                    </div>

                    <div className="player-info">
                      <div className="player-username">
                        {player.username}
                        {player.isCurrentUser && (
                          <motion.span 
                            className="you-badge"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                          >
                            Vous
                          </motion.span>
                        )}
                      </div>
                      <div className="player-points">
                        {player.points.toLocaleString()} pts
                      </div>
                    </div>

                    {player.rank <= 3 && (
                      <div className="player-crown">
                        <FaCrown style={{ color: getRankColor(player.rank) }} />
                      </div>
                    )}
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          ) : (
            <motion.div 
              className="empty-leaderboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <GiPodiumWinner className="empty-icon" />
              <p>Aucun joueur classé pour le moment.</p>
              <p>Soyez le premier à marquer des points !</p>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default RankingPage;