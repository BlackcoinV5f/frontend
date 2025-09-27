import React, { useState, useEffect } from "react";
import "./LuckyDistributorGame.css";
import { useUser } from "../contexts/UserContext";

export default function LuckyDistributorGame() {
  const { user, axiosInstance } = useUser(); // ✅ axiosInstance depuis le contexte

  const [gameId, setGameId] = useState(null);
  const [cards, setCards] = useState([]);
  const [level, setLevel] = useState(1);
  const [reward, setReward] = useState(0);
  const [loot, setLoot] = useState([]);
  const [busy, setBusy] = useState(false);
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState(100);

  // =========================
  // API balance utilisateur
  // =========================
  const fetchBalance = async () => {
    try {
      const { data } = await axiosInstance.get("/balance/");
      setBalance(data.points);
    } catch (err) {
      console.error("❌ Erreur fetchBalance:", err);
    }
  };

  // =========================
  // START GAME
  // =========================
  const startGame = async () => {
    try {
      if (bet <= 0) return alert("Mise invalide !");
      if (bet > balance) return alert("Solde insuffisant !");
      setBusy(true);

      const { data } = await axiosInstance.post("/luckygame/start", {
        user_id: user.id,
        bet,
      });

      setGameId(data.game_id);
      setLevel(data.current_level);
      setReward(data.current_reward);
      setLoot([]);
      setCards(
        data.multipliers.map((_, idx) => ({
          id: idx,
          flipped: false,
          reward: null,
        }))
      );

      await fetchBalance();
    } catch (err) {
      console.error("❌ Erreur startGame:", err);
    } finally {
      setBusy(false);
    }
  };

  // =========================
  // PLAY CARD
  // =========================
  const playCard = async (index) => {
    if (busy || !gameId) return;
    setBusy(true);
    try {
      const { data } = await axiosInstance.post("/luckygame/play", {
        game_id: gameId,
        choice_index: index,
      });

      // Étape 1 : révéler toutes les cartes
      setCards((prev) =>
        prev.map((c, i) => ({
          ...c,
          flipped: true,
          reward: data.multipliers[i],
        }))
      );

      // Étape 2 : loot choisi
      setLoot((prev) => [
        ...prev,
        { label: `${data.chosen_multiplier}x`, value: data.chosen_multiplier },
      ]);

      setReward(data.reward);

      // Étape 3 : continuer ou perdu
      if (data.result === "continue") {
        setTimeout(() => {
          setLevel(data.level);
          setCards(
            data.next_multipliers?.map((_, idx) => ({
              id: idx,
              flipped: false,
              reward: null,
            })) || []
          );
        }, 2000);
      } else {
        setTimeout(() => {
          alert("Perdu ! 😢");
          setGameId(null);
          setCards([]);
          setLoot([]);
          setReward(0);
          setLevel(1);
          fetchBalance();
        }, 2000);
      }
    } catch (err) {
      console.error("❌ Erreur playCard:", err);
    } finally {
      setBusy(false);
    }
  };

  // =========================
  // CASHOUT
  // =========================
  const cashout = async () => {
    if (!gameId) return;
    try {
      const { data } = await axiosInstance.post("/luckygame/cashout", {
        game_id: gameId,
      });

      alert(`Encaissement réussi : ${data.reward} pts`);
      setGameId(null);
      setCards([]);
      setLoot([]);
      setReward(0);
      setLevel(1);

      await fetchBalance();
    } catch (err) {
      console.error("❌ Erreur cashout:", err);
    }
  };

  useEffect(() => {
    if (user) fetchBalance();
  }, [user]);

  // =========================
  // VISIBLE LEVELS (max 5)
  // =========================
  const getVisibleLevels = () => {
    const start = Math.max(1, level - 2);
    const end = Math.min(25, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="lucky-game">
      {/* Barre verticale niveaux - uniquement pendant une partie */}
      {gameId && (
        <div className="levels-bar">
          {getVisibleLevels().map((lvl) => (
            <div
              key={lvl}
              className={`level-circle ${lvl === level ? "active" : ""}`}
            >
              {lvl}
            </div>
          ))}
        </div>
      )}

      {/* Zone principale */}
      <div className="game-board">
        {/* Header utilisateur */}
        <div className="user-info">
          {user?.avatar && (
            <img
              src={
                user.avatar.startsWith("http")
                  ? user.avatar
                  : `${axiosInstance.defaults.baseURL}/${user.avatar.replace(
                      /^\/+/,
                      ""
                    )}`
              }
              alt="avatar"
              className="user-avatar"
            />
          )}
          <div className="user-meta">
            <span className="username">{user?.username || "Joueur"}</span>
            <span className="balance">Solde : {balance} pts</span>
          </div>
        </div>

        {/* Si pas de partie → zone de mise */}
        {!gameId && (
          <div className="bet-section">
            <label>Mise : </label>
            <input
              type="number"
              min="1"
              value={bet}
              onChange={(e) => setBet(parseInt(e.target.value) || 0)}
            />
            <button onClick={startGame} disabled={busy}>
              🎮 Démarrer la partie
            </button>
          </div>
        )}

        {/* Si partie en cours */}
        {gameId && (
          <>
            {/* Grille des cartes */}
            <div className="cards-grid">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`card ${card.flipped ? "flipped" : ""}`}
                  onClick={() => playCard(card.id)}
                >
                  <div className="card-inner">
                    <div className="card-front"></div>
                    <div className="card-back">{card.reward || "??"}x</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Zone loot + bouton encaisser */}
            <div className="loot-section">
              <div className="loot-box">
                <span>BUTIN OBTENU</span>
                <span>{loot.length} objets</span>
              </div>
              <button
                className="cashout-btn"
                onClick={cashout}
                disabled={busy}
              >
                ENCAISSER
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
