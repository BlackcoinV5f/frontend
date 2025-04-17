import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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

const API_URL = import.meta.env.VITE_BACKEND_URL || "https://your-backend-url.onrender.com";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [level, setLevel] = useState(1);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fonction pour récupérer les données utilisateur
  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/user-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userId}`
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  // Auth Telegram + données utilisateur
  useEffect(() => {
    const initAuth = async () => {
      try {
        const telegram = window.Telegram?.WebApp;
        
        if (!telegram) {
          console.warn("Telegram WebApp not available");
          setLoading(false);
          return;
        }

        telegram.expand();
        const initData = telegram.initData;
        const initDataUnsafe = telegram.initDataUnsafe;
        const userId = initDataUnsafe?.user?.id;

        if (!userId) {
          console.warn("No Telegram user ID found");
          setLoading(false);
          return;
        }

        // Vérifier l'authentification
        let authResponse;
        try {
          authResponse = await fetch(`${API_URL}/auth/telegram`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initData })
          });

          if (!authResponse.ok) {
            throw new Error("Authentication failed");
          }

          const authData = await authResponse.json();
          localStorage.setItem("telegramUser", JSON.stringify(authData));
          
          // Récupérer les données utilisateur après authentification
          const userData = await fetchUserData(authData.id);
          
          setUser(userData);
          setPoints(userData.points || 0);
          setWallet(userData.wallet || 0);
          setLevel(userData.level || 1);
          setPointsHistory(userData.pointsHistory || []);
          
        } catch (authError) {
          console.error("Authentication error:", authError);
          setError("Failed to authenticate with Telegram");
        }

      } catch (err) {
        console.error("Initialization error:", err);
        setError("Initialization failed");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Système de parrainage
  useEffect(() => {
    if (!user?.id) return;

    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");

    if (ref && ref !== user.id.toString() && !localStorage.getItem(`referredBy_${user.id}`)) {
      localStorage.setItem(`referredBy_${user.id}`, ref);

      const handleReferral = async () => {
        try {
          const response = await fetch(`${API_URL}/handle-referral`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              referrerId: ref,
              refereeId: user.id
            })
          });

          if (!response.ok) {
            throw new Error("Referral processing failed");
          }

          const result = await response.json();
          if (result.success) {
            // Mettre à jour le solde localement si nécessaire
            setPoints(prev => prev + (result.pointsBonus || 0));
            setWallet(prev => prev + (result.walletBonus || 0));
          }
        } catch (err) {
          console.error("Referral error:", err);
        }
      };

      handleReferral();
    }
  }, [user]);

  // Sauvegarde des données
  useEffect(() => {
    if (!user?.id) return;

    const saveData = async () => {
      try {
        await fetch(`${API_URL}/update-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            points,
            wallet,
            level,
            pointsHistory
          })
        });
      } catch (err) {
        console.error("Error saving data:", err);
      }
    };

    const debounceTimer = setTimeout(() => {
      saveData();
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [points, wallet, level, pointsHistory, user]);

  // Gestion des erreurs et chargement
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Splash screen
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="app-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Navbar user={user} points={points} wallet={wallet} />
      
      <div className="content">
        <SidebarToggle logo={logo} user={user} />
        
        <Routes>
          <Route path="/" element={
            <Home 
              points={points} 
              setPoints={setPoints} 
              level={level} 
              setLevel={setLevel} 
              user={user}
            />
          } />
          
          <Route path="/tasks" element={
            <Tasks 
              points={points} 
              setPoints={setPoints} 
              wallet={wallet} 
              setWallet={setWallet}
              userId={user?.id}
            />
          } />
          
          <Route path="/friends" element={<Friends user={user} />} />
          <Route path="/info" element={<Info />} />
          
          <Route path="/wallet" element={
            <Wallet 
              wallet={wallet} 
              setWallet={setWallet}
              userId={user?.id}
            />
          } />
          
          <Route path="/level" element={<LevelPage level={level} user={user} />} />
          
          <Route path="/balance" element={
            <BalancePage 
              points={points} 
              pointsHistory={pointsHistory} 
              userId={user?.id}
            />
          } />
          
          <Route path="/ranking" element={<RankingPage userId={user?.id} />} />
          
          <Route path="/validate-task/:taskId" element={
            <ValidateTask 
              points={points} 
              setPoints={setPoints} 
              wallet={wallet} 
              setWallet={setWallet}
              userId={user?.id}
            />
          } />
          
          <Route path="/sidebar" element={<SidebarPage user={user} />} />
          <Route path="/sidebar/my-actions" element={<MyActions user={user} />} />
          <Route path="/sidebar/status" element={<Status user={user} />} />
          <Route path="/dino" element={<DinoGame user={user} />} />
        </Routes>
      </div>
      
      <Footer />
    </div>
  );
};

export default App;