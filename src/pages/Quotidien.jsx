// src/pages/Quotidien.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaGift, FaFire, FaCheck, FaTimes, FaCoins } from "react-icons/fa";
import { useUser } from "../contexts/UserContext";
import confetti from "canvas-confetti";
import "./Quotidien.css";

const Quotidien = () => {
  const { user, fetchUserProfile, updateUser } = useUser();
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);
  const [claimedToday, setClaimedToday] = useState(false);
  const [message, setMessage] = useState("");
  const [toasts, setToasts] = useState([]);
  const canvasRef = useRef(null);

  // Charger profil
  useEffect(() => {
    if (user?.telegram_id) {
      fetchUserProfile(user.telegram_id)
        .then((data) => {
          setStreak(data.streak || 0);
          setClaimedToday(data.claimed_today || false);
        })
        .catch((err) => console.error("Erreur récupération profil :", err));
    }
  }, [user?.telegram_id, fetchUserProfile]);

  const addToast = (text) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text }]);
    const timeout = setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);

    return () => clearTimeout(timeout);
  };

  const fireConfetti = () => {
    if (!canvasRef.current) return;

    const myConfetti = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true, // performance boost
    });

    myConfetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }, // position sur l’écran
    });
  };

  const handleClaim = async () => {
    if (claimedToday || !user?.telegram_id) {
      setMessage("✅ Récompense déjà réclamée aujourd'hui !");
      return;
    }

    try {
      const updatedUser = await updateUser(user.telegram_id, {
        action: "claim_daily_reward",
      });
      setStreak(updatedUser.streak || 0);
      setClaimedToday(true);
      setMessage(
        `🎉 +${updatedUser.reward_points} points ! Streak : ${updatedUser.streak} jours`
      );
      addToast(`+${updatedUser.reward_points} points`);
      fireConfetti(); // 🎊 ici on lance le confetti
    } catch (err) {
      console.error("Erreur lors de la réclamation :", err);
      setMessage("❌ Une erreur est survenue.");
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
      {/* 🎊 Canvas confetti en arrière-plan */}
      <canvas
        ref={canvasRef}
        className="confetti-canvas"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />

      <motion.div
        className="reward-card"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
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
