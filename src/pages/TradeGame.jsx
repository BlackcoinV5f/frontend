// src/pages/TradeGame.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import { useUser } from "../contexts/UserContext";
import { useBalance } from "../hooks/useBalance";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import "./tradegame.css";

export default function TradeGame() {
  const { axiosInstance, user } = useUser();
  const queryClient = useQueryClient();
  const { t } = useTranslation("game");
  const [message, setMessage] = useState(null);
  
  // État des mises
  const [bet1, setBet1] = useState("");
  const [bet2, setBet2] = useState("");
  const [gameId, setGameId] = useState(null);
  
  // Balance - source unique avec useBalance
  const { data: balance = 0, refetch: refetchBalance } = useBalance();
  
  // État du jeu
  const [logo, setLogo] = useState(null);
  const [multiplier, setMultiplier] = useState(1.0);
  const [multiplierMax, setMultiplierMax] = useState(5000);
  const [isCrashed, setIsCrashed] = useState(false);
  const [isFalling, setIsFalling] = useState(false);
  const [history, setHistory] = useState([]);
  const [cashoutMsg, setCashoutMsg] = useState(null);
  
  // Position et animation du logo
  const [logoLeft, setLogoLeft] = useState(0);
  const [logoBottom, setLogoBottom] = useState(0);
  const [logoTilt, setLogoTilt] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Refs
  const wsRef = useRef(null);
  const boardRef = useRef(null);
  const logoWrapperRef = useRef(null);
  const logoImgRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  
  // Constantes
  const ANIMATION_DURATION = 8000;
  
  // Fonction d'easing
  const easeOutCubic = useCallback((t) => 1 - Math.pow(1 - t, 3), []);
  
  // Rafraîchir la balance
  const refreshBalance = useCallback(async () => {
    await refetchBalance();
    await queryClient.invalidateQueries(["balance"]);
  }, [refetchBalance, queryClient]);
  
  // Cleanup WebSocket et RAF
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch (e) {
          console.error("WebSocket close error:", e);
        }
        wsRef.current = null;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);
  
  // Calculer la position du logo selon le multiplicateur
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
      
      // Calcul du ratio basé sur le logarithme pour une progression naturelle
      let ratio = 0;
      if (multiplierMax > 1) {
        ratio = Math.min(
          1,
          Math.max(
            0,
            Math.log(Math.max(m, 1)) / Math.log(Math.max(multiplierMax, 2))
          )
        );
      } else {
        ratio = Math.min(1, Math.max(0, m / Math.max(multiplierMax, 1)));
      }
      
      // Points de contrôle de la courbe de Bézier
      const p0 = { x: paddingX, bottom: 0 };
      const p2 = { x: boardW - paddingX, bottom: maxBottom };
      const p1 = { x: boardW * 0.62, bottom: maxBottom * 0.55 };
      
      const t = ratio;
      const oneMinusT = 1 - t;
      
      // Courbe de Bézier quadratique
      const bx = oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x;
      const by = oneMinusT * oneMinusT * p0.bottom + 2 * oneMinusT * t * p1.bottom + t * t * p2.bottom;
      
      // Calcul de l'angle (dérivée)
      const dx = 2 * oneMinusT * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
      const dy = 2 * oneMinusT * (p1.bottom - p0.bottom) + 2 * t * (p2.bottom - p1.bottom);
      let angleDeg = -Math.atan2(dy, dx) * (180 / Math.PI);
      angleDeg = Math.max(Math.min(angleDeg * 0.9, 40), -40);
      
      return { left: bx - logoW / 2, bottom: by, tilt: angleDeg };
    },
    [multiplierMax]
  );
  
  // Animation du logo
  const animateLogo = useCallback(() => {
    if (!logo) return;
    
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
        const bx = oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * p1.x + t * t * p2.x;
        const by = oneMinusT * oneMinusT * p0.bottom + 2 * oneMinusT * t * p1.bottom + t * t * p2.bottom;
        
        const dx = 2 * oneMinusT * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
        const dy = 2 * oneMinusT * (p1.bottom - p0.bottom) + 2 * t * (p2.bottom - p1.bottom);
        let angleDeg = -Math.atan2(dy, dx) * (180 / Math.PI);
        angleDeg = Math.max(Math.min(angleDeg * 0.9, 40), -40);
        
        setLogoLeft(Math.round(bx - logoW / 2));
        setLogoBottom(Math.round(by));
        setLogoTilt(angleDeg);
      }
      
      if (!isCrashed && t < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    
    rafRef.current = requestAnimationFrame(step);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [logo, isCrashed, easeOutCubic, ANIMATION_DURATION]);
  
  // Démarrer l'animation quand le logo change
  useEffect(() => {
    if (!logo) return;
    const cleanup = animateLogo();
    return cleanup;
  }, [logo, animateLogo]);
  
  // Gérer le crash
  const onCrashFinalize = useCallback((finalMultiplier) => {
    if (finalMultiplier && !isNaN(finalMultiplier)) {
      const pos = computePositionFromMultiplier(finalMultiplier);
      setLogoLeft(pos.left);
      setLogoBottom(pos.bottom);
      setLogoTilt(pos.tilt);
    }
  }, [computePositionFromMultiplier]);
  
  // Gestion des erreurs de chargement d'image
  const onLogoError = useCallback((e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/assets/logos/default.png";
  }, []);
  
  // Connexion WebSocket
  const connectWebSocket = useCallback((gameId) => {
    if (!gameId) return;
    
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (e) {
        console.error("WebSocket close error:", e);
      }
      wsRef.current = null;
    }
    
    const base = import.meta.env.VITE_BACKEND_WS_URL ||
      `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}`;
    const url = `${base.replace(/\/$/, "")}/tradegame/ws/progress/${gameId}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;
    
    ws.onopen = () => console.info("WebSocket connected:", gameId);
    
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        
        if (msg.multiplier !== undefined) {
          setMultiplier(Number(msg.multiplier));
        }
        
        if (msg.event === "crash") {
          const finalM = Number(msg.final_multiplier ?? msg.multiplier ?? multiplier);
          onCrashFinalize(finalM);
          setIsSpinning(false);
          setIsFalling(true);
          setIsCrashed(true);
          setHistory(prev => [Number(finalM), ...prev].slice(0, 6));
          
          try {
            ws.close();
          } catch (e) {
            console.error("WebSocket close error:", e);
          }
          wsRef.current = null;
        }
      } catch (e) {
        console.error("WebSocket parse error:", e);
      }
    };
    
    ws.onclose = () => {
      wsRef.current = null;
      console.info("WebSocket closed");
    };
    
    ws.onerror = (err) => console.error("WebSocket error:", err);
  }, [multiplier, onCrashFinalize]);
  
  // Lancer une partie
  const handlePlay = useCallback(async () => {
    const b1 = Number(bet1 || 0);
    const b2 = Number(bet2 || 0);
    
    if (b1 <= 0 && b2 <= 0) {
      setMessage({ type: "error", text: t("trade.bet_required") });
      return;
    }
    
    if (b1 + b2 > balance) {
      setMessage({ type: "error", text: t("trade.insufficient_balance") });
      return;
    }
    
    try {
      const res = await axiosInstance.post("/tradegame/play", null, {
        params: { bet1: b1, bet2: b2 }
      });
      
      const data = res.data;
      if (data?.error) {
        setMessage({
  type: "error",
  text: data.error || t("trade.start_error")
});
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
      await refreshBalance();
      
    } catch (err) {
      console.error("Erreur lors du lancement:", err);
      setMessage({ type: "error", text: t("trade.start_error") });
    }
  }, [bet1, bet2, balance, axiosInstance, connectWebSocket, refreshBalance]);
  
  // Cashout
  const handleCashout = useCallback(async (betKey) => {
    if (!gameId) return;
    
    try {
      const res = await axiosInstance.post("/tradegame/cashout", null, {
        params: { game_id: gameId, bet_key: betKey }
      });
      
      const data = res.data;
      if (data?.error) {
        setMessage({
  type: "error",
  text: data.error || t("trade.start_error")
});
        return;
      }
      
      // Message de confirmation animé
      setCashoutMsg(t("trade.cashout_success", { amount: data.gain }));
      setTimeout(() => setCashoutMsg(null), 2500);
      
      await refreshBalance();
      
    } catch (err) {
      console.error("Erreur lors du cashout:", err);
      setMessage({ type: "error", text: t("trade.cashout_error") });
    }
  }, [gameId, axiosInstance, refreshBalance]);
  
  // Classes CSS
  const boardClass = `tradegame-board ${gameId && !isCrashed ? "running" : ""} ${isCrashed ? "crashed" : ""}`.trim();
  
  return (
    <div className="tradegame-container">

      {message && (
  <div className={`game-message ${message.type}`}>
    {message.text}
    <button onClick={() => setMessage(null)}>
  {t("trade.close", "✖")}
</button>
  </div>
)}
      {/* Balance */}
      <div className="tradegame-balance">
        💰 {t("trade.balance")}: <span>{typeof balance === 'number' ? balance.toFixed(2) : '0.00'}</span> pts
      </div>
      
      {/* Plateau de jeu */}
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
              transition: isCrashed ? "none" : "transform 0.05s linear"
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
              style={{ width: "60px", height: "auto" }}
              onAnimationEnd={() => {
                if (isFalling) {
                  setLogo(null);
                  setIsFalling(false);
                }
              }}
            />
          </div>
        )}
        
        {/* Multiplicateur */}
        <div className="tradegame-multiplier">
          {typeof multiplier === 'number' ? multiplier.toFixed(2) : '1.00'}x
        </div>
      </div>
      
      {/* Message de cashout */}
      {cashoutMsg && (
        <div className="cashout-msg">
          {cashoutMsg}
        </div>
      )}
      
      {/* Historique */}
      <div className="tradegame-history">
        <div className="history-list">
          {history.length === 0 ? (
            <span>{t("trade.no_history")}</span>
          ) : (
            history.map((m, i) => {
              const value = Number(m);
              const isGreen = value >= 3.0;
              
              return (
                <span
                  key={i}
                  className={`history-item ${isGreen ? "green" : "red"}`}
                >
                  {value.toFixed(2)}x
                </span>
              );
            })
          )}
        </div>
      </div>
      
      {/* Formulaire de mise */}
      <div className="tradegame-form">
        {/* Mise 1 */}
        <div className="bet-row">
          <input
            className="tradegame-input"
            type="number"
            value={bet1}
            onChange={(e) => setBet1(e.target.value)}
            placeholder={`${t("trade.bet1")} (pts)`}
            min="0"
            step="0.01"
            disabled={!!gameId && !isCrashed}
          />
          {gameId && !isCrashed ? (
            <button
              className="tradegame-btn cashout1"
              onClick={() => handleCashout("bet1")}
            >
              💸 {t("trade.cashout")}
            </button>
          ) : (
            <button
              className="tradegame-btn play"
              onClick={handlePlay}
              disabled={(!bet1 || Number(bet1) <= 0) && (!bet2 || Number(bet2) <= 0)}
            >
              ▶️ {t("trade.play")}
            </button>
          )}
        </div>
        
        {/* Mise 2 */}
        <div className="bet-row">
          <input
            className="tradegame-input"
            type="number"
            value={bet2}
            onChange={(e) => setBet2(e.target.value)}
            placeholder={t("trade.bet2")}
            min="0"
            step="0.01"
            disabled={!!gameId && !isCrashed}
          />
          {gameId && !isCrashed ? (
            <button
              className="tradegame-btn cashout2"
              onClick={() => handleCashout("bet2")}
            >
              💸 {t("trade.cashout")}
            </button>
          ) : (
            <button
              className="tradegame-btn play"
              onClick={handlePlay}
              disabled={(!bet1 || Number(bet1) <= 0) && (!bet2 || Number(bet2) <= 0)}
            >
              ▶️ {t("trade.play")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}