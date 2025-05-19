import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import axios from 'axios';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { setUser, setTelegramInfo } = useUser();
  const [inputCode, setInputCode] = useState('');
  const [feedback, setFeedback] = useState({ error: '', success: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleCodeVerification = async () => {
    setIsLoading(true);
    setFeedback({ error: '', success: '' });

    try {
      const saved = localStorage.getItem('unverifiedUser');
      if (!saved) {
        throw new Error("Aucun utilisateur en attente de vérification.");
      }

      const userPayload = JSON.parse(saved);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/verify`,
        {
          email: userPayload.email,
          code: inputCode,
        }
      );

      const { user, telegram_info } = response.data;

      // Mise à jour du contexte utilisateur
      setUser(user);
      if (telegram_info) setTelegramInfo(telegram_info);

      localStorage.setItem(
        'userData',
        JSON.stringify({
          user,
          isVerified: true,
          telegramInfo: telegram_info || null,
        })
      );

      localStorage.removeItem('unverifiedUser');

      setFeedback({
        error: '',
        success: '✅ Compte vérifié avec succès !',
      });

      setTimeout(() => navigate('/home'), 1200);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        'Une erreur est survenue.';
      setFeedback({ error: `❌ ${msg}`, success: '' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const listener = (e) => {
      if (e.key === 'Enter') handleCodeVerification();
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [inputCode]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Vérification de l’adresse email
        </h2>

        {feedback.error && (
          <div
            className="text-red-600 bg-red-100 border border-red-300 rounded p-2 text-sm mb-4"
            role="alert" aria-live="assertive"
          >
            {feedback.error}
          </div>
        )}

        {feedback.success && (
          <div
            className="text-green-600 bg-green-100 border border-green-300 rounded p-2 text-sm mb-4"
            role="status" aria-live="polite"
          >
            {feedback.success}
          </div>
        )}

        <label htmlFor="verificationCode" className="sr-only">
          Code de vérification
        </label>
        <input
          id="verificationCode"
          type="text"
          inputMode="numeric"
          maxLength={6}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Entrez le code de vérification"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
        />

        <button
          onClick={handleCodeVerification}
          disabled={!inputCode || isLoading}
          className={`w-full text-white font-semibold py-2 rounded-lg transition duration-200 ${
            isLoading || !inputCode
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Vérification...' : 'Vérifier le code'}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
