import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import "./Check.css";

export default function Check() {
  const { axiosInstance, user } = useUser();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false); // évite double fetch

  const fetchEligibility = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get("/eligibility/check");
      setData(response.data);
      setLoaded(true);
    } catch (err) {
      console.error("❌ Erreur API eligibility :", err);
      setError("Impossible de vérifier l'éligibilité");
    } finally {
      setLoading(false);
    }
  };

  // Recharge uniquement si utilisateur connecté et pas déjà chargé
  useEffect(() => {
    if (user && !loaded) {
      fetchEligibility();
    }
  }, [user, loaded]);

  if (loading) return <div className="check-page">Loading...</div>;
  if (error) return <div className="check-page">{error}</div>;
  if (!data) return null;

  const criteria = [
    { label: "5 amis", key: "friends", optional: false },
    { label: "50 tasks", key: "tasks", optional: false },
    { label: "Pack payé (bonus)", key: "pack", optional: true },
    { label: "50M pts", key: "points", optional: false },
    { label: "21 jours d'utilisation", key: "days", optional: false },
  ];

  const completed = criteria.filter(c => data[c.key]).length;
  const progressPercent = Math.round((completed / criteria.length) * 100);

  return (
    <div className="check-page">
      <h2>Eligibility Check</h2>

      <p className="eligibility-warning">
        ⚠️ Les critères affichés sur cette page peuvent être mis à jour au fur et à mesure de l’avancement du projet BlackCoin.
      </p>

      {/* Barre de progression animée */}
      <div className="eligibility-progress-bar">
        <div
          className="eligibility-progress-fill"
          style={{ width: `${progressPercent}%` }}
        >
          {completed} / {criteria.length} validés
        </div>
      </div>

      {/* Liste des critères */}
      <div className="criteria-list">
        {criteria.map((item, index) => (
          <div
            key={index}
            className={`criteria-item ${item.optional ? "optional" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span>{item.label}</span>
            <span className={data[item.key] ? "achieved" : ""}>
              {data[item.key] ? "✅" : item.optional ? "⚪" : "❌"}
            </span>
          </div>
        ))}
      </div>

      {/* Résultat final */}
      <div className="eligibility-result">
        {data.eligible ? (
          <p className="eligible">🎉 Vous êtes éligible à l'airdrop</p>
        ) : (
          <p className="not-eligible">❌ Conditions obligatoires non remplies</p>
        )}
      </div>
    </div>
  );
}