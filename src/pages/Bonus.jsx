// src/pages/Bonus.jsx
import React, { useEffect, useRef, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const { user, axiosInstance } = useUser();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [countdown, setCountdown] = useState("");
  const notifiedRef = useRef(false);

  // ================= GET BONUS (CACHE GLOBAL) =================
  const {
    data: bonus,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bonus", user?.id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/bonus/${user.id}/status`);
      return res.data;
    },
    enabled: !!user?.id,
    staleTime: Infinity, // 🔥 cache jusqu’au refresh app
    refetchOnWindowFocus: false,
  });

  const conditions = bonus?.conditions || {};

  // ================= CLAIM (MUTATION) =================
  const { mutate: claimBonus, isLoading: claiming } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/bonus/${user.id}/claim`);
      return res.data;
    },
    onSuccess: (data) => {
      // 🔥 met à jour le cache directement
      queryClient.setQueryData(["bonus", user?.id], data);
      notifiedRef.current = false;
    },
  });

  // ================= COUNTDOWN =================
  useEffect(() => {
    if (!bonus?.next_claim_at || bonus.status !== "cooldown") {
      setCountdown("");
      return;
    }

    const tick = () => {
      const now = new Date();
      const next = new Date(bonus.next_claim_at);
      const diff = next - now;

      if (diff <= 0) {
        setCountdown(t("bonus.available"));

        if (!notifiedRef.current) {
          notifiedRef.current = true;
          window.dispatchEvent(new CustomEvent("bonus:available"));

          // 🔥 refetch propre
          queryClient.invalidateQueries(["bonus", user?.id]);
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
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [bonus, t, queryClient, user?.id]);

  // ================= AUTH =================
  if (!user) {
    return (
      <div className="bonus-auth-required">
        <FaExclamationTriangle />
        <h3>{t("bonus.authRequired")}</h3>
      </div>
    );
  }

  // ================= HELPERS =================
  const total = bonus?.total_points || 1;
  const remaining = bonus?.points_restants || 0;
  const progressPercent = Math.min((remaining / total) * 100, 100);

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

      {error && <div className="bonus-error">{t("bonus.error.generic")}</div>}

      {!isLoading && bonus && (
        <div className="bonus-content">
          {/* POINTS */}
          <div className="points-card">
            <h3>{t("bonus.points.title")}</h3>

            <div className="points-value">
              {remaining} / {total}
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

            <div
              className={`condition-item ${
                conditions.friends_count >= 3 ? "completed" : ""
              }`}
            >
              <FaUsers />{" "}
              {t("bonus.conditions.friendsCount", {
                count: conditions.friends_count || 0,
              })}
            </div>
          </div>

          {/* ACTION */}
          <div className="action-section">
            <button
              onClick={() => claimBonus()}
              disabled={claiming || bonus.status !== "eligible"}
              className={`convert-btn ${
                bonus.status === "eligible" ? "eligible" : "disabled"
              }`}
            >
              {claiming ? (
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