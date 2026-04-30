import React, { useMemo } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import { useCheck } from "../hooks/useCheck";
import { useTranslation } from "react-i18next";
import "./Check.css";

export default function Check() {
  // ✅ namespace correct
  const { t } = useTranslation("profil");

  const { user } = useUser();
  const { data, isLoading, isError, error } = useCheck();

  const criteria = useMemo(
    () => [
      { key: "friends", optional: false },
      { key: "tasks", optional: false },
      { key: "pack", optional: true },
      { key: "points", optional: false },
      { key: "days", optional: false },
      { key: "level", optional: false },
    ],
    []
  );

  if (!user || isLoading) {
    return (
      <div className="check-page">
        {t("common.loading", "Chargement...")}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="check-page">
        {t("check.error.default")} :{" "}
        {error?.message || t("check.error.fallback")}
      </div>
    );
  }

  if (!data) return null;

  const completed = criteria.filter((c) => data[c.key]).length;
  const progressPercent = Math.round(
    (completed / criteria.length) * 100
  );

  return (
    <div className="check-page">
      <h2>{t("check.title")}</h2>

      <p className="eligibility-warning">
        {t("check.warning")}
      </p>

      {/* Progress */}
      <div className="eligibility-progress-bar">
        <div
          className="eligibility-progress-fill"
          style={{ width: `${progressPercent}%` }}
        >
          {t("check.progress", {
            completed,
            total: criteria.length,
          })}
        </div>
      </div>

      {/* Criteria */}
      <div className="criteria-list">
        {criteria.map((item, index) => {
          const isValid = data[item.key];

          // ✅ valeurs dynamiques
          const valueMap = {
            friends: { count: data.friends_count || 0 },
            tasks: { count: data.tasks_count || 0 },
            points: { count: data.points || 0 },
            days: { count: data.days || 0 },
            level: { level: data.level || 0 },
          };

          return (
            <div
              key={item.key}
              className={`criteria-item ${
                item.optional ? "optional" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span>
                {t(`check.criteria.${item.key}`, valueMap[item.key])}
              </span>

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
            {t("check.eligible")}
          </p>
        ) : (
          <p className="not-eligible">
            {t("check.notEligible")}
          </p>
        )}
      </div>
    </div>
  );
}