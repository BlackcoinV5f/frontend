import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useUser } from "../contexts/UserContext";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useBonus } from "../hooks/useBonus";

import {
  FaSpinner,
  FaExclamationTriangle,
  FaGift,
  FaUsers,
  FaCoins,
  FaGem,
  FaTicketAlt,
} from "react-icons/fa";

import "./bonus.css";

export default function Bonus() {
  const { user } = useUser();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: bonus, isLoading, isError, claimBonus } = useBonus();

  const [countdown, setCountdown] = useState("");
  const notifiedRef = useRef(false);

  // ================= ACTION =================
  const handleClaim = useCallback(() => {
    if (!claimBonus.isPending) {
      claimBonus.mutate();
      notifiedRef.current = false;
    }
  }, [claimBonus]);

  // ================= MEMO =================
  const conditions = useMemo(() => bonus?.conditions || {}, [bonus]);

  const progressPercent = useMemo(() => {
    const total = bonus?.total_points || 1;
    const remaining = bonus?.points_restants || 0;
    return Math.min((remaining / total) * 100, 100);
  }, [bonus]);

  // ================= COUNTDOWN =================
  useEffect(() => {
    if (!bonus?.next_claim_at || bonus.status !== "cooldown") {
      setCountdown("");
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const next = new Date(bonus.next_claim_at);
      const diff = next - now;

      if (diff <= 0) {
        setCountdown(t("bonus.available"));

        if (!notifiedRef.current) {
          notifiedRef.current = true;

          window.dispatchEvent(new CustomEvent("bonus:available"));

          queryClient.invalidateQueries({
            queryKey: ["bonus", user?.id],
          });
        }
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setCountdown(
        `${h.toString().padStart(2, "0")}h ` +
        `${m.toString().padStart(2, "0")}m ` +
        `${s.toString().padStart(2, "0")}s`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [bonus?.next_claim_at, bonus?.status, t, queryClient, user?.id]);

  // ================= AUTH =================
  if (!user) {
    return (
      <div className="bonus-auth-required">
        <FaExclamationTriangle />
        <h3>{t("bonus.authRequired")}</h3>
      </div>
    );
  }

  // ================= RENDER =================
  return (
    <div className="bonus-page">
      <div className="bonus-header">
        <FaGift className="header-icon" />
        <h1>{t("bonus.title")}</h1>
        <p>{t("bonus.subtitle")}</p>
      </div>

      {isLoading && (
        <div className="bonus-loading">
          <FaSpinner className="spin" />
          {t("bonus.loading")}
        </div>
      )}

      {isError && (
        <div className="bonus-error">
          {t("bonus.error.generic")}
        </div>
      )}

      {!isLoading && bonus && (
        <div className="bonus-content">
          {/* POINTS */}
          <div className="points-card">
            <h3>{t("bonus.points.title")}</h3>

            <div className="points-value">
              {bonus.points_restants} / {bonus.total_points}
            </div>

            <div className="progress-bar-wrapper">
              <div
                className="progress-bar"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {bonus.status === "cooldown" && (
              <div className="cooldown-info">
                {t("bonus.availableIn")}
                <br />
                <strong>{countdown}</strong>
              </div>
            )}
          </div>

          {/* CONDITIONS */}
          <div className="conditions-card">
            <h3>{t("bonus.conditions.title")}</h3>

            <div className={`condition-item ${conditions.has_pack ? "completed" : ""}`}>
              <FaGem /> {t("bonus.conditions.hasPack")}
            </div>

            <div className={`condition-item ${conditions.has_deposit ? "completed" : ""}`}>
              <FaTicketAlt /> {t("bonus.conditions.hasDeposit")}
            </div>

            <div className={`condition-item ${conditions.friends_count >= 3 ? "completed" : ""}`}>
              <FaUsers />
              {t("bonus.conditions.friendsCount", {
                count: conditions.friends_count || 0,
              })}
            </div>
          </div>

          {/* ACTION */}
          <div className="action-section">
            <button
              onClick={handleClaim}
              disabled={claimBonus.isPending || bonus.status !== "eligible"}
              className={`convert-btn ${
                bonus.status === "eligible" ? "eligible" : "disabled"
              }`}
            >
              {claimBonus.isPending ? (
                <>
                  <FaSpinner className="spin" /> {t("bonus.claiming")}
                </>
              ) : (
                <>
                  <FaCoins /> {t("bonus.claim")}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}