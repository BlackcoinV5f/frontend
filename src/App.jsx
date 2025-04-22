// src/App.jsx
import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";


// Assets
import backgroundImage from "./assets/background.png";
import logo from "./assets/actif-logo.png";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SplashScreen from "./components/SplashScreen";
import SidebarToggle from "./components/SidebarToggle";

// Pages
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
import RegisterForm from "./pages/RegisterForm";
import Login from "./pages/Login";
import AuthChoice from "./pages/AuthChoice";
import VerifyEmail from "./pages/VerifyEmail";
import AdminDashboardPage from './pages/AdminDashboardPage'

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const TON_ID_ADMIN = import.meta.env.VITE_TON_ID_ADMIN;


const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [splashFinished, setSplashFinished] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [level, setLevel] = useState(1);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async (userId) => {
    const res = await fetch(`${API_URL}/user-data/${userId}`);
    if (!res.ok) throw new Error("Échec de la récupération des données utilisateur");
    return await res.json();
  };

  useEffect(() => {
    if (showSplash) return;

    const init = async () => {
      const telegram = window.Telegram?.WebApp;
      const localData = localStorage.getItem("telegramUser");

      if (!telegram || !telegram.initDataUnsafe?.user) {
        if (!localData) {
          setLoading(false);
          return;
        } else {
          setUser(JSON.parse(localData));
          setLoading(false);
          return;
        }
      }

      const initData = telegram.initData;
      const userId = telegram.initDataUnsafe.user?.id;

      if (!userId) {
        setError("Utilisateur Telegram non identifié.");
        setLoading(false);
        return;
      }

      try {
        const authRes = await fetch(`${API_URL}/auth/telegram`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData }),
        });

        if (!authRes.ok) throw new Error("Échec de l'authentification");

        const authData = await authRes.json();
        localStorage.setItem("telegramUser", JSON.stringify(authData));

        const userData = await fetchUserData(authData.id);

        setUser(userData);
        setPoints(userData.points || 0);
        setWallet(userData.wallet || 0);
        setLevel(userData.level || 1);
        setPointsHistory(userData.pointsHistory || []);
      } catch (err) {
        console.error(err);
        setError("Erreur de chargement des données");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [showSplash]);

  useEffect(() => {
    if (!splashFinished) return;

    const isRegistered = localStorage.getItem("isRegistered") === "true";
    const telegramUser = localStorage.getItem("telegramUser");

    const onAuthPages = ["/auth-choice", "/register", "/login"].includes(location.pathname);

    if (!telegramUser || !isRegistered) {
      if (!onAuthPages) navigate("/auth-choice");
    } else {
      if (onAuthPages) navigate("/");
    }
  }, [splashFinished, location.pathname, navigate]);

  useEffect(() => {
    if (!user?.id) return;

    const ref = new URLSearchParams(window.location.search).get("ref");

    if (ref && ref !== String(user.id) && !localStorage.getItem(`referredBy_${user.id}`)) {
      localStorage.setItem(`referredBy_${user.id}`, ref);

      const handleReferral = async () => {
        try {
          const res = await fetch(`${API_URL}/handle-referral`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ referrerId: ref, refereeId: user.id }),
          });

          const result = await res.json();
          if (result.success) {
            setPoints((prev) => prev + (result.pointsBonus || 0));
            setWallet((prev) => prev + (result.walletBonus || 0));
          }
        } catch (err) {
          console.error("Erreur parrainage:", err);
        }
      };

      handleReferral();
    }
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    const saveTimeout = setTimeout(() => {
      fetch(`${API_URL}/update-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          points,
          wallet,
          level,
          pointsHistory,
        }),
      }).catch((err) => console.error("Sauvegarde échouée:", err));
    }, 1000);

    return () => clearTimeout(saveTimeout);
  }, [points, wallet, level, pointsHistory, user]);

  if (showSplash || !splashFinished) {
    return (
      <SplashScreen
        onFinish={() => {
          setShowSplash(false);
          setSplashFinished(true);
        }}
      />
    );
  }

  if (loading) return <div className="loading-container">Chargement...</div>;
  if (error)
    return (
      <div className="error-container">
        <h2>Erreur</h2>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="app-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Navbar user={user} points={points} wallet={wallet} />
      <div className="content">
        <SidebarToggle logo={logo} user={user} />
        <Routes>
          <Route path="/" element={<Home user={user} points={points} setPoints={setPoints} level={level} setLevel={setLevel} />} />
          <Route path="/tasks" element={<Tasks userId={user?.id} points={points} setPoints={setPoints} wallet={wallet} setWallet={setWallet} />} />
          <Route path="/friends" element={<Friends user={user} />} />
          <Route path="/info" element={<Info />} />
          <Route path="/wallet" element={<Wallet userId={user?.id} wallet={wallet} setWallet={setWallet} />} />
          <Route path="/level" element={<LevelPage level={level} user={user} />} />
          <Route path="/balance" element={<BalancePage userId={user?.id} points={points} pointsHistory={pointsHistory} />} />
          <Route path="/ranking" element={<RankingPage userId={user?.id} />} />
          <Route path="/validate-task/:taskId" element={<ValidateTask userId={user?.id} points={points} setPoints={setPoints} wallet={wallet} setWallet={setWallet} />} />
          <Route path="/sidebar" element={<SidebarPage user={user} />} />
          <Route path="/sidebar/my-actions" element={<MyActions user={user} />} />
          <Route path="/sidebar/status" element={<Status user={user} />} />
          <Route path="/dino" element={<DinoGame user={user} />} />
          <Route path="/auth-choice" element={<AuthChoice />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<VerifyEmail />} />

          {/* 🔐 Route admin protégée */}
          <Route
            path="/admin"
            element={user?.id === TON_ID_ADMIN ? <AdminDashboardPage /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;