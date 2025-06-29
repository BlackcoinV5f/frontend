// src/App.jsx
import React, { useEffect, lazy, Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { UserProvider, useUser } from "./contexts/UserContext";
import useTelegram from "./hooks/useTelegram";
import backgroundImage from "./assets/background.png";
import logo from "./assets/actif-logo.png";
import "./App.css";

// Components
const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));
const SplashScreen = lazy(() => import("./components/SplashScreen"));
const SidebarToggle = lazy(() => import("./components/SidebarToggle"));
const ErrorBoundary = lazy(() => import("./components/ErrorBoundary"));
const LoadingSpinner = lazy(() => import("./components/LoadingSpinner"));
const Welcome = lazy(() => import("./pages/Welcome"));

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
const AdminPanel = lazy(() => import("./components/Dashboard/AdminPanel"));
const AdminVerifyCode = lazy(() => import("./pages/AdminVerifyCode"));
const UserDetails = lazy(() => import("./components/Dashboard/UserDetails"));
const Quotidien = lazy(() => import("./pages/Quotidien"));

const ProtectedRoute = ({ children }) => children;
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function AppContent() {
  const { fetchTelegramData, user, loading } = useUser();
  const [showSplash, setShowSplash] = useState(true);
  const [splashFinished, setSplashFinished] = useState(false);

  useEffect(() => {
  const tg = window.Telegram?.WebApp;
  const initData = tg?.initDataUnsafe;

  if (!initData) {
    alert("❌ Données Telegram introuvables !");
    return;
  }

  fetchTelegramData(initData).catch((err) => {
    console.error("Erreur Auth Telegram :", err);
  });
}, [fetchTelegramData]);

  // Splash screen
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

  // Chargement ou pas encore authentifié
  if (loading || !user?.telegram_id) {
    return (
      <div style={{ textAlign: "center", paddingTop: "5rem" }}>
        <LoadingSpinner />
        <p>Connexion en cours...</p>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Navbar user={user} />
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
              <Route path="/" element={<Home />} />
              <Route path="/welcome" element={<Welcome />} />
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
              <Route path="/validate-task/:taskId" element={<ValidateTask />} />
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
