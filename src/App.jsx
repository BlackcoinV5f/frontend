// src/App.jsx
import React, { useState, lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import { UserProvider, useUser } from "./contexts/UserContext";
import LuckyDistributorGame from "./pages/LuckyDistributorGame";
import backgroundImage from "./assets/background.png";
import "./App.css";

// 🧩 Composants communs
const SplashScreen = lazy(() => import("./components/SplashScreen"));
const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));
const ErrorBoundary = lazy(() => import("./components/ErrorBoundary"));
const LoadingSpinner = lazy(() => import("./components/LoadingSpinner"));
const UserProfile = lazy(() => import("./components/UserProfile"));

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
const Quotidien = lazy(() => import("./pages/Quotidien"));
const Settings = lazy(() => import("./pages/Settings"));
const TradeGame = lazy(() => import("./pages/TradeGame"));
const Actions = lazy(() => import("./pages/Actions")); // ✅ Page Actions

// 🔐 Route protégée
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isEmailVerified, hasCompletedWelcomeTasks, loading } = useUser();
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/auth-choice" replace />;
  if (!isEmailVerified) return <Navigate to="/verify-email" replace />;
  if (!hasCompletedWelcomeTasks) return <Navigate to="/welcome" replace />;
  return children;
};
ProtectedRoute.propTypes = { children: PropTypes.node.isRequired };

// 🧠 Contenu principal
function AppContent() {
  const { user, loading } = useUser();
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();

  // 📱 Forcer le scroll en haut à chaque navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // 🕒 Splash Screen
  if (showSplash) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </Suspense>
    );
  }

  // 🔄 Chargement global
  if (loading) {
    return (
      <div className="loading-container">
        <LoadingSpinner />
        <p>Chargement en cours...</p>
      </div>
    );
  }

  // 🧩 Structure principale
  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Navbar user={user} />
        </Suspense>
      </ErrorBoundary>

      <main className="content">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* 🧭 Pages publiques */}
              <Route path="/" element={<LandingRedirect />} />
              <Route path="/auth-choice" element={<AuthChoice />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/welcome" element={<Welcome />} />

              {/* 🔐 Pages protégées */}
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
              <Route path="/tasks/:taskId/validate" element={<ProtectedRoute><ValidateTask /></ProtectedRoute>} />
              <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
              <Route path="/user-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path="/info" element={<ProtectedRoute><Info /></ProtectedRoute>} />
              <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
              <Route path="/balance" element={<ProtectedRoute><BalancePage /></ProtectedRoute>} />
              <Route path="/my-actions" element={<ProtectedRoute><MyActions /></ProtectedRoute>} />
              <Route path="/status" element={<ProtectedRoute><Status /></ProtectedRoute>} />
              <Route path="/daily" element={<ProtectedRoute><Quotidien /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/lucky-game" element={<LuckyDistributorGame />} />
              <Route path="/tradegame" element={<ProtectedRoute><TradeGame /></ProtectedRoute>} />
              <Route path="/actions" element={<ProtectedRoute><Actions /></ProtectedRoute>} />

              {/* 🚫 Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// 🚀 App avec contexte global utilisateur
export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
