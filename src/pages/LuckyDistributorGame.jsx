import React, { useState, useEffect } from "react";
import "./LuckyDistributorGame.css";
import { useUser } from "../contexts/UserContext";

export default function LuckyDistributorGame() {
  const { user, axiosInstance } = useUser();

  const [gameId, setGameId] = useState(null);
  const [cards, setCards] = useState([]);
  const [level, setLevel] = useState(1);
  const [reward, setReward] = useState(0);
  const [loot, setLoot] = useState([]);
  const [busy, setBusy] = useState(false);
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState(100);

  // ✅ Nouveau : message de fin de partie
  const [message, setMessage] = useState(null);

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
      if (bet <= 0) return setMessage({ type: "error", text: "Mise invalide !" });
      if (bet > balance) return setMessage({ type: "error", text: "Solde insuffisant !" });
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

      setCards((prev) =>
        prev.map((c, i) => ({
          ...c,
          flipped: true,
          reward: data.multipliers[i],
        }))
      );

      setLoot((prev) => [
        ...prev,
        { label: `${data.chosen_multiplier}x`, value: data.chosen_multiplier },
      ]);

      setReward(data.reward);

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
      } else if (data.result === "lose") {
        setTimeout(() => {
          setMessage({ type: "lose", text: "Dommage 😢 Tu as perdu ta mise !" });
          resetGame();
        }, 2000);
      } else if (data.result === "win") {
        setTimeout(() => {
          setMessage({ type: "win", text: `🎉 Bravo ! Tu as gagné ${data.reward} pts !` });
          resetGame();
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

      setMessage({ type: "win", text: `💰 Encaissement réussi : ${data.reward} pts` });
      resetGame();

      await fetchBalance();
    } catch (err) {
      console.error("❌ Erreur cashout:", err);
    }
  };

  // =========================
  // RESET GAME
  // =========================
  const resetGame = () => {
    setGameId(null);
    setCards([]);
    setLoot([]);
    setReward(0);
    setLevel(1);
    fetchBalance();
  };

  useEffect(() => {
    if (user) fetchBalance();
  }, [user]);

  const getVisibleLevels = () => {
    const start = Math.max(1, level - 2);
    const end = Math.min(25, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="lucky-game">
      {/* ✅ Popup message */}
      {message && (
        <div className={`game-message ${message.type}`}>
          {message.text}
          <button onClick={() => setMessage(null)}>✖</button>
        </div>
      )}

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

      <div className="game-board">
        <div className="user-info">
          {user?.avatar && (
            <img
              src={
                user.avatar.startsWith("http")
                  ? user.avatar
                  : `${axiosInstance.defaults.baseURL}/${user.avatar.replace(/^\/+/, "")}`
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

        {gameId && (
          <>
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

            <div className="loot-section">
              <div className="loot-box">
                <span>BUTIN OBTENU</span>
                <span>{loot.length} objets</span>
              </div>
              <button className="cashout-btn" onClick={cashout} disabled={busy}>
                ENCAISSER
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
