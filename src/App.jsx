import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen";
import SidebarToggle from "./components/SidebarToggle";
import "./App.css";

import backgroundImage from "./assets/background.png";
import logo from "./assets/actif-logo.png";

import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Friends from "./pages/Friends";
import Info from "./pages/Info";
import Wallet from "./pages/Wallet";
import LevelPage from "./pages/LevelPage";
import BalancePage from "./pages/BalancePage";
import RankingPage from "./pages/RankingPage";
import ValidateTask from "./pages/ValidateTask";
import SidebarPage from "./pages/SidebarPage";
import MyActions from "./pages/MyActions";
import Status from "./pages/Status";
import DinoGame from "./pages/DinoGame";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [level, setLevel] = useState(1);
  const [pointsHistory, setPointsHistory] = useState([]);

  // Authentification Telegram
  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    const initData = telegram?.initData;

    if (initData && !localStorage.getItem("telegramUser")) {
      const authenticate = async () => {
        try {
          const response = await fetch(`${API_URL}/auth/telegram`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initData }),
          });

          const data = await response.json();
          if (data?.id) {
            localStorage.setItem("telegramUser", JSON.stringify(data));
            setUser(data);
          } else {
            console.error("Erreur d'authentification :", data);
          }
        } catch (err) {
          console.error("Erreur serveur :", err);
        }
      };

      authenticate();
    }
  }, []);

  // Récupération des données utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("telegramUser"));
        if (!storedUser) return;

        const response = await fetch(`${API_URL}/user-data/${storedUser.id}`);
        if (!response.ok) throw new Error("Erreur API");

        const data = await response.json();
        setUser(data);
        setPoints(data.points || 0);
        setWallet(data.wallet || 0);
        setLevel(data.level || 1);
        setPointsHistory(data.pointsHistory || []);
      } catch (error) {
        console.error("Erreur récupération données :", error);
      }
    };

    fetchUserData();
  }, []);

  // Système de parrainage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");

    if (ref && !localStorage.getItem("referredBy")) {
      localStorage.setItem("referredBy", ref);

      const bonus = 1000;
      const toWallet = Math.floor(bonus * 0.15);
      const toPoints = bonus - toWallet;

      const prevPoints = JSON.parse(localStorage.getItem(`points_${ref}`)) || 0;
      const prevWallet = JSON.parse(localStorage.getItem(`wallet_${ref}`)) || 0;

      localStorage.setItem(`points_${ref}`, JSON.stringify(prevPoints + toPoints));
      localStorage.setItem(`wallet_${ref}`, JSON.stringify(prevWallet + toWallet));
    }
  }, []);

  // Sauvegarde des états dans le localStorage
  useEffect(() => {
    localStorage.setItem("points", JSON.stringify(points));
    localStorage.setItem("wallet", JSON.stringify(wallet));
    localStorage.setItem("level", JSON.stringify(level));
    localStorage.setItem("pointsHistory", JSON.stringify(pointsHistory));
  }, [points, wallet, level, pointsHistory]);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="app-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Navbar user={user} />
      <div className="content">
        <SidebarToggle logo={logo} />

        <Routes>
          <Route path="/" element={<Home points={points} setPoints={setPoints} level={level} setLevel={setLevel} />} />
          <Route path="/tasks" element={<Tasks points={points} setPoints={setPoints} wallet={wallet} setWallet={setWallet} />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/info" element={<Info />} />
          <Route path="/wallet" element={<Wallet wallet={wallet} />} />
          <Route path="/level" element={<LevelPage level={level} />} />
          <Route path="/balance" element={<BalancePage points={points} pointsHistory={pointsHistory} />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/validate-task/:taskId" element={<ValidateTask points={points} setPoints={setPoints} wallet={wallet} setWallet={setWallet} />} />
          <Route path="/sidebar" element={<SidebarPage />} />
          <Route path="/sidebar/my-actions" element={<MyActions />} />
          <Route path="/sidebar/status" element={<Status />} />
          <Route path="/dino" element={<DinoGame />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
