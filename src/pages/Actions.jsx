import React, { useState } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import ActionCard from "../components/ActionCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { useTranslation } from "react-i18next";
import { useActions } from "../hooks/useActions";
import "./Actions.css";

import { DollarSign, Building2, Sparkles, User2 } from "lucide-react";

const Actions = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("finance");
  const { user } = useUser();

  const { data: actions = [], isLoading, refresh } = useActions(activeTab);

  const categories = [
    { id: "finance", label: t("actions.category.finance"), icon: <DollarSign size={18} /> },
    { id: "immobilier", label: t("actions.category.realEstate"), icon: <Building2 size={18} /> },
    { id: "opportunite", label: t("actions.category.opportunities"), icon: <Sparkles size={18} /> },
    { id: "myactif", label: t("actions.category.myAssets"), icon: <User2 size={18} /> },
  ];

  const cardContext = activeTab === "myactif" ? "owned" : "available";

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="actions-page">
      {/* catégories */}
      <div className="categories-bar">
        {categories.map(({ id, label, icon }) => (
          <button
            key={id}
            className={`category-btn ${activeTab === id ? "active" : ""}`}
            onClick={() => setActiveTab(id)}
          >
            <span className="icon">{icon}</span>
            <span>{label}</span>
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
                  status: action.status || "disponible",
                  pack_status: action.pack_status || action.status,
                }}
                context={cardContext}
                onActionComplete={refresh} // ✅ FIX IMPORTANT
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Actions;