// src/pages/TradeGame.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useUser } from "../contexts/UserContext";
import "./tradegame.css";

export default function TradeGame() {
  const { axiosInstance, fetchBalance, user } = useUser();

  const [bet1, setBet1] = useState("");
  const [bet2, setBet2] = useState("");
  const [gameId, setGameId] = useState(null);

  const [logo, setLogo] = useState(null);
  const [multiplier, setMultiplier] = useState(1.0);
  const [multiplierMax, setMultiplierMax] = useState(5000);
  const [isCrashed, setIsCrashed] = useState(false);

  const [isFalling, setIsFalling] = useState(false);
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [cashoutMsg, setCashoutMsg] = useState(null); // ✅ placé au bon endroit

  const [logoLeft, setLogoLeft] = useState(0);
  const [logoBottom, setLogoBottom] = useState(0);
  const [logoTilt, setLogoTilt] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const wsRef = useRef(null);
  const boardRef = useRef(null);
  const logoWrapperRef = useRef(null);
  const logoImgRef = useRef(null);
  const RAF = useRef(null);

  const startTimeRef = useRef(null);
  const ANIMATION_DURATION = 8000;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  // --- Balance au montage
  useEffect(() => {
    if (user?.id) fetchBalance().then(setBalance).catch(() => {});
  }, [user, fetchBalance]);

  // --- Cleanup
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch {}
        wsRef.current = null;
      }
      if (RAF.current) cancelAnimationFrame(RAF.current);
    };
  }, []);

  // --- Calcule position selon multiplier
  const computePositionFromMultiplier = useCallback(
    (m) => {
      const board = boardRef.current;
      const logoImg = logoImgRef.current;
      if (!board || !logoImg) return { left: 0, bottom: 0, tilt: 0 };

      const boardW = board.clientWidth;
      const boardH = board.clientHeight;
      const logoW = logoImg.clientWidth;
      const logoH = logoImg.clientHeight;

      const paddingX = 12;
      const paddingBottom = 8;
      const maxBottom = Math.max(0, boardH - logoH - paddingBottom);

      let ratio =
        multiplierMax > 1
          ? Math.min(
              1,
              Math.max(
                0,
                Math.log(Math.max(m, 1)) / Math.log(Math.max(multiplierMax, 2))
              )
            )
          : Math.min(1, Math.max(0, m / Math.max(multiplierMax, 1)));

      const p0 = { x: paddingX, bottom: 0 };
      const p2 = { x: boardW - paddingX, bottom: maxBottom };
      const p1 = { x: boardW * 0.62, bottom: maxBottom * 0.55 };

      const t = ratio;
      const oneMinusT = 1 - t;

      const bx =
        oneMinusT * oneMinusT * p0.x +
        2 * oneMinusT * t * p1.x +
        t * t * p2.x;
      const by =
        oneMinusT * oneMinusT * p0.bottom +
        2 * oneMinusT * t * p1.bottom +
        t * t * p2.bottom;

      const dx =
        2 * oneMinusT * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
      const dy =
        2 * oneMinusT * (p1.bottom - p0.bottom) +
        2 * t * (p2.bottom - p1.bottom);
      let angleDeg = -Math.atan2(dy, dx) * (180 / Math.PI);
      angleDeg = Math.max(Math.min(angleDeg * 0.9, 40), -40);

      return { left: bx - logoW / 2, bottom: by, tilt: angleDeg };
    },
    [multiplierMax]
  );

  // --- Animation logo
  useEffect(() => {
    if (!logo) return;

    startTimeRef.current = startTimeRef.current ?? null;
    const step = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      let t = Math.min(1, elapsed / ANIMATION_DURATION);
      t = easeOutCubic(t);

      const board = boardRef.current;
      const logoImg = logoImgRef.current;
      if (board && logoImg) {
        const boardW = board.clientWidth;
        const boardH = board.clientHeight;
        const logoW = logoImg.clientWidth;
        const logoH = logoImg.clientHeight;
        const paddingX = 12;
        const paddingBottom = 8;
        const maxBottom = Math.max(0, boardH - logoH - paddingBottom);

        const p0 = { x: paddingX, bottom: 0 };
        const p2 = { x: boardW - paddingX, bottom: maxBottom };
        const p1 = { x: boardW * 0.62, bottom: maxBottom * 0.55 };

        const oneMinusT = 1 - t;
        const bx =
          oneMinusT * oneMinusT * p0.x +
          2 * oneMinusT * t * p1.x +
          t * t * p2.x;
        const by =
          oneMinusT * oneMinusT * p0.bottom +
          2 * oneMinusT * t * p1.bottom +
          t * t * p2.bottom;

        const dx =
          2 * oneMinusT * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
        const dy =
          2 * oneMinusT * (p1.bottom - p0.bottom) +
          2 * t * (p2.bottom - p1.bottom);
        let angleDeg = -Math.atan2(dy, dx) * (180 / Math.PI);
        angleDeg = Math.max(Math.min(angleDeg * 0.9, 40), -40);

        setLogoLeft(Math.round(bx - logoW / 2));
        setLogoBottom(Math.round(by));
        setLogoTilt(angleDeg);
      }

      if (!isCrashed) RAF.current = requestAnimationFrame(step);
    };

    RAF.current = requestAnimationFrame(step);
    return () => {
      if (RAF.current) cancelAnimationFrame(RAF.current);
    };
  }, [logo, isCrashed, easeOutCubic]);

  const onCrashFinalize = (finalMultiplier) => {
    if (finalMultiplier && !isNaN(finalMultiplier)) {
      const pos = computePositionFromMultiplier(finalMultiplier);
      setLogoLeft(pos.left);
      setLogoBottom(pos.bottom);
      setLogoTilt(pos.tilt);
    }
  };

  const onLogoError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/assets/logos/default.png";
  };

  const handlePlay = async () => {
    const b1 = Number(bet1 || 0);
    const b2 = Number(bet2 || 0);
    if (b1 <= 0 && b2 <= 0) {
      alert("Place au moins une mise.");
      return;
    }

    try {
      const res = await axiosInstance.post(
        "/tradegame/play",
        null,
        { params: { bet1: b1, bet2: b2 } }
      );
      const data = res.data;
      if (data?.error) {
        alert(data.error);
        return;
      }

      setGameId(data.game_id);
      setLogo(data.logo);
      setMultiplier(1);
      setMultiplierMax(data.max_multiplier ?? 5000);
      setIsCrashed(false);
      setIsSpinning(true);
      setIsFalling(false);
      startTimeRef.current = null;

      connectWebSocket(data.game_id);

      const newBalance = await fetchBalance();
      setBalance(newBalance);
    } catch (err) {
      console.error("Erreur play:", err);
      alert("Erreur lors du lancement de la partie.");
    }
  };

  const handleCashout = async (betKey) => {
    if (!gameId) return;
    try {
      const res = await axiosInstance.post("/tradegame/cashout", null, {
        params: {
          game_id: gameId,
          bet_key: betKey,
          cashout_multiplier: Number(multiplier),
        },
      });
      const data = res.data;
      if (data?.error) {
        alert(data.error);
        return;
      }

      // ✅ message animé
      setCashoutMsg(`✅ Cashout réussi ! Gain: ${data.gain}`);
      setTimeout(() => setCashoutMsg(null), 2500);

      const newBalance = await fetchBalance();
      setBalance(newBalance);
    } catch (err) {
      console.error("Erreur cashout:", err);
      alert("Erreur lors du cashout.");
    }
  };

  const connectWebSocket = (gid) => {
    if (!gid) return;
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
      wsRef.current = null;
    }

    const base =
      import.meta.env.VITE_BACKEND_WS_URL ||
      `${
        window.location.protocol === "https:" ? "wss" : "ws"
      }://${window.location.host}`;
    const url = `${base.replace(/\/$/, "")}/tradegame/ws/progress/${gid}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => console.info("WS connected", gid);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.multiplier !== undefined)
          setMultiplier(Number(msg.multiplier));

        if (msg.event === "crash") {
          const finalM = Number(
            msg.final_multiplier ?? msg.multiplier ?? multiplier
          );
          onCrashFinalize(finalM);
          setIsSpinning(false);
          setIsFalling(true);
          setIsCrashed(true);
          setHistory((prev) => [finalM.toFixed(2), ...prev].slice(0, 6));
          try {
            ws.close();
          } catch {}
        }
      } catch (e) {
        console.error("WS parse error", e);
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
      console.info("WS closed");
    };
    ws.onerror = (err) => console.error("WS error", err);
  };

  const boardClass = `tradegame-board ${
    gameId && !isCrashed ? "running" : ""
  } ${isCrashed ? "crashed" : ""}`.trim();

  return (
    <div className="tradegame-container">
      <div className="tradegame-balance">
        💰 Solde: <span>{balance}</span> pts
      </div>

      <div ref={boardRef} className={boardClass}>
        <div className="board-bar-bottom" />
        <div className="board-bar-left" />
        <div className="clouds-fast" aria-hidden="true" />

        {logo && (
          <div
            ref={logoWrapperRef}
            className="logo-wrapper"
            style={{
              left: `${logoLeft}px`,
              bottom: `${logoBottom}px`,
              transform: `translateX(-50%) rotate(${logoTilt}deg)`,
            }}
          >
            <img
              ref={logoImgRef}
              src={`/assets/logos/${logo}.png`}
              alt={logo}
              className={`tradegame-logo-img ${
                isSpinning && !isCrashed ? "spinning" : ""
              } ${isCrashed ? "crashed" : ""} ${
                isFalling ? "falling" : ""
              }`}
              onError={onLogoError}
              style={{ width: "60px" }}
              onAnimationEnd={() => {
                if (isFalling) {
                  setLogo(null);
                  setIsFalling(false);
                }
              }}
            />
          </div>
        )}

        <div className="tradegame-multiplier">
          {Number(multiplier).toFixed(2)}x
        </div>
      </div>

      {cashoutMsg && <div className="cashout-msg">{cashoutMsg}</div>}

      <div className="tradegame-history">
        <div className="history-list">
          {history.length === 0 ? (
            <span>N/A</span>
          ) : (
            history.map((m, i) => <span key={i}>{m}x</span>)
          )}
        </div>
      </div>

      <div className="tradegame-form">
        <div className="bet-row">
          <input
            className="tradegame-input"
            type="number"
            value={bet1}
            onChange={(e) => setBet1(e.target.value)}
            placeholder="Mise 1"
          />
          {gameId && !isCrashed ? (
            <button
              className="tradegame-btn cashout1"
              onClick={() => handleCashout("bet1")}
            >
              💸 Cashout 1
            </button>
          ) : (
            <button className="tradegame-btn play" onClick={handlePlay}>
              ▶️ Jouer
            </button>
          )}
        </div>

        <div className="bet-row">
          <input
            className="tradegame-input"
            type="number"
            value={bet2}
            onChange={(e) => setBet2(e.target.value)}
            placeholder="Mise 2"
          />
          {gameId && !isCrashed ? (
            <button
              className="tradegame-btn cashout2"
              onClick={() => handleCashout("bet2")}
            >
              💸 Cashout 2
            </button>
          ) : (
            <button className="tradegame-btn play" onClick={handlePlay}>
              ▶️ Jouer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
