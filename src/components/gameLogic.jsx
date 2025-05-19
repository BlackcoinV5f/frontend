import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const useGameLogic = () => {
  const [wallet, setWallet] = useState(0);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [level, setLevel] = useState(1);
  const [user, setUser] = useState(null);
  const [attemptsLeft, setAttemptsLeft] = useState(10);
  const [points, setPoints] = useState(100);
  const [lastClaimedDate, setLastClaimedDate] = useState(localStorage.getItem('lastClaimedDate') || null);
  const [streakDays, setStreakDays] = useState(parseInt(localStorage.getItem('streakDays')) || 1);

  // === 1. Récupération des données utilisateur depuis l'API ===
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("telegramUser"));
        if (!storedUser) return;

        const response = await fetch(`${API_URL}/user-data/${storedUser.id}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des données");

        const data = await response.json();

        setUser(data);
        setPoints(data.points || 0);
        setWallet(data.wallet || 0);
        setPointsHistory(data.pointsHistory || []);
        setLevel(data.level || 1);
      } catch (error) {
        console.error("Erreur API:", error);
      }
    };

    fetchUserData();
  }, []);

  // === 2. Gestion des streaks et bonus quotidien ===
  useEffect(() => {
    const today = new Date().toDateString();
    const lastClaimed = localStorage.getItem('lastClaimedDate');

    if (lastClaimed !== today) {
      const lastDate = new Date(lastClaimed);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastClaimed && lastDate.toDateString() === yesterday.toDateString()) {
        setStreakDays(prev => {
          const newStreak = prev + 1;
          localStorage.setItem('streakDays', newStreak);
          return newStreak;
        });
      } else {
        setStreakDays(1);
        localStorage.setItem('streakDays', 1);
      }

      // Reset quotidien
      setAttemptsLeft(10);
      localStorage.setItem('attemptsLeft', 10);

      setPoints(prev => {
        const newPoints = prev + 100;
        localStorage.setItem('points', newPoints);
        return newPoints;
      });

      setLastClaimedDate(today);
      localStorage.setItem('lastClaimedDate', today);
    } else {
      setAttemptsLeft(parseInt(localStorage.getItem('attemptsLeft')) || 10);
      setPoints(parseInt(localStorage.getItem('points')) || 100);
    }
  }, []);

  // === 3. Sauvegarde des données importantes en localStorage ===
  useEffect(() => {
    localStorage.setItem("points", JSON.stringify(points));
    localStorage.setItem("wallet", JSON.stringify(wallet));
    localStorage.setItem("pointsHistory", JSON.stringify(pointsHistory));
    localStorage.setItem("level", JSON.stringify(level));
  }, [points, wallet, pointsHistory, level]);

  // === 4. Fonction pour jouer et décrémenter les tentatives ===
  const handlePlayGame = () => {
    if (attemptsLeft > 0) {
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      localStorage.setItem('attemptsLeft', newAttempts);
    } else {
      alert("Vous avez utilisé toutes vos tentatives pour aujourd'hui !");
    }
  };

  // === 5. Fonction pour ajouter des points supplémentaires (exemple: victoire) ===
  const addPoints = (value) => {
    setPoints(prev => {
      const newPoints = prev + value;
      localStorage.setItem('points', newPoints);
      return newPoints;
    });
  };

  return {
    wallet,
    setWallet,
    pointsHistory,
    setPointsHistory,
    level,
    setLevel,
    user,
    setUser,
    attemptsLeft,
    points,
    streakDays,
    handlePlayGame,
    addPoints, // J'ajoute cette fonction ici
  };
};