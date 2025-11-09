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
  FaTicketAlt
} from "react-icons/fa";
import "./bonus.css";

export default function Bonus() {
  const { user } = useUser();
  const [bonus, setBonus] = useState(null);
  const [conditions, setConditions] = useState({});
  const [eligible, setEligible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Récupération et normalisation des données du backend
  const fetchBonusData = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/bonus/${user.id}/status`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const bonusData = res.data.bonus || {};
      const rawConditions = res.data.conditions || {};

      // Normalisation robuste des valeurs du backend
      const normalizeBool = (val) => {
        if (typeof val === "boolean") return val;
        if (!val) return false;
        const s = String(val).trim().toLowerCase();
        return ["oui", "yes", "true", "1"].includes(s);
      };

      const packOK = normalizeBool(rawConditions.pack);
      const depositOK = normalizeBool(rawConditions.deposit);

      // Extraction du nombre d'amis
      let friendsCount = 0;
      if (typeof rawConditions.friends === "string" && rawConditions.friends.includes("/")) {
        const [first] = rawConditions.friends.split("/");
        friendsCount = parseInt(first, 10) || 0;
      } else {
        friendsCount = parseInt(rawConditions.friends, 10) || 0;
      }

      setBonus(bonusData);
      setConditions({
        pack: packOK,
        friends: friendsCount,
        friendsRaw: rawConditions.friends || "0/3",
        deposit: depositOK,
      });
      setEligible(bonusData.status === "eligible");
    } catch (err) {
      if (err.response?.status === 404) {
        setBonus(null);
        setEligible(false);
        setConditions({});
      } else {
        setError(
          err.response?.data?.detail || err.message || "Erreur lors du chargement des bonus"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Conversion des points
  const handleClaim = async () => {
    if (!eligible || !bonus) return;
    setClaiming(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/bonus/${user.id}/claim`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setBonus((prev) => ({
        ...prev,
        points_restants: res.data.points_restants,
        status: res.data.points_restants <= 0 ? "converti" : "en_conversion",
      }));

      setSuccess("🎉 Bonus converti avec succès ! Vos points ont été crédités.");

      setTimeout(() => fetchBonusData(), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Erreur lors de la conversion");
    } finally {
      setClaiming(false);
    }
  };

  useEffect(() => {
    fetchBonusData();
  }, [user]);

  // 🔹 Affichage des statuts
  const getStatusIcon = (status) => {
    switch (status) {
      case "eligible":
        return <FaCheck className="status-icon eligible" />;
      case "converti":
        return <FaStar className="status-icon converted" />;
      case "en_conversion":
        return <FaSpinner className="status-icon converting spin" />;
      default:
        return <FaExclamationTriangle className="status-icon pending" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "eligible":
        return "Éligible";
      case "converti":
        return "Converti";
      case "en_conversion":
        return "En conversion";
      default:
        return "En attente";
    }
  };

  // 🔹 Protection division par zéro
  const total = bonus?.total_points || 1;
  const remaining = bonus?.points_restants || 0;
  const progressPercent = Math.max(0, Math.min((remaining / total) * 100, 100));

  if (!user) {
    return (
      <div className="bonus-auth-required">
        <div className="auth-message">
          <FaExclamationTriangle className="auth-icon" />
          <h3>Connexion Requise</h3>
          <p>Veuillez vous connecter pour accéder à vos bonus</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bonus-page">
      {/* En-tête */}
      <div className="bonus-header">
        <div className="header-glow"></div>
        <FaGift className="header-icon" />
        <h1>Programme de Bonus</h1>
        <p>Profitez de nos récompenses exclusives</p>
      </div>

      {loading && (
        <div className="bonus-loading">
          <div className="loading-spinner">
            <FaSpinner className="spin" />
          </div>
          <p>Chargement de vos avantages...</p>
        </div>
      )}

      {error && (
        <div className="bonus-error">
          <div className="error-content">
            <FaExclamationTriangle className="error-icon" />
            <div className="error-text">
              <h4>Erreur</h4>
              <p>{error}</p>
            </div>
            <button onClick={fetchBonusData} className="retry-btn">
              Réessayer
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="bonus-success">
          <FaCheck className="success-icon" />
          <p>{success}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="bonus-content">
          {bonus ? (
            <>
              {/* Carte des points */}
              <div className="points-card">
                <div className="points-header">
                  <FaCoins className="points-icon" />
                  <h3>Vos Points Bonus</h3>
                </div>
                <div className="points-grid">
                  <div className="points-total">
                    <span className="points-label">Total Accumulés</span>
                    <span className="points-value">{bonus.total_points}</span>
                    <div className="points-progress">
                      <div
                        className="progress-bar"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="points-remaining">
                    <span className="points-label">Restants à Convertir</span>
                    <span className="points-value highlight">
                      {bonus.points_restants}
                    </span>
                  </div>
                </div>
                <div className="status-indicator">
                  {getStatusIcon(bonus.status)}
                  <span className={`status-text ${bonus.status}`}>
                    {getStatusText(bonus.status)}
                  </span>
                </div>
              </div>

              {/* Conditions d'éligibilité */}
              <div className="conditions-card">
                <div className="conditions-header">
                  <FaCrown className="conditions-icon" />
                  <h3>Conditions d'Éligibilité</h3>
                </div>
                <div className="conditions-list">
                  {/* Pack */}
                  <div className={`condition-item ${conditions?.pack ? "completed" : "pending"}`}>
                    <div className="condition-icon">
                      {conditions?.pack ? <FaCheck /> : <FaGem />}
                    </div>
                    <div className="condition-info">
                      <span className="condition-title">Pack Actif</span>
                      <span className="condition-status">
                        {conditions?.pack ? "Complété ✓" : "Non activé"}
                      </span>
                    </div>
                  </div>

                  {/* Parrainage */}
                  <div className={`condition-item ${conditions?.friends >= 3 ? "completed" : "pending"}`}>
                    <div className="condition-icon">
                      <FaUsers />
                    </div>
                    <div className="condition-info">
                      <span className="condition-title">Parrainage</span>
                      <span className="condition-status">
                        {conditions?.friendsRaw || `${conditions?.friends || 0}/3`}
                      </span>
                    </div>
                    <div className="friends-progress">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min((conditions?.friends / 3) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Dépôt */}
                  <div className={`condition-item ${conditions?.deposit ? "completed" : "pending"}`}>
                    <div className="condition-icon">
                      <FaTicketAlt />
                    </div>
                    <div className="condition-info">
                      <span className="condition-title">Dépôt Initial</span>
                      <span className="condition-status">
                        {conditions?.deposit ? "Effectué ✓" : "En attente"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton d'action */}
              <div className="action-section">
                <button
                  onClick={handleClaim}
                  disabled={claiming || bonus.status === "converti" || !eligible}
                  className={`convert-btn ${eligible ? "eligible" : "disabled"}`}
                >
                  {claiming ? (
                    <>
                      <FaSpinner className="spin" />
                      Conversion en cours...
                    </>
                  ) : (
                    <>
                      <FaCoins />
                      Convertir les Points
                    </>
                  )}
                </button>

                {bonus.status === "converti" && (
                  <div className="conversion-complete">
                    <FaCheck />
                    Tous vos points ont été convertis avec succès !
                  </div>
                )}
              </div>
            </>
          ) : (
            // Aucun bonus
            <div className="no-bonus-card">
              <div className="no-bonus-icon">
                <FaGift />
              </div>
              <h3>Aucun Bonus Disponible</h3>
              <p>
                Complétez les conditions d'éligibilité pour débloquer vos premiers bonus
                et commencer à accumuler des points.
              </p>
              <button onClick={fetchBonusData} className="refresh-btn">
                Actualiser
              </button>
            </div>
          )}
        </div>
      )}

      {/* Infos supplémentaires */}
      <div className="bonus-info">
        <div className="info-card">
          <h4>💡 Comment ça marche ?</h4>
          <ul>
            <li>Accumulez des points en complétant les conditions</li>
            <li>Convertissez vos points en récompenses</li>
            <li>Les points convertis sont crédités immédiatement</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
