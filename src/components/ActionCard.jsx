// ✅ ActionCard.jsx
import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import "./ActionCard.css";

const ActionCard = ({ action: initialAction, context = "available" }) => {
  const { user, axiosInstance } = useUser();
  const navigate = useNavigate();

  const [action, setAction] = useState(initialAction);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // ✅ Image (avec fallback)
  const imagePath = action?.image_url || "/images/default_pack.png";

  // ✅ Statut du pack
  const userPackStatus =
    action?.pack_status || action?.status || "disponible";

  // ✅ Prix formaté
  const priceDisplay = action?.value_bkc
    ? `${action.value_bkc} $BKC`
    : `${Number(action?.price_per_part || 0).toFixed(2)} $BKC`;

  // ✅ Couleur du statut
  const statusColor =
    userPackStatus === "disponible" || userPackStatus === "payé"
      ? "#16a34a"
      : userPackStatus === "en_cours"
      ? "#facc15"
      : userPackStatus === "à_reclamer"
      ? "#3b82f6"
      : userPackStatus === "en_attente"
      ? "#9ca3af"
      : "#ef4444";

  // =========================
  // 🎯 Libellé du bouton
  // =========================
  const getButtonLabel = () => {
    if (context === "available") {
      if (userPackStatus === "disponible") return "Contribuer";
      if (userPackStatus === "épuisé") return "Indisponible";
      return null;
    }

    // Pour les packs achetés (My Assets)
    if (userPackStatus === "payé") return "Start";
    if (userPackStatus === "en_cours") return "Voir les tâches";
    if (userPackStatus === "à_reclamer") return "Claim";
    if (userPackStatus === "en_attente") return "En attente ⏳";
    if (userPackStatus === "terminé") return "Terminé";
    return null;
  };

  // =========================
  // 🔒 Désactivation du bouton
  // =========================
  const isButtonDisabled = () => {
    if (loading) return true;
    return ["terminé", "retiré", "épuisé", "en_attente"].includes(userPackStatus);
  };

  // =========================
  // ⚙️ Gestion du clic
  // =========================
  const handleClick = async () => {
    if (!user) {
      setMessage("⚠️ Vous devez être connecté pour agir.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      let response;

      // 💰 Achat d’un pack (Finance / Real Estate / Opportunities)
      if (context === "available" && userPackStatus === "disponible") {
        response = await axiosInstance.post(`/actions/buy/${action.id}`);
        setAction((prev) => ({ ...prev, pack_status: "payé" }));
        setMessage(`✅ Achat du pack "${action.name}" réussi !`);
      }

      // 🚀 Démarrage du pack (My Assets)
      else if (context === "owned" && userPackStatus === "payé") {
        response = await axiosInstance.post(`/actions/start/${action.id}`);
        setAction((prev) => ({ ...prev, pack_status: "en_cours" }));
        setMessage(`🚀 Pack "${action.name}" démarré !`);
      }

      // 📋 Voir les tâches journalières
      else if (context === "owned" && userPackStatus === "en_cours") {
        navigate(`/daily-tasks/${action.id}`);
        return;
      }

      // 💰 Réclamer les gains journaliers
      else if (context === "owned" && userPackStatus === "à_reclamer") {
        response = await axiosInstance.post(`/actions/claim/${action.id}`);
        setMessage(`💰 Gains du pack "${action.name}" réclamés avec succès !`);
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

  const buttonLabel = getButtonLabel();

  // =========================
  // 🧱 Rendu visuel
  // =========================
  return (
    <div className="action-card">
      {/* 🟩 En-tête */}
      <div className="card-header">
        <div className="icon-container">
          <img
            src={imagePath}
            alt={action?.name || "Pack"}
            className="pack-icon"
            onError={(e) => {
              if (!e.target.dataset.fallback) {
                e.target.dataset.fallback = "true";
                e.target.src = "/images/default_pack.png";
              }
            }}
          />
        </div>
        <h3 className="action-name">{action?.name || "Pack sans nom"}</h3>
      </div>

      {/* 🟨 Corps */}
      <div className="card-body">
        <p>Catégorie : <span>{action?.category || "—"}</span></p>
        <p>Type : <span>{action?.type || "—"}</span></p>

        {context === "available" && (
          <>
            <p>Prix par part : <strong>{priceDisplay}</strong></p>
            <p>Parts totales : <span>{action?.total_parts || "—"}</span></p>
          </>
        )}

        {context === "owned" && (
          <>
            <p>
              Gains journaliers :{" "}
              <strong>
                {action?.daily_earnings
                  ? `${action.daily_earnings.toFixed(5)} $BKC`
                  : "0 $BKC"}
              </strong>
            </p>
          </>
        )}

        <p>
          Statut :{" "}
          <span style={{ color: statusColor, fontWeight: "bold" }}>
            {userPackStatus}
          </span>
        </p>
      </div>

      {/* 🟦 Pied de carte */}
      <div className="card-footer">
        {buttonLabel && (
          <button
            className={`contribute-btn ${
              userPackStatus === "à_reclamer"
                ? "claim"
                : userPackStatus === "payé"
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
              color:
                message.startsWith("✅") ||
                message.startsWith("🚀") ||
                message.startsWith("💰")
                  ? "#16a34a"
                  : "#ef4444",
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
