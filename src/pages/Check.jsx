// src/pages/Check.jsx
import React, { useMemo } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import { useQuery } from "@tanstack/react-query";
import "./Check.css";

export default function Check() {
  const { axiosInstance, user } = useUser();

  // 🔥 Criteria memo (évite recréation)
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

  // ✅ React Query optimisé
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["eligibility", user?.id],

    queryFn: async () => {
      const res = await axiosInstance.get("/eligibility/check/");
      return res.data;
    },

    enabled: !!user && !!axiosInstance,

    staleTime: Infinity, // cache permanent
    gcTime: Infinity, // remplace cacheTime en v5

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,

    // 🔥 Optimisation : transforme data directement
    select: (data) => {
      const completed = Object.values(data).filter(Boolean).length;
      return {
        ...data,
        completed,
      };
    },
  });

  // ⏳ Loading propre
  if (isLoading) {
    return <div className="check-page">⏳ Chargement...</div>;
  }

  // ❌ Error propre
  if (isError) {
    return (
      <div className="check-page">
        ❌ Erreur: {error?.message || "Impossible de vérifier"}
      </div>
    );
  }

  if (!data) return null;

  // 🔥 Calcul propre
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