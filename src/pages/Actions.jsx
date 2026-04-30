import React, { useState } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import ActionCard from "../components/ActionCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { useTranslation } from "react-i18next";
import { useActions } from "../hooks/useActions";
import { useNavigate } from "react-router-dom";
import "./Actions.css";

import { DollarSign, Building2, Sparkles, User2 } from "lucide-react";

const Actions = () => {
  const { t } = useTranslation("premium");
  const [activeTab, setActiveTab] = useState("finance");
  const { user } = useUser();
  const navigate = useNavigate();

  const isMyAssets = activeTab === "myAssets";

  const {
    data: actions = [],
    isLoading,
    refresh,
  } = useActions(isMyAssets ? null : activeTab);

  const categories = [
    { id: "finance", icon: <DollarSign size={18} /> },
    { id: "real_estate", icon: <Building2 size={18} /> },
    { id: "opportunity", icon: <Sparkles size={18} /> },
    { id: "myAssets", icon: <User2 size={18} /> },
  ];

  const cardContext = "available";

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="actions-page">
      {/* catégories */}
      <div className="categories-bar">
        {categories.map(({ id, icon }) => (
          <button
            key={id}
            className={`category-btn ${activeTab === id ? "active" : ""}`}
            onClick={() => {
              if (id === "myAssets") {
                navigate("/my-assets");
              } else {
                setActiveTab(id);
              }
            }}
          >
            <span className="icon">{icon}</span>
            <span>{t(`actions.category.${id}`)}</span>
          </button>
        ))}
      </div>

      {/* contenu */}
      <div className="actions-content">
        {actions.length === 0 ? (
          <p className="no-actions">{t("actions.noActions")}</p>
        ) : (
          <div className="actions-grid">
            {actions.map((action) => (
              <ActionCard
                key={action.id}
                action={{
                  ...action,
                  status: action.status || t("actions.status.available"),
                  pack_status: action.pack_status || action.status,
                }}
                context={cardContext}
                onActionComplete={refresh}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Actions;