// src/App.jsx
import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { UserProvider } from "./contexts/UserContext";
import useTelegram from "./hooks/useTelegram";

import backgroundImage from "./assets/background.png";
import logo from "./assets/actif-logo.png";
import "./App.css";

// Components
import AdminPanel from "./components/Dashboard/AdminPanel";
import UserDetails from "./components/Dashboard/UserDetails";

// Lazy components
const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));
const SplashScreen = lazy(() => import("./components/SplashScreen"));
const SidebarToggle = lazy(() => import("./components/SidebarToggle"));
const ErrorBoundary = lazy(() => import("./components/ErrorBoundary"));
const LoadingSpinner = lazy(() => import("./components/LoadingSpinner"));
const AdminVerifyCode = lazy(() => import("./pages/AdminVerifyCode"));

// Pages
const Home = lazy(() => import("./pages/Home"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Friends = lazy(() => import("./pages/Friends"));
const Info = lazy(() => import("./pages/Info"));
const Wallet = lazy(() => import("./pages/Wallet"));
const LevelPage = lazy(() => import("./pages/LevelPage"));
const BalancePage = lazy(() => import("./pages/BalancePage"));
const RankingPage = lazy(() => import("./pages/RankingPage"));
const ValidateTask = lazy(() => import("./pages/ValidateTask"));
const SidebarPage = lazy(() => import("./pages/SidebarPage"));
const MyActions = lazy(() => import("./pages/MyActions"));
const Status = lazy(() => import("./pages/Status"));
const DinoGame = lazy(() => import("./pages/DinoGame"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));

const ProtectedRoute = ({ children }) => children;

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function AppContent() {
  const telegramUser = useTelegram();
  const [user, setUser] = useState({ username: "Guest", isLoggedIn: false });
  const [initData, setInitData] = useState(null);
  const [splashFinished, setSplashFinished] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [points, setPoints] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [level, setLevel] = useState(1);

  // Vérifie les données Telegram
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg?.initDataUnsafe) {
      alert("❌ Données Telegram introuvables !");
      return;
    }
    setInitData(tg.initDataUnsafe);
    console.log("✅ Données Telegram détectées !", tg.initDataUnsafe);
  }, []);

  // Enregistrement utilisateur Telegram
  useEffect(() => {
    if (telegramUser) {
      const newUser = {
        id: telegramUser.id,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        username: telegramUser.username,
        photo_url: telegramUser.photo_url,
        isLoggedIn: true,
      };
      setUser(newUser);
      localStorage.setItem("telegramUser", JSON.stringify(newUser));
    }
  }, [telegramUser]);

  // Récompense parrain + nouveau joueur
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refId = params.get("ref");
    const storedUser = localStorage.getItem("telegramUser");

    if (refId && storedUser) {
      try {
        const currentUser = JSON.parse(storedUser);
        const currentUserId = currentUser?.id?.toString();
        const currentName = currentUser?.firstName || `Utilisateur ${currentUserId}`;
        const alreadyRewarded = localStorage.getItem(`refRewarded_${currentUserId}`);

        if (currentUserId !== refId && !alreadyRewarded) {
          const inviteKey = `invitedBy_${refId}`;
          const invitedList = JSON.parse(localStorage.getItem(inviteKey)) || [];

          if (!invitedList.includes(currentName)) {
            invitedList.push(currentName);
            localStorage.setItem(inviteKey, JSON.stringify(invitedList));

            const reward = 1000;
            const walletPart = Math.floor(reward * 0.15);
            const balancePart = reward - walletPart;

            const refBalanceKey = `balance_${refId}`;
            const refWalletKey = `wallet_${refId}`;
            const refBalance = parseInt(localStorage.getItem(refBalanceKey)) || 0;
            const refWallet = parseInt(localStorage.getItem(refWalletKey)) || 0;
            localStorage.setItem(refBalanceKey, (refBalance + balancePart).toString());
            localStorage.setItem(refWalletKey, (refWallet + walletPart).toString());

            const newBalanceKey = `balance_${currentUserId}`;
            const newWalletKey = `wallet_${currentUserId}`;
            const newBalance = parseInt(localStorage.getItem(newBalanceKey)) || 0;
            const newWallet = parseInt(localStorage.getItem(newWalletKey)) || 0;
            localStorage.setItem(newBalanceKey, (newBalance + balancePart).toString());
            localStorage.setItem(newWalletKey, (newWallet + walletPart).toString());

            localStorage.setItem(`refRewarded_${currentUserId}`, "true");
          }
        }
      } catch (err) {
        console.error("Erreur lors de l’enregistrement du parrain :", err);
      }
    }
  }, []);

  // Splash Screen
  if (showSplash || !splashFinished) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <SplashScreen onFinish={() => {
          setShowSplash(false);
          setSplashFinished(true);
        }} />
      </Suspense>
    );
  }

  return (
    <div className="app-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Navbar user={user} points={points} wallet={wallet} />
        </Suspense>
      </ErrorBoundary>

      <div className="content">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <SidebarToggle logo={logo} user={user} />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home user={user} points={points} setPoints={setPoints} level={level} setLevel={setLevel} />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/info" element={<Info />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/level" element={<LevelPage />} />
              <Route path="/balance" element={<BalancePage />} />
              <Route path="/ranking" element={<RankingPage />} />
              <Route path="/validate-task" element={<ValidateTask />} />
              <Route path="/sidebar" element={<SidebarPage />} />
              <Route path="/my-actions" element={<MyActions />} />
              <Route path="/status" element={<Status />} />
              <Route path="/dino-game" element={<DinoGame />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/user-details" element={<UserDetails />} />
              <Route path="/admin-verify-code" element={<AdminVerifyCode />} />
              <Route path="/admin-panel" element={<AdminDashboardPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>

      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
