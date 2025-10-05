// src/pages/Actions.jsx
import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import ActionCard from "../components/ActionCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import "./Actions.css";

// ✅ Lucide icons
import { DollarSign, Building2, Sparkles, User2 } from "lucide-react";

const categories = [
  { id: "finance", label: "Finance", icon: <DollarSign size={18} /> },
  { id: "immobilier", label: "Real Estate", icon: <Building2 size={18} /> },
  { id: "opportunite", label: "Opportunities", icon: <Sparkles size={18} /> },
  { id: "myactif", label: "My Assets", icon: <User2 size={18} /> },
];

const Actions = () => {
  const [activeTab, setActiveTab] = useState("finance");
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { axiosInstance, user } = useUser();

  // 🔹 Fonction de récupération des actions
  const fetchActions = async () => {
    setLoading(true);
    try {
      let response;
      if (activeTab === "myactif") {
        // 🔹 Actions de l'utilisateur
        response = await axiosInstance.get("/actions/me");
      } else {
        // 🔹 Actions par catégorie
        response = await axiosInstance.get(`/actions/category/${activeTab}`);
      }
      setActions(response.data || []);
    } catch (error) {
      console.error("❌ Error loading actions:", error);
      setActions([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Récupération à chaque changement de tab ou utilisateur
  useEffect(() => {
    fetchActions();
  }, [activeTab, user]);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="actions-page">
      {/* ✅ Barre de catégories */}
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

      {/* ✅ Contenu principal */}
      <div className="actions-content">
        {actions.length === 0 ? (
          <p className="no-actions">No actions available</p>
        ) : (
          <div className="actions-grid">
            {actions.map((action) => (
              <ActionCard key={action.id} action={action} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Actions;
