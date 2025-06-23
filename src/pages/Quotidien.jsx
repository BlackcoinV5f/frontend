import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaGift, FaFire, FaCheck, FaTimes, FaCoins } from "react-icons/fa";
import "./Quotidien.css";

const Quotidien = () => {
  const [streak, setStreak] = useState(0);
  const [claimedToday, setClaimedToday] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("telegramUser"));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/daily-streak/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setStreak(data.streak || 0);
        setClaimedToday(data.claimed_today || false);
      })
      .catch((err) => {
        console.error("❌ Erreur récupération streak :", err);
      });
  }, [userId]);

  const addToast = (text) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const handleClaim = async () => {
    if (claimedToday || !userId) {
      setMessage("✅ Récompense déjà réclamée aujourd'hui !");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/claim-daily-reward?user_id=${userId}`,
        { method: "POST" }
      );
      const data = await res.json();

      if (res.ok) {
        setStreak(data.streak);
        setClaimedToday(true);
        setMessage(`🎉 +${data.reward_points} points ! Streak : ${data.streak} jours`);
        setShowConfetti(true);
        addToast(`+${data.reward_points} points`);
        setTimeout(() => setShowConfetti(false), 5000);
      } else {
        setMessage(data.detail || "❌ Une erreur est survenue.");
      }
    } catch (err) {
      console.error("❌ Erreur lors de la réclamation :", err);
      setMessage("❌ Une erreur réseau est survenue.");
    }
  };

  return (
    <motion.div 
      className="quotidien-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="confetti"
              initial={{ y: -100, x: Math.random() * 100 - 50, opacity: 1 }}
              animate={{ 
                y: window.innerHeight,
                x: Math.random() * 200 - 100,
                rotate: Math.random() * 360,
                opacity: 0
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                ease: "linear"
              }}
              style={{
                background: `hsl(${Math.random() * 360}, 100%, 50%)`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
              }}
            />
          ))}
        </div>
      )}

      <motion.div className="reward-card" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
        <motion.div
          className="reward-icon"
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <FaGift size={60} />
        </motion.div>

        <h2>🎁 Récompense Quotidienne</h2>

        <div className="streak-display">
          <FaFire color="#FF5722" size={24} />
          <motion.span
            key={streak}
            initial={{ scale: 1.5, color: "#FF5722" }}
            animate={{ scale: 1, color: "#333" }}
            transition={{ duration: 0.5 }}
          >
            {streak} jours consécutifs
          </motion.span>
        </div>

        <motion.button
          className={`claim-btn ${claimedToday ? "claimed" : ""}`}
          onClick={handleClaim}
          disabled={claimedToday}
          whileHover={!claimedToday ? { scale: 1.05 } : {}}
          whileTap={!claimedToday ? { scale: 0.95 } : {}}
        >
          {claimedToday ? (
            <>
              <FaCheck /> Déjà réclamé aujourd'hui
            </>
          ) : (
            <>
              <FaCoins /> Réclamer ma récompense
            </>
          )}
        </motion.button>

        <motion.button
          className="close-btn"
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaTimes /> Fermer
        </motion.button>

        {message && (
          <motion.p 
            className="message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {message}
          </motion.p>
        )}
      </motion.div>

      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className="reward-toast"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <FaCoins /> {toast.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Quotidien;
