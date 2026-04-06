// src/pages/Bonus.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { useTranslation } from "react-i18next";
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
  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  const [bonus, setBonus] = useState(null);
  const [conditions, setConditions] = useState({});
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState("");

  const notifiedRef = useRef(false);

  // ================= FETCH =================
  const fetchBonusData = async () => {
    if (!user) return;

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
          t("bonus.error.generic")
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= CLAIM =================
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
      setSuccess(t("bonus.success.claimed"));
      notifiedRef.current = false;
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          t("bonus.error.claim")
      );
    } finally {
      setClaiming(false);
    }
  };

  // ================= LOAD =================
  useEffect(() => {
    fetchBonusData();
  }, [user]);

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
          fetchBonusData();
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
  }, [bonus, t]);

  // ================= HELPERS =================
  const total = bonus?.total_points || 1;
  const remaining = bonus?.points_restants || 0;
  const progressPercent = Math.min((remaining / total) * 100, 100);

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

      {loading && (
        <div className="bonus-loading">
          <FaSpinner className="spin" />
          {t("bonus.loading")}
        </div>
      )}

      {error && <div className="bonus-error">{error}</div>}
      {success && <div className="bonus-success">{success}</div>}

      {!loading && bonus && (
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
              onClick={handleClaim}
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