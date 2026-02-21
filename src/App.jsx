// src/App.jsx
import React, { useState, lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import { UserProvider, useUser } from "./contexts/UserContext";
import { AdmProvider } from "./contexts/AdmContext";

import LuckyDistributorGame from "./pages/LuckyDistributorGame";
import Historic from "./pages/Historic";
import backgroundImage from "./assets/background.png";
import "./App.css";

// 🧩 Composants
const SplashScreen = lazy(() => import("./components/SplashScreen"));
const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));
const ErrorBoundary = lazy(() => import("./components/ErrorBoundary"));
const LoadingSpinner = lazy(() => import("./components/LoadingSpinner"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));

// 🧭 Pages publiques
const AuthChoice = lazy(() => import("./pages/AuthChoice"));
const RegisterForm = lazy(() => import("./pages/RegisterForm"));
const Login = lazy(() => import("./pages/Login"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Welcome = lazy(() => import("./pages/Welcome"));
const LandingRedirect = lazy(() => import("./pages/LandingRedirect"));

// 🔒 Pages protégées
const Home = lazy(() => import("./pages/Home"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Friends = lazy(() => import("./pages/Friends"));
const Info = lazy(() => import("./pages/Info"));
const Wallet = lazy(() => import("./pages/Wallet"));
const BalancePage = lazy(() => import("./pages/BalancePage"));
const ValidateTask = lazy(() => import("./pages/ValidateTask"));
const MyActions = lazy(() => import("./pages/MyActions"));
const Status = lazy(() => import("./pages/Status"));
const Settings = lazy(() => import("./pages/Settings"));
const TradeGame = lazy(() => import("./pages/TradeGame"));
const Actions = lazy(() => import("./pages/Actions"));
const Bonus = lazy(() => import("./pages/Bonus"));
const DailyTasks = lazy(() => import("./pages/DailyTasks"));
const Airdrop = lazy(() => import("./pages/Airdrop"));
const AirdropClaim = lazy(() => import("./pages/AirdropClaim"));
const Kyc = lazy(() => import("./pages/Kyc"));
const BlackAI = lazy(() => import("./pages/BlackAI"));

// 💰 Dépôts / Retraits
const DepositMethods = lazy(() => import("./pages/DepositMethods"));
const Depots = lazy(() => import("./pages/Depots"));
const Retraits = lazy(() => import("./pages/Retraits"));
const RetraitMethode = lazy(() => import("./pages/RetraitMethode"));

// 🔐 Route protégée
const ProtectedRoute = ({ children }) => {
  const {
    isAuthenticated,
    isEmailVerified,
    hasCompletedWelcomeTasks,
    loading,
  } = useUser();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/auth-choice" replace />;
  if (!isEmailVerified) return <Navigate to="/verify-email" replace />;
  if (!hasCompletedWelcomeTasks) return <Navigate to="/welcome" replace />;

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// ⭐ Contenu principal
function AppContent() {
  const { user, loading } = useUser();
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);

  // Scroll top à chaque navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
        <p>Chargement en cours...</p>
      </div>
    );
  }

  return (
    <div
      className="app-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Splash */}
      {showSplash && (
        <Suspense fallback={<LoadingSpinner />}>
          <SplashScreen onFinish={() => setShowSplash(false)} />
        </Suspense>
      )}

      {/* Navbar */}
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Navbar user={user} />
        </Suspense>
      </ErrorBoundary>

      {/* Pages */}
      <main className="content">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<LandingRedirect />} />
              <Route path="/auth-choice" element={<AuthChoice />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/historic" element={<Historic />} />

              {/* Protected */}
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/tasks/:taskId/validate" element={<ProtectedRoute><ValidateTask /></ProtectedRoute>} />
              <Route path="/daily-tasks/:packId" element={<ProtectedRoute><DailyTasks /></ProtectedRoute>} />
              <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
              <Route path="/info" element={<ProtectedRoute><Info /></ProtectedRoute>} />
              <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />

              {/* Dépôts */}
              <Route path="/depots" element={<ProtectedRoute><DepositMethods /></ProtectedRoute>} />
              <Route path="/deposits/:id" element={<ProtectedRoute><Depots /></ProtectedRoute>} />

              {/* Retraits */}
              <Route path="/retrait-methode" element={<ProtectedRoute><RetraitMethode /></ProtectedRoute>} />
              <Route path="/retrait" element={<ProtectedRoute><Retraits /></ProtectedRoute>} />

              {/* Autres */}
              <Route path="/balance" element={<ProtectedRoute><BalancePage /></ProtectedRoute>} />
              <Route path="/my-actions" element={<ProtectedRoute><MyActions /></ProtectedRoute>} />
              <Route path="/status" element={<ProtectedRoute><Status /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/lucky-game" element={<LuckyDistributorGame />} />
              <Route path="/trade-game" element={<ProtectedRoute><TradeGame /></ProtectedRoute>} />
              <Route path="/actions" element={<ProtectedRoute><Actions /></ProtectedRoute>} />
              <Route path="/bonus" element={<ProtectedRoute><Bonus /></ProtectedRoute>} />

              {/* ✅ AIRDROP */}
              <Route path="/airdrop" element={<ProtectedRoute><Airdrop /></ProtectedRoute>} />
              <Route
                path="/airdrop/:platformId"
                element={
                  <ProtectedRoute>
                    <AirdropClaim />
                  </ProtectedRoute>
                }
              />

              <Route
  path="/kyc"
  element={
    <ProtectedRoute>
      <Kyc />
    </ProtectedRoute>
  }
/>

<Route
  path="/black-ai"
  element={
    <ProtectedRoute>
      <BlackAI />
    </ProtectedRoute>
  }
/>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// 🚀 App racine
export default function App() {
  return (
    <UserProvider>
      <AdmProvider>
        <AppContent />
      </AdmProvider>
    </UserProvider>
  );
}
