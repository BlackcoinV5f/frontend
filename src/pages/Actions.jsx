// src/pages/Actions.jsx
import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import ActionCard from "../components/ActionCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import "./Actions.css";

// ✅ Icônes Lucide
import { DollarSign, Building2, Sparkles, User2 } from "lucide-react";

// ✅ Liste des catégories d’actions/packs
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

  // 🔹 Récupération des actions depuis l’API
  const fetchActions = async () => {
    setLoading(true);
    try {
      let response;

      if (activeTab === "myactif") {
        // 🔸 Récupère uniquement les packs achetés par l'utilisateur
        response = await axiosInstance.get("/actions/my-packs");
      } else {
        // 🔸 Récupère les packs disponibles selon la catégorie
        response = await axiosInstance.get(`/actions/category/${activeTab}`);
      }

      setActions(response.data || []);
    } catch (error) {
      console.error("❌ Erreur lors du chargement des actions :", error);
      setActions([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Actualiser à chaque changement d’onglet ou d’utilisateur
  useEffect(() => {
    fetchActions();
  }, [activeTab, user]);

  if (loading) return <LoadingSpinner fullScreen />;

  // ✅ Détermine le contexte à passer au composant ActionCard
  const cardContext = activeTab === "myactif" ? "owned" : "available";

  return (
    <div className="actions-page">
      {/* ✅ Barre de navigation entre catégories */}
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
          <p className="no-actions">Aucune action disponible</p>
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
                context={cardContext} // 🔥 ici on passe le bon mode à la carte
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Actions;
