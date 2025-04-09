import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MiningCircle from "./components/MiningCircle";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Friends from "./pages/Friends";
import Info from "./pages/Info";
import Wallet from "./pages/Wallet";
import LevelPage from "./pages/LevelPage";
import BalancePage from "./pages/BalancePage";
import RankingPage from "./pages/RankingPage";
import ValidateTask from "./pages/ValidateTask";
import AuthTelegram from "./pages/AuthTelegram";
import SplashScreen from "./components/SplashScreen";
import backgroundImage from "./assets/background.png";
import SidebarToggle from "./components/SidebarToggle";
import SidebarPage from "./pages/SidebarPage";
import logo from "./assets/actif-logo.png"; // Import direct dans App.jsx
import MyActions from "./pages/MyActions";
import Status from "./pages/Status";
import "./App.css";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [points, setPoints] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [level, setLevel] = useState(1);
  const [user, setUser] = useState(null);

  function App() {
    const {
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
    } = useGameLogic();
  
    // Ton composant continue ici...
  }

  // ✅ Récupérer les données utilisateur depuis le backend
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

  // ✅ Vérification des liens de parrainage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const referrerId = urlParams.get("ref");

    if (referrerId) {
      let referredBy = localStorage.getItem("referredBy");
      if (!referredBy) {
        localStorage.setItem("referredBy", referrerId);

        let invitedUsers = JSON.parse(localStorage.getItem(`invitedUsers_${referrerId}`)) || [];
        invitedUsers.push(`Joueur ${Date.now()}`);
        localStorage.setItem(`invitedUsers_${referrerId}`, JSON.stringify(invitedUsers));

        let referrerPoints = JSON.parse(localStorage.getItem(`points_${referrerId}`)) || 0;
        let walletPoints = JSON.parse(localStorage.getItem(`wallet_${referrerId}`)) || 0;

        let bonusPoints = 1000;
        let toWallet = Math.floor(bonusPoints * 0.15);
        let toBalance = bonusPoints - toWallet;

        localStorage.setItem(`points_${referrerId}`, JSON.stringify(referrerPoints + toBalance));
        localStorage.setItem(`wallet_${referrerId}`, JSON.stringify(walletPoints + toWallet));
      }
    }
  }, []);

  <SplashScreen onFinish={() => {
    console.log("Splash terminé, on cache l'écran !");
    setShowSplash(false);
  }} />
  

  // ✅ Sauvegarde des données utilisateur en localStorage
  useEffect(() => {
    localStorage.setItem("points", JSON.stringify(points));
    localStorage.setItem("wallet", JSON.stringify(wallet));
    localStorage.setItem("pointsHistory", JSON.stringify(pointsHistory));
    localStorage.setItem("level", JSON.stringify(level));
  }, [points, wallet, pointsHistory, level]);

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
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
              <Route path="/sidebar" element={<SidebarPage />} />
              <Route path="/auth/telegram" element={<AuthTelegram setUser={setUser} />} />
              <Route path="/validate-task/:taskId" element={<ValidateTask points={points} setPoints={setPoints} wallet={wallet} setWallet={setWallet} />} />
              <Route path="/sidebar" element={<SidebarToggle />} />
              <Route path="/sidebar/my-actions" element={<MyActions />} />
              <Route path="/sidebar/status" element={<Status />} />
            </Routes>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default App;
