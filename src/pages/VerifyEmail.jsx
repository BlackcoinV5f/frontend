// src/pages/VerifyEmail.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const navigate = useNavigate();

  // On récupère directement les booléens exposés par UserContext
  const {
    verifyEmailCode,
    isAuthenticated,
    isEmailVerified,
    hasCompletedWelcomeTasks,
    loading,
    error,
    setError,
    user,
  } = useUser();

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [feedback, setFeedback] = useState({ error: null, success: null });

  // -----------------------------
  // Lecture des données en attente
  // -----------------------------
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pendingUser");
      const pending = raw ? JSON.parse(raw) : null;

      // Si pas d'utilisateur connecté ET pas de pendingUser => on renvoie à l'inscription
      if (!isAuthenticated && !pending) {
        navigate("/register", { replace: true });
        return;
      }

      // On affiche l'email prioritairement depuis pendingUser, sinon depuis le user connecté
      const emailToUse = pending?.email || user?.email || "";
      if (!emailToUse) {
        // Si on n'a aucun email exploitable, on renvoie vers l'inscription uniquement si pas authentifié
        if (!isAuthenticated) {
          navigate("/register", { replace: true });
          return;
        }
      }
      setEmail(emailToUse);
    } catch (e) {
      console.error("Erreur lors du chargement de pendingUser :", e);
      // En cas d'erreur de parsing, on nettoie et on renvoie vers register uniquement si pas authentifié
      localStorage.removeItem("pendingUser");
      if (!isAuthenticated) {
        navigate("/register", { replace: true });
      }
    }
    // ne dépend pas de email, on veut évaluer seulement sur changements d'auth
  }, [isAuthenticated, user, navigate]);

  // -------------------------------------------------
  // Si l'utilisateur est déjà vérifié, on ne reste pas ici
  // -------------------------------------------------
  useEffect(() => {
    if (!isAuthenticated) return;
    if (isEmailVerified) {
      if (hasCompletedWelcomeTasks) {
        navigate("/home", { replace: true });
      } else {
        navigate("/welcome", { replace: true });
      }
    }
  }, [isAuthenticated, isEmailVerified, hasCompletedWelcomeTasks, navigate]);

  // -----------------------------
  // Soumission du code de vérif
  // -----------------------------
  const handleVerification = useCallback(async () => {
    if (verificationCode.length !== 6 || loading) return;

    setFeedback({ error: null, success: null });
    setError(null);

    try {
      await verifyEmailCode(verificationCode);

      // Nettoyage strict des traces d'inscription en attente
      localStorage.removeItem("pendingUser");

      setFeedback({ success: "Email vérifié avec succès !", error: null });

      // Redirection immédiate vers le parcours Welcome
      navigate("/welcome", { replace: true });
    } catch (err) {
      console.error("Erreur vérification:", err);
      const msg = (err && err.message) || "Erreur lors de la vérification";

      // Si déjà vérifié côté backend, on envoie vers welcome
      const low = msg.toLowerCase();
      if (low.includes("déjà vérifié") || low.includes("already verified")) {
        localStorage.removeItem("pendingUser");
        navigate("/welcome", { replace: true });
        return;
      }

      setFeedback({ error: msg, success: null });
    }
  }, [verificationCode, verifyEmailCode, navigate, setError, loading]);

  // -----------------------------
  // Renvoi du code
  // -----------------------------
  const handleResendCode = async () => {
    setResendLoading(true);
    setFeedback({ error: null, success: null });
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${API_URL}/auth/resend-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Erreur lors du renvoi du code");
      }

      setFeedback({
        success: "Un nouveau code a été envoyé à votre adresse email.",
        error: null,
      });
    } catch (err) {
      setFeedback({
        error: err.message || "Erreur lors du renvoi du code",
        success: null,
      });
    } finally {
      setResendLoading(false);
    }
  };

  // -----------------------------
  // Touche Entrée = valider
  // -----------------------------
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Enter" && verificationCode.length === 6 && !loading) {
        handleVerification();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [verificationCode, loading, handleVerification]);

  // Nettoyage des erreurs au démontage
  useEffect(() => {
    return () => setError(null);
  }, [setError]);

  // Affichage de chargement basique si pas d'email détecté et pas authentifié
  if (!email && !isAuthenticated) {
    return (
      <div className="verify-email-container">
        <div className="verify-card">
          <div className="loading-spinner"></div>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-email-container">
      <div className="verify-card">
        <h1>Vérification d'email</h1>

        {(email || user?.email) && (
          <p className="email-display">
            Code envoyé à <span>{email || user?.email}</span>
          </p>
        )}

        {(feedback.error || error) && (
          <div className="alert error">
            <i className="icon-warning"></i>
            <span>{feedback.error || error}</span>
          </div>
        )}

        {feedback.success && (
          <div className="alert success">
            <i className="icon-check"></i>
            <span>{feedback.success}</span>
          </div>
        )}

        <div className="code-input-container">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) =>
              setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="Entrez le code à 6 chiffres"
            maxLength={6}
            disabled={loading}
            autoFocus
            className={feedback.error ? "error-border" : ""}
          />
          <div className="code-hint">Code de vérification (6 chiffres)</div>
        </div>

        <div className="actions">
          <button
            onClick={handleVerification}
            disabled={loading || verificationCode.length !== 6}
            className={`verify-button ${loading ? "loading" : ""}`}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Vérification en cours...
              </>
            ) : (
              "Vérifier le code"
            )}
          </button>

          <button
            onClick={handleResendCode}
            disabled={resendLoading || loading}
            className="resend-button"
          >
            {resendLoading ? (
              <>
                <span className="button-spinner"></span>
                Envoi en cours...
              </>
            ) : (
              <>
                <i className="icon-resend"></i>
                Renvoyer le code
              </>
            )}
          </button>
        </div>

        <div className="help-text">
          <p>Vous n'avez pas reçu le code ? Vérifiez vos spams ou réessayez.</p>
          <p>Le code est valide pendant 15 minutes.</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
