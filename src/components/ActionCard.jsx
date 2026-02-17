import React, { useState, useMemo } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import "./ActionCard.css";

const ActionCard = ({ action: rawAction, context = "available" }) => {
  const { user, axiosInstance } = useUser();
  const navigate = useNavigate();

  const [action, setAction] = useState(rawAction);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // =========================
  // 🔧 NORMALISATION DES DONNÉES (IMPORTANT)
  // =========================
  const pack = useMemo(() => ({
    id: action?.id,
    name: action?.name ?? "Pack sans nom",
    category: action?.category ?? "—",
    type: action?.type ?? "—",
    image: action?.image_url ?? "/images/default_pack.png",
    price: Number(action?.price_usdt ?? 0),
    totalParts: action?.total_parts ?? "—",

    // harmonisation backend
    status: action?.pack_status ?? action?.status ?? "disponible",

    // harmonisation gains
    dailyEarnings: Number(
      action?.daily_earnings ??
      action?.estimated_daily_bkc ??
      0
    ),
  }), [action]);

  // =========================
  // 🎨 COULEUR STATUT
  // =========================
  const statusColor = {
    disponible: "#16a34a",
    payé: "#16a34a",
    en_cours: "#facc15",
    à_reclamer: "#3b82f6",
    en_attente: "#9ca3af",
    terminé: "#ef4444"
  }[pack.status] || "#ef4444";

  // =========================
  // 🎯 LABEL BOUTON
  // =========================
  const getButtonLabel = () => {
    if (context === "available") {
      if (pack.status === "disponible") return "Contribuer";
      if (pack.status === "épuisé") return "Indisponible";
      return null;
    }

    if (pack.status === "payé") return "Start";
    if (pack.status === "en_cours") return "Voir les tâches";
    if (pack.status === "à_reclamer") return "Claim";
    if (pack.status === "en_attente") return "En attente ⏳";
    if (pack.status === "terminé") return "Terminé";
    return null;
  };

  const buttonLabel = getButtonLabel();

  const isButtonDisabled = () =>
    loading || ["terminé", "retiré", "épuisé", "en_attente"].includes(pack.status);

  // =========================
  // ⚙️ ACTIONS
  // =========================
  const handleClick = async () => {
    if (!user) {
      setMessage("⚠️ Vous devez être connecté pour agir.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      if (context === "available" && pack.status === "disponible") {
        await axiosInstance.post(`/actions/buy/${pack.id}`);
        setAction(prev => ({ ...prev, pack_status: "payé" }));
        setMessage(`✅ Achat du pack "${pack.name}" réussi !`);
      }

      else if (context === "owned" && pack.status === "payé") {
        await axiosInstance.post(`/actions/start/${pack.id}`);
        setAction(prev => ({ ...prev, pack_status: "en_cours" }));
        setMessage(`🚀 Pack "${pack.name}" démarré !`);
      }

      else if (context === "owned" && pack.status === "en_cours") {
        navigate(`/daily-tasks/${pack.id}`);
        return;
      }

      else if (context === "owned" && pack.status === "à_reclamer") {
        await axiosInstance.post(`/actions/claim/${pack.id}`);
        setMessage(`💰 Gains du pack "${pack.name}" réclamés avec succès !`);
      }

    } catch (error) {
      const msg =
        error.response?.data?.detail ||
        error.message ||
        "Erreur lors de l’action.";
      setMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🧱 RENDU
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
        <p>Catégorie : <span>{pack.category}</span></p>
        <p>Type : <span>{pack.type}</span></p>

        {context === "available" && (
          <>
            <p>Prix par part : <strong>{pack.price.toFixed(2)} USDT</strong></p>
            <p>Parts totales : <span>{pack.totalParts}</span></p>
          </>
        )}

        {/* 🔥 Gains visibles PARTOUT */}
        <p>
          Gains journaliers :{" "}
          <strong>{pack.dailyEarnings.toFixed(5)} $BKC</strong>
        </p>

        <p>
          Statut :{" "}
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
            {loading ? "⏳ En cours..." : buttonLabel}
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