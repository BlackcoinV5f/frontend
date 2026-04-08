// src/pages/Check.jsx
import React from "react";
import { useUser } from "../contexts/UserContext.jsx";
import { useQuery } from "@tanstack/react-query";
import "./Check.css";

export default function Check() {
  const { axiosInstance, user } = useUser();

  // ✅ React Query
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["eligibility", user?.id],
    queryFn: async () => {
      const res = await axiosInstance.get("/eligibility/check/");
      return res.data;
    },
    enabled: !!user,
    staleTime: Infinity, // ✅ cache jusqu'au refresh app
    cacheTime: Infinity, // garde en mémoire
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div className="check-page">Loading...</div>;

  if (isError)
    return (
      <div className="check-page">
        ❌ Impossible de vérifier l'éligibilité
      </div>
    );

  if (!data) return null;

  const criteria = [
    { label: "5 amis", key: "friends", optional: false },
    { label: "50 tasks", key: "tasks", optional: false },
    { label: "Pack payé (bonus)", key: "pack", optional: true },
    { label: "50M pts", key: "points", optional: false },
    { label: "21 jours d'utilisation", key: "days", optional: false },
    { label: "Level 5 (mining)", key: "level", optional: false },
  ];

  const completed = criteria.filter((c) => data[c.key]).length;
  const progressPercent = Math.round(
    (completed / criteria.length) * 100
  );

  return (
    <div className="check-page">
      <h2>Eligibility Check</h2>

      <p className="eligibility-warning">
        ⚠️ Les critères affichés peuvent évoluer avec le projet.
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
        {criteria.map((item, index) => (
          <div
            key={index}
            className={`criteria-item ${
              item.optional ? "optional" : ""
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span>{item.label}</span>
            <span className={data[item.key] ? "achieved" : ""}>
              {data[item.key]
                ? "✅"
                : item.optional
                ? "⚪"
                : "❌"}
            </span>
          </div>
        ))}
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