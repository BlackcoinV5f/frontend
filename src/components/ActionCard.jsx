import React, { useState, useMemo } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useActionMutations } from "../hooks/useActionMutations"; // ✅ IMPORTANT
import "./ActionCard.css";

const ActionCard = ({ action: rawAction, context = "available" }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { buy, start, claim } = useActionMutations(); // ✅ centralisation

  const [action, setAction] = useState(rawAction);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // =========================
  // 🔧 NORMALISATION
  // =========================
  const pack = useMemo(
    () => ({
      id: action?.id,
      name: action?.name ?? t("action.defaultName"),
      category: action?.category ?? "—",
      type: action?.type ?? "—",
      image: action?.image_url ?? "/images/default_pack.png",
      price: Number(action?.price_usdt ?? 0),
      totalParts: action?.total_parts ?? "—",
      status: action?.pack_status ?? action?.status ?? "disponible",
      dailyEarnings: Number(
        action?.daily_earnings ?? action?.estimated_daily_bkc ?? 0
      ),
    }),
    [action, t]
  );

  // =========================
  // 🎨 STATUS COLOR
  // =========================
  const statusColor = {
    disponible: "#16a34a",
    payé: "#16a34a",
    en_cours: "#facc15",
    à_reclamer: "#3b82f6",
    en_attente: "#9ca3af",
    terminé: "#ef4444",
  }[pack.status] || "#ef4444";

  // =========================
  // 🎯 BUTTON LABEL
  // =========================
  const getButtonLabel = () => {
    if (context === "available") {
      if (pack.status === "disponible") return t("action.button.contribute");
      if (pack.status === "épuisé") return t("action.button.unavailable");
      return null;
    }

    if (pack.status === "payé") return t("action.button.start");
    if (pack.status === "en_cours") return t("action.button.viewTasks");
    if (pack.status === "à_reclamer") return t("action.button.claim");
    if (pack.status === "en_attente") return t("action.button.pending");
    if (pack.status === "terminé") return t("action.button.completed");
    return null;
  };

  const buttonLabel = getButtonLabel();

  const isButtonDisabled = () =>
    loading || ["terminé", "retiré", "épuisé", "en_attente"].includes(pack.status);

  // =========================
  // ⚙️ ACTION HANDLER (FIXED)
  // =========================
  const handleClick = async () => {
    if (!user) {
      setMessage(t("action.feedback.mustLogin"));
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      if (context === "available" && pack.status === "disponible") {
        await buy.mutateAsync(pack.id);

        // ⚡ UX instantané
        setAction((prev) => ({ ...prev, pack_status: "payé" }));

        setMessage(t("action.feedback.buySuccess", { name: pack.name }));
      }

      else if (context === "owned" && pack.status === "payé") {
        await start.mutateAsync(pack.id);

        setAction((prev) => ({ ...prev, pack_status: "en_cours" }));

        setMessage(t("action.feedback.startSuccess", { name: pack.name }));
      }

      else if (context === "owned" && pack.status === "en_cours") {
        navigate(`/daily-tasks/${pack.id}`);
        return;
      }

      else if (context === "owned" && pack.status === "à_reclamer") {
        await claim.mutateAsync(pack.id);

        setMessage(t("action.feedback.claimSuccess", { name: pack.name }));
      }

    } catch (error) {
      const msg =
        error.response?.data?.detail ||
        error.message ||
        t("action.feedback.error");

      setMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🧱 RENDER
  // =========================
  return (
    <div className="action-card">
      <div className="card-header">
        <div className="icon-container">
          <img
            src={pack.image}
            alt={pack.name}
            className="pack-icon"
            onError={(e) => {
              if (!e.target.dataset.fallback) {
                e.target.dataset.fallback = "true";
                e.target.src = "/images/default_pack.png";
              }
            }}
          />
        </div>
        <h3 className="action-name">{pack.name}</h3>
      </div>

      <div className="card-body">
        <p>{t("action.category")} : <span>{pack.category}</span></p>
        <p>{t("action.type")} : <span>{pack.type}</span></p>

        {context === "available" && (
          <>
            <p>
              {t("action.pricePerPart")} :{" "}
              <strong>{pack.price.toFixed(2)} USDT</strong>
            </p>
            <p>
              {t("action.totalParts")} : <span>{pack.totalParts}</span>
            </p>
          </>
        )}

        <p>
          {t("action.dailyEarnings")} :{" "}
          <strong>{pack.dailyEarnings.toFixed(5)} $BKC</strong>
        </p>

        <p>
          {t("action.status")} :{" "}
          <span style={{ color: statusColor, fontWeight: "bold" }}>
            {pack.status}
          </span>
        </p>
      </div>

      <div className="card-footer">
        {buttonLabel && (
          <button
            className={`contribute-btn ${
              pack.status === "à_reclamer"
                ? "claim"
                : pack.status === "payé"
                ? "start"
                : ""
            }`}
            onClick={handleClick}
            disabled={isButtonDisabled()}
          >
            {loading ? t("action.button.loading") : buttonLabel}
          </button>
        )}

        {message && (
          <p
            className="feedback"
            style={{
              color: message.startsWith("❌") ? "#ef4444" : "#16a34a",
              fontWeight: 500,
              marginTop: "8px",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ActionCard;