import React, { useState } from "react";
import "./LuckyDistributorGame.css";
import { useUser } from "../contexts/UserContext";
import { useBalance } from "../hooks/useBalance";
import { useTranslation } from "react-i18next";

export default function LuckyDistributorGame() {
  // ✅ namespace correct
  const { t } = useTranslation("game");

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

  const startGame = async () => {
    if (busy) return;

    if (bet <= 0) {
      return setMessage({ type: "error", text: t("game.invalid_bet") });
    }

    if (bet > balance) {
      return setMessage({ type: "error", text: t("game.insufficient_balance") });
    }

    setBusy(true);

    try {
      const { data } = await axiosInstance.post("/luckygame/start", { bet });

      setGameId(data.game_id);
      setLevel(data.level);
      setReward(data.reward);
      setLoot([]);

      setCards(
        Array.from({ length: 4 }, (_, idx) => ({
          id: idx,
          flipped: false,
          reward: null,
        }))
      );

      await refetchBalance();
    } catch {
      setMessage({ type: "error", text: t("game.start_error") });
    } finally {
      setBusy(false);
    }
  };

  const playCard = async (index) => {
    if (busy || !gameId) return;

    setBusy(true);

    try {
      const { data } = await axiosInstance.post("/luckygame/play", {
        game_id: gameId,
        choice_index: index,
      });

      setCards((prev) =>
        prev.map((c, i) =>
          i === index
            ? { ...c, flipped: true, reward: data.selected_value }
            : c
        )
      );

      if (data.selected_value > 0) {
        setLoot((prev) => [
          ...prev,
          {
            label: `${data.selected_value}x`,
            value: data.selected_value,
          },
        ]);
      }

      setReward(data.reward || 0);

      if (data.result === "continue") {
        setTimeout(() => {
          setLevel(data.level);
          setCards(
            Array.from({ length: 4 }, (_, idx) => ({
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
            text: t("game.lose"),
          });
          resetGame();
        }, 1200);
      }
    } catch {
      setMessage({ type: "error", text: t("game.play_error") });
    } finally {
      setBusy(false);
    }
  };

  const cashout = async () => {
    if (!gameId || busy) return;

    setBusy(true);

    try {
      const { data } = await axiosInstance.post("/luckygame/cashout", {
        game_id: gameId,
      });

      setMessage({
        type: "win",
        text: t("game.cashout_success", { amount: data.reward }),
      });

      resetGame();
      await refetchBalance();
    } catch {
      setMessage({ type: "error", text: t("game.cashout_error") });
    } finally {
      setBusy(false);
    }
  };

  const resetGame = () => {
    setGameId(null);
    setCards([]);
    setLoot([]);
    setReward(0);
    setLevel(1);
  };

  const getVisibleLevels = () => {
    const start = Math.max(1, level - 2);
    const end = Math.min(25, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

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
            <div key={lvl} className={`level-circle ${lvl === level ? "active" : ""}`}>
              {lvl}
            </div>
          ))}
        </div>
      )}

      <div className="game-board">

        <div className="user-info">
          <div className="user-meta">
            <span className="username">
              {user?.username || t("game.player")}
            </span>
            <span className="balance">
              {t("game.balance")} : {balance} pts
            </span>
          </div>
        </div>

        {!gameId && (
          <div className="bet-section">
            <label>{t("game.bet")} : </label>

            <input
              type="number"
              min="1"
              value={bet}
              onChange={(e) => setBet(parseInt(e.target.value) || 0)}
            />

            <button onClick={startGame} disabled={busy}>
              🎮 {t("game.start")}
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
                      {card.reward !== null ? `${card.reward}x` : t("game.unknown", "??")}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="loot-section">
              <div className="loot-box">
                <span>{t("game.loot")}</span>
                <span>{t("game.items", { count: loot.length })}</span>
              </div>

              <button className="cashout-btn" onClick={cashout} disabled={busy}>
                {t("game.cashout")} ({reward} pts)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}