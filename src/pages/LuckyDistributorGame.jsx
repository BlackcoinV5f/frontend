import React, { useState } from "react";
import "./LuckyDistributorGame.css";
import { useUser } from "../contexts/UserContext";
import { useBalance } from "../hooks/useBalance";

export default function LuckyDistributorGame() {
  const { user, axiosInstance } = useUser();
  const { data: balance = 0, refetch: refetchBalance } = useBalance();

  const [gameId, setGameId] = useState(null);
  const [cards, setCards] = useState([]);
  const [level, setLevel] = useState(1);
  const [reward, setReward] = useState(0);
  const [loot, setLoot] = useState([]);
  const [busy, setBusy] = useState(false);
  const [bet, setBet] = useState(100);
  const [message, setMessage] = useState(null);

  // =========================
  // START GAME
  // =========================
  const startGame = async () => {
    if (busy) return;

    if (bet <= 0) {
      return setMessage({ type: "error", text: "Mise invalide !" });
    }

    if (bet > balance) {
      return setMessage({ type: "error", text: "Solde insuffisant !" });
    }

    setBusy(true);

    try {
      const { data } = await axiosInstance.post("/luckygame/start", {
        bet,
      });

      setGameId(data.game_id);
      setLevel(data.level); // ✅ corrigé
      setReward(data.reward); // ✅ corrigé
      setLoot([]);

      setCards(
        (data.multipliers || []).map((_, idx) => ({
          id: idx,
          flipped: false,
          reward: null,
        }))
      );

      await refetchBalance();
    } catch (err) {
      console.error("❌ startGame:", err);
      setMessage({ type: "error", text: "Erreur démarrage partie" });
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

      // ✅ sécurisation multipliers
      setCards((prev) =>
        prev.map((c, i) => ({
          ...c,
          flipped: true,
          reward: data.multipliers ? data.multipliers[i] : null,
        }))
      );

      // ✅ sécurisation loot
      if (data.chosen_multiplier) {
        setLoot((prev) => [
          ...prev,
          {
            label: `${data.chosen_multiplier}x`,
            value: data.chosen_multiplier,
          },
        ]);
      }

      setReward(data.reward || 0);

      if (data.result === "continue") {
        setTimeout(() => {
          setLevel(data.level);

          setCards(
            (data.next_multipliers || []).map((_, idx) => ({
              id: idx,
              flipped: false,
              reward: null,
            }))
          );
        }, 1200);
      }

      if (data.result === "lose") {
        setTimeout(() => {
          setMessage({
            type: "lose",
            text: "Dommage 😢 Tu as perdu ta mise !",
          });
          resetGame();
        }, 1200);
      }

    } catch (err) {
      console.error("❌ playCard:", err);
      setMessage({ type: "error", text: "Erreur de jeu" });
    } finally {
      setBusy(false);
    }
  };

  // =========================
  // CASHOUT
  // =========================
  const cashout = async () => {
    if (!gameId || busy) return;

    setBusy(true);

    try {
      const { data } = await axiosInstance.post("/luckygame/cashout", {
        game_id: gameId,
      });

      setMessage({
        type: "win",
        text: `💰 Encaissement réussi : ${data.reward} pts`,
      });

      resetGame();
      await refetchBalance();

    } catch (err) {
      console.error("❌ cashout:", err);
      setMessage({ type: "error", text: "Erreur encaissement" });
    } finally {
      setBusy(false);
    }
  };

  // =========================
  // RESET
  // =========================
  const resetGame = () => {
    setGameId(null);
    setCards([]);
    setLoot([]);
    setReward(0);
    setLevel(1);
  };

  // =========================
  // LEVEL UI
  // =========================
  const getVisibleLevels = () => {
    const start = Math.max(1, level - 2);
    const end = Math.min(25, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="lucky-game">

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
                    <div className="card-back">
                      {card.reward !== null ? `${card.reward}x` : "??"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
                ENCAISSER ({reward} pts)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}