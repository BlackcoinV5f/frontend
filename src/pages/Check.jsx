import React, { useMemo } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import { useCheck } from "../hooks/useCheck";
import "./Check.css";

export default function Check() {
  const { user } = useUser();

  const { data, isLoading, isError, error } = useCheck();

  // 🔥 criteria memo inchangé
  const criteria = useMemo(
    () => [
      { label: "5 amis", key: "friends", optional: false },
      { label: "50 tasks", key: "tasks", optional: false },
      { label: "Pack payé (bonus)", key: "pack", optional: true },
      { label: "50M pts", key: "points", optional: false },
      { label: "21 jours d'utilisation", key: "days", optional: false },
      { label: "Level 5 (mining)", key: "level", optional: false },
    ],
    []
  );

  if (!user) {
    return <div className="check-page">⏳ Chargement...</div>;
  }

  if (isLoading) {
    return <div className="check-page">⏳ Chargement...</div>;
  }

  if (isError) {
    return (
      <div className="check-page">
        ❌ Erreur: {error?.message || "Impossible de vérifier"}
      </div>
    );
  }

  if (!data) return null;

  // 🔥 calcul UI (correct)
  const completed = criteria.filter((c) => data[c.key]).length;
  const progressPercent = Math.round(
    (completed / criteria.length) * 100
  );

  return (
    <div className="check-page">
      <h2>Eligibility Check</h2>

      <p className="eligibility-warning">
        ⚠️ Les critères peuvent évoluer avec le projet.
      </p>

      {/* Progress */}
      <div className="eligibility-progress-bar">
        <div
          className="eligibility-progress-fill"
          style={{ width: `${progressPercent}%` }}
        >
          {completed} / {criteria.length} validés
        </div>
      </div>

      {/* Criteria */}
      <div className="criteria-list">
        {criteria.map((item, index) => {
          const isValid = data[item.key];

          return (
            <div
              key={item.key}
              className={`criteria-item ${
                item.optional ? "optional" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span>{item.label}</span>

              <span className={isValid ? "achieved" : ""}>
                {isValid ? "✅" : item.optional ? "⚪" : "❌"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Result */}
      <div className="eligibility-result">
        {data.eligible ? (
          <p className="eligible">
            🎉 Vous êtes éligible à l'airdrop
          </p>
        ) : (
          <p className="not-eligible">
            ❌ Conditions obligatoires non remplies
          </p>
        )}
      </div>
    </div>
  );
}