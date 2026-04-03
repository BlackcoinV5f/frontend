import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import ActionCard from "../components/ActionCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { useTranslation } from "react-i18next";
import "./Actions.css";

// Icônes Lucide
import { DollarSign, Building2, Sparkles, User2 } from "lucide-react";

const Actions = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("finance");
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axiosInstance, user } = useUser();

  const categories = [
    { id: "finance", label: t("actions.category.finance"), icon: <DollarSign size={18} /> },
    { id: "immobilier", label: t("actions.category.realEstate"), icon: <Building2 size={18} /> },
    { id: "opportunite", label: t("actions.category.opportunities"), icon: <Sparkles size={18} /> },
    { id: "myactif", label: t("actions.category.myAssets"), icon: <User2 size={18} /> },
  ];

  const fetchActions = async () => {
    setLoading(true);
    try {
      let response;
      if (activeTab === "myactif") {
        response = await axiosInstance.get("/actions/my-packs");
      } else {
        response = await axiosInstance.get(`/actions/category/${activeTab}`);
      }
      setActions(response.data || []);
    } catch (error) {
      console.error(t("actions.fetchError"), error);
      setActions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, [activeTab, user]);

  if (loading) return <LoadingSpinner fullScreen />;

  const cardContext = activeTab === "myactif" ? "owned" : "available";

  return (
    <div className="actions-page">
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Actions;