import React, { useMemo } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import { useCheck } from "../hooks/useCheck";
import { useTranslation } from "react-i18next";
import "./Check.css";

export default function Check() {
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

  // ================= LOADING =================
  if (!user || isLoading) {
    return (
      <div className="check-page-wrapper">
        <div className="check-page">
          {t("common.loading")}
        </div>
      </div>
    );
  }

  // ================= ERROR =================
  if (isError) {
    return (
      <div className="check-page-wrapper">
        <div className="check-page">
          {t("check.error.full", {
            message: error?.message || t("check.error.fallback"),
          })}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const completed = criteria.filter((c) => data[c.key]).length;
  const progressPercent = Math.round(
    (completed / criteria.length) * 100
  );

  const valueMap = {
    friends: { count: data.friends_count || 0 },
    tasks: { count: data.tasks_count || 0 },
    pack: {},
    points: { count: data.points || 0 },
    days: { count: data.days || 0 },
    level: { level: data.level || 0 },
  };

  // ================= UI =================
  return (
    <div className="check-page-wrapper">
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
            const isValid = Boolean(data[item.key]);

            return (
              <div
                key={item.key}
                className={`criteria-item ${
                  item.optional ? "optional" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span>
                  {t(`check.criteria.${item.key}`, {
                    ...valueMap[item.key],
                    defaultValue: item.key,
                  })}
                </span>

                <span
                  className={isValid ? "achieved" : ""}
                  aria-label={
                    isValid
                      ? t("check.status.valid")
                      : item.optional
                      ? t("check.status.optional")
                      : t("check.status.invalid")
                  }
                >
                  {isValid
                    ? t("check.icons.valid")
                    : item.optional
                    ? t("check.icons.optional")
                    : t("check.icons.invalid")}
                </span>
              </div>
            );
          })}
        </div>

        {/* Result */}
        <div className="eligibility-result">
          {data.eligible ? (
            <p className="eligible">{t("check.eligible")}</p>
          ) : (
            <p className="not-eligible">{t("check.notEligible")}</p>
          )}
        </div>

      </div>
    </div>
  );
}