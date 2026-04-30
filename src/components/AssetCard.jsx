import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useActionMutations } from "../hooks/useActionMutations";
import "./AssetCard.css";

const AssetCard = ({ asset }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("premium");

  const { start, claim } = useActionMutations();
  const [loading, setLoading] = useState(false);

  const status = asset.status?.toLowerCase();

  const canStart = status === "payé" || status === "paid";
  const canOpenTasks =
    status === "en_cours" || status === "in_progress";
  const canClaim = status === "claimable";

  const isDisabled =
    loading || !(canStart || canOpenTasks || canClaim);

  const getButtonClass = () => {
    if (canStart) return "contribute-btn start";
    if (canClaim) return "contribute-btn claim";
    return "contribute-btn";
  };

  const handleClick = async () => {
    try {
      setLoading(true);

      if (canStart) {
        await start.mutateAsync(asset.id);
      } else if (canOpenTasks) {
        navigate(`/daily-tasks/${asset.id}`);
        return;
      } else if (canClaim) {
        await claim.mutateAsync(asset.id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getLabel = () => {
    if (canStart) return t("action.button.start");
    if (canOpenTasks) return t("action.button.viewTasks");
    if (canClaim) return t("action.button.claim");
    if (status === "completed") return t("action.button.completed");
    return "";
  };

  return (
    <div className="action-card">
      <div className="card-header">
        <div className="icon-container">
          <img src={asset.image_url} alt="" className="pack-icon" />
        </div>
        <div className="action-name">{asset.name}</div>
      </div>

      <div className="card-body">
        <p><span>Catégorie :</span> {asset.category}</p>
        <p><span>Investi :</span> <strong>{asset.total_invested_usdt} USDT</strong></p>
        <p><span>Gains journaliers :</span> <strong>{asset.daily_earnings_bkc} BKC</strong></p>
      </div>

      <div className="card-footer">
        <button
          onClick={handleClick}
          disabled={isDisabled}
          className={getButtonClass()}
        >
          {loading ? t("action.button.loading") : getLabel()}
        </button>
      </div>
    </div>
  );
};

export default AssetCard;