// src/App.jsx
import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { UserProvider, useUser } from "./contexts/UserContext";
import useTelegram from "./hooks/useTelegram";
import backgroundImage from "./assets/background.png";
import logo from "./assets/actif-logo.png";
import "./App.css";

// Components
import AdminPanel from "./components/Dashboard/AdminPanel";
import UserDetails from "./components/Dashboard/UserDetails";

// Lazy loaded components
const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));
const SplashScreen = lazy(() => import("./components/SplashScreen"));
const SidebarToggle = lazy(() => import("./components/SidebarToggle"));
const ErrorBoundary = lazy(() => import("./components/ErrorBoundary"));
const LoadingSpinner = lazy(() => import("./components/LoadingSpinner"));
const AdminVerifyCode = lazy(() => import("./pages/AdminVerifyCode"));
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
const Quotidien = lazy(() => import("./pages/Quotidien"));

const ProtectedRoute = ({ children }) => children;
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function AppContent() {
  const { fetchTelegramData, user, loading } = useUser();
  const [splashFinished, setSplashFinished] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [authError, setAuthError] = useState(null);
  const telegramUser = useTelegram();

  // Récupérer les données Telegram & appeler le backend
  useEffect(() => {
    const init = async () => {
      const tg = window.Telegram?.WebApp;

      if (!tg?.initDataUnsafe) {
        setAuthError("❌ Données Telegram introuvables !");
        return;
      }

      try {
        await fetchTelegramData(tg.initDataUnsafe);
      } catch (error) {
        console.error("Erreur Auth Telegram :", error);
        setAuthError("❌ Échec de l’authentification. Veuillez réessayer.");
      }
    };

    init();
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

  // 🔐 Affichage d'un message d'erreur d'authentification
  if (authError) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
        <h2>{authError}</h2>
      </div>
    );
  }

  // ⏳ Chargement de l’utilisateur
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
          <Navbar user={user} points={0} wallet={0} />
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
              <Route path="/" element={<Home user={user} points={0} setPoints={() => {}} level={1} setLevel={() => {}} />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/info" element={<Info />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/level" element={<LevelPage />} />
              <Route path="/balance" element={<BalancePage points={0} />} />
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
              <Route path="/welcome" element={<Welcome />} />
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
