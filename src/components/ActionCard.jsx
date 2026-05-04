import React, { useState, useMemo } from "react";
import { useUser } from "../contexts/UserContext";
import { useTranslation } from "react-i18next";
import { useActionMutations } from "../hooks/useActionMutations";
import "./ActionCard.css";

const ActionCard = ({ action: rawAction }) => {
  const { user } = useUser();
  const { t } = useTranslation("premium");
  const { buy } = useActionMutations();
  const [action, setAction] = useState(rawAction);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const pack = useMemo(() => ({
    id: action?.id,
    name: action?.name,
    category: action?.category || "finance",
    type: action?.type || "individual",
    image: action?.image_url || "/images/default_pack.png",
    price: Number(action?.price_usdt || 0),
    totalParts: action?.total_parts || 0,
    status: action?.status || "available",
    dailyEarnings: Number(
      action?.daily_earnings ?? action?.estimated_daily_bkc ?? 0
    ),
  }), [action]);

  const handleBuy = async () => {
    if (!user) {
      setMessage(t("action.feedback.mustLogin"));
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await buy.mutateAsync(pack.id);
      setAction((prev) => ({ ...prev, status: "paid" }));
      setMessage(
        t("action.feedback.buySuccess", {
          name: pack.name ? t(`packs.${pack.name}`) : "",
        })
      );
    } catch (error) {
      setMessage(
        error.response?.data?.detail || t("action.feedback.error")
      );
    } finally {
      setLoading(false);
    }
  };

  const packName = pack.name ? t(`packs.${pack.name}`) : "—";

  return (
    <div className="action-card">

      {/* ── HEADER : logo gauche + nom ── */}
      <div className="card-header">
        <div className="icon-container">
          <img src={pack.image} alt={packName} className="pack-icon" />
        </div>
        <span className="action-name">{packName}</span>
      </div>

      {/* ── BODY : label | valeur ── */}
      <div className="card-body">
        <p>
          <span>{t("action.category")} :</span>
          <span className="value-neutral">
            {t(`action.category_values.${pack.category}`)}
          </span>
        </p>
        <p>
          <span>{t("action.type")} :</span>
          <span className="value-neutral">
            {t(`action.type_values.${pack.type}`)}
          </span>
        </p>
        <p>
          <span>{t("action.pricePerPart")} :</span>
          <strong>{pack.price} USDT</strong>
        </p>
        <p>
          <span>{t("action.dailyEarnings")} :</span>
          <strong>{pack.dailyEarnings} BKC</strong>
        </p>
      </div>

      {/* ── FOOTER : bouton ── */}
      <div className="card-footer">
        <button
          className="contribute-btn"
          onClick={handleBuy}
          disabled={loading}
        >
          {loading ? t("action.button.loading") : t("action.button.contribute")}
        </button>
      </div>

      {message && <p className="feedback">{message}</p>}
    </div>
  );
};

export default ActionCard;
