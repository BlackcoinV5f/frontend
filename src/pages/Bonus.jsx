// src/pages/Bonus.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import {
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
  FaGift,
  FaUsers,
  FaCoins,
  FaGem,
  FaCrown,
  FaStar,
  FaTicketAlt,
} from "react-icons/fa";
import "./bonus.css";

export default function Bonus() {
  const { user } = useUser();

  const [bonus, setBonus] = useState(null);
  const [conditions, setConditions] = useState({});
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  // ==========================================================
  // 🔹 FETCH BONUS STATUS
  // ==========================================================
  const fetchBonusData = async () => {
    if (!user) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.get(
        `${BACKEND}/bonus/${user.id}/status`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setBonus(res.data);
      setConditions(res.data.conditions || {});
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Erreur lors du chargement des bonus"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // 🔹 CLAIM BONUS
  // ==========================================================
  const handleClaim = async () => {
    if (!bonus || bonus.status !== "eligible") return;

    setClaiming(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        `${BACKEND}/bonus/${user.id}/claim`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setBonus(res.data);
      setSuccess("🎉 Bonus réclamé avec succès !");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Erreur lors de la réclamation"
      );
    } finally {
      setClaiming(false);
    }
  };

  useEffect(() => {
    fetchBonusData();
  }, [user]);

  // ==========================================================
  // 🔹 STATUS UI
  // ==========================================================
  const getStatusIcon = (status) => {
    switch (status) {
      case "eligible":
        return <FaCheck className="status-icon eligible" />;
      case "cooldown":
        return <FaSpinner className="status-icon spin" />;
      case "insufficient_points":
        return <FaExclamationTriangle className="status-icon pending" />;
      case "conditions_not_met":
        return <FaGem className="status-icon pending" />;
      default:
        return <FaExclamationTriangle className="status-icon pending" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "eligible":
        return "Éligible";
      case "cooldown":
        return "Cooldown actif";
      case "insufficient_points":
        return "Points insuffisants";
      case "conditions_not_met":
        return "Conditions non remplies";
      default:
        return "Non disponible";
    }
  };

  const total = bonus?.total_points || 1;
  const remaining = bonus?.points_restants || 0;
  const progressPercent = Math.min((remaining / total) * 100, 100);

  if (!user) {
    return (
      <div className="bonus-auth-required">
        <FaExclamationTriangle />
        <h3>Connexion requise</h3>
      </div>
    );
  }

  return (
    <div className="bonus-page">
      <div className="bonus-header">
        <FaGift className="header-icon" />
        <h1>Programme de Bonus</h1>
        <p>Réclamez 0.3 BKC toutes les 24h</p>
      </div>

      {loading && (
        <div className="bonus-loading">
          <FaSpinner className="spin" />
          <p>Chargement...</p>
        </div>
      )}

      {error && (
        <div className="bonus-error">
          <FaExclamationTriangle />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bonus-success">
          <FaCheck />
          <p>{success}</p>
        </div>
      )}

      {!loading && bonus && (
        <div className="bonus-content">
          {/* Carte Points */}
          <div className="points-card">
            <h3>Vos Points</h3>

            <div className="points-value">
              {remaining} / {total}
            </div>

            <div className="progress-bar-wrapper">
              <div
                className="progress-bar"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="status-indicator">
              {getStatusIcon(bonus.status)}
              <span>{getStatusText(bonus.status)}</span>
            </div>

            {bonus.next_claim_at && bonus.status === "cooldown" && (
              <div className="cooldown-info">
                Prochaine réclamation :
                <br />
                {new Date(bonus.next_claim_at).toLocaleString()}
              </div>
            )}
          </div>

          {/* Conditions */}
          <div className="conditions-card">
            <h3>Conditions</h3>

            <div
              className={`condition-item ${
                conditions?.pack ? "completed" : ""
              }`}
            >
              <FaGem />
              Pack actif
            </div>

            <div
              className={`condition-item ${
                conditions?.deposit ? "completed" : ""
              }`}
            >
              <FaTicketAlt />
              Dépôt effectué
            </div>

            <div
              className={`condition-item ${
                conditions?.friends_count >= 3 ? "completed" : ""
              }`}
            >
              <FaUsers />
              Parrainage ({conditions?.friends_count || 0}/3)
            </div>
          </div>

          {/* Action */}
          <div className="action-section">
            <button
              onClick={handleClaim}
              disabled={claiming || bonus.status !== "eligible"}
              className={`convert-btn ${
                bonus.status === "eligible" ? "eligible" : "disabled"
              }`}
            >
              {claiming ? (
                <>
                  <FaSpinner className="spin" />
                  Réclamation...
                </>
              ) : (
                <>
                  <FaCoins />
                  Réclamer 0.3 BKC
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
