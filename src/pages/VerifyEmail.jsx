import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import axios from "axios";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { setUser, setTelegramInfo } = useUser();

  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState({ error: "", success: "" });
  const [loading, setLoading] = useState(false);

  // Vérifie si un email est présent pour la vérification
  useEffect(() => {
    const email = localStorage.getItem("emailToVerify");
    if (!email || !email.includes("@")) {
      navigate("/login");
    }
  }, [navigate]);

  // Gère la soumission du code
  const handleVerification = async () => {
    setLoading(true);
    setFeedback({ error: "", success: "" });

    const email = localStorage.getItem("emailToVerify");
    if (!email) {
      setFeedback({ error: "Aucun email trouvé pour la vérification." });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/verify`,
        { email, code }
      );

      const { user, telegram_info } = response.data;

      setUser(user);
      if (telegram_info) setTelegramInfo(telegram_info);

      localStorage.setItem(
        "userData",
        JSON.stringify({
          user,
          isVerified: true,
          telegramInfo: telegram_info || null,
        })
      );

      localStorage.removeItem("emailToVerify");

      setFeedback({
        error: "",
        success: "✅ Compte vérifié avec succès ! Redirection...",
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      const msg =
        err.response?.data?.detail || "Une erreur est survenue lors de la vérification.";
      setFeedback({ error: `❌ ${msg}`, success: "" });
    } finally {
      setLoading(false);
    }
  };

  // Validation par touche "Entrée"
  useEffect(() => {
    const keyHandler = (e) => {
      if (e.key === "Enter" && code.length === 6) {
        handleVerification();
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [code]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Vérifie ton adresse e-mail
        </h1>

        {/* Message d'erreur */}
        {feedback.error && (
          <div
            id="verification-error"
            className="text-red-700 bg-red-100 border border-red-300 rounded p-2 text-sm mb-4"
            role="alert"
            aria-live="assertive"
          >
            {feedback.error}
          </div>
        )}

        {/* Message de succès */}
        {feedback.success && (
          <div
            className="text-green-700 bg-green-100 border border-green-300 rounded p-2 text-sm mb-4"
            role="status"
            aria-live="polite"
          >
            {feedback.success}
          </div>
        )}

        {/* Affichage dynamique du nombre de chiffres saisis */}
        <p className="text-sm text-gray-500 mb-2 text-center">
          {code.length}/6 chiffres saisis
        </p>

        {/* Champ pour entrer le code */}
        <label htmlFor="code" className="sr-only">
          Code de vérification
        </label>
        <input
          id="code"
          type="text"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Code à 6 chiffres"
          value={code}
          onChange={(e) =>
            setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
          }
          required
          aria-label="Code de vérification"
          aria-invalid={!!feedback.error}
          aria-describedby={feedback.error ? "verification-error" : undefined}
        />

        {/* Bouton de validation */}
        <button
          onClick={handleVerification}
          disabled={loading || code.length !== 6}
          className={`w-full text-white font-semibold py-2 rounded-lg transition duration-200 ${
            loading || code.length !== 6
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Vérification en cours..." : "Vérifier le code"}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
