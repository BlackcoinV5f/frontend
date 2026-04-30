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

  const pack = useMemo(() => {
    return {
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
    };
  }, [action]);

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

  return (
    <div className="action-card">
      <img src={pack.image} alt={pack.name} />

      <h3>{pack.name ? t(`packs.${pack.name}`) : "—"}</h3>

      <p>{t("action.category")} : {t(`action.category_values.${pack.category}`)}</p>
      <p>{t("action.type")} : {t(`action.type_values.${pack.type}`)}</p>
      <p>{t("action.pricePerPart")} : {pack.price} USDT</p>
      <p>{t("action.dailyEarnings")} : {pack.dailyEarnings} BKC</p>

      <button onClick={handleBuy} disabled={loading}>
        {loading ? t("action.button.loading") : t("action.button.contribute")}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default ActionCard;