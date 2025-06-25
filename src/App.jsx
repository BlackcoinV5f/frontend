// src/App.jsx
import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { UserProvider } from "./contexts/UserContext";
import useTelegram from "./hooks/useTelegram";
import backgroundImage from "./assets/background.png";
import logo from "./assets/actif-logo.png";
import "./App.css";

// Lazy loaded components
const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));
const SplashScreen = lazy(() => import("./components/SplashScreen"));
const SidebarToggle = lazy(() => import("./components/SidebarToggle"));
const ErrorBoundary = lazy(() => import("./components/ErrorBoundary"));
const LoadingSpinner = lazy(() => import("./components/LoadingSpinner"));

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
const Quotidien = lazy(() => import("./pages/Quotidien"));

const ProtectedRoute = ({ children }) => children;
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function AppContent() {
  const telegramUser = useTelegram();

  // Initialisation sécurisée des états
  const [user, setUser] = useState({ username: "Guest", isLoggedIn: false });
  const [points, setPoints] = useState(() => {
    return JSON.parse(localStorage.getItem("points")) || 0;
  });
  const [wallet, setWallet] = useState(() => {
    return JSON.parse(localStorage.getItem("wallet")) || 0;
  });
  const [level, setLevel] = useState(1);
  const [initData, setInitData] = useState(null);
  const [splashFinished, setSplashFinished] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg?.initDataUnsafe) {
      console.error("❌ Données Telegram introuvables !");
      return;
    }
    setInitData(tg.initDataUnsafe);
    console.log("✅ Données Telegram détectées :", tg.initDataUnsafe);
  }, []);

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

  // Gestion des splash screen
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
              <Route
                path="/"
                element={
                  <Home
                    user={user}
                    points={points}
                    setPoints={setPoints}
                    level={level}
                    setLevel={setLevel}
                  />
                }
              />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/info" element={<Info />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/level" element={<LevelPage />} />
              <Route path="/balance" element={<BalancePage points={points} />} />
              <Route path="/ranking" element={<RankingPage />} />
              <Route
                path="/validate/:taskId"
                element={
                  <ValidateTask
                    points={points}
                    setPoints={setPoints}
                    wallet={wallet}
                    setWallet={setWallet}
                  />
                }
              />
              <Route path="/sidebar" element={<SidebarPage />} />
              <Route path="/my-actions" element={<MyActions />} />
              <Route path="/status" element={<Status />} />
              <Route path="/dino-game" element={<DinoGame />} />
              <Route path="/daily" element={<Quotidien />} />
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
