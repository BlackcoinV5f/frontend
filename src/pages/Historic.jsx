// src/pages/Historic.jsx
import React from "react";
import { useAdm } from "../contexts/AdmContext";
import { useQuery } from "@tanstack/react-query";
import "./Historic.css";

export default function Historic() {
  const { user, axiosDeposit } = useAdm();

  const { data: history = [], isLoading, isError } = useQuery({
    queryKey: ["history", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await axiosDeposit.get(`/history/${user.id}`);
      return res.data;
    },
    enabled: !!user?.id,
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("approved") || s.includes("approuvé")) return <span className="status approved">✓ Approuvé</span>;
    if (s.includes("rejected") || s.includes("rejeté")) return <span className="status rejected">✗ Rejeté</span>;
    if (s.includes("pending") || s.includes("attente")) return <span className="status pending">⏳ En attente</span>;
    return <span className="status unknown">{status || "Inconnu"}</span>;
  };

  const getMethodIcon = (name) => {
    if (!name) return "💳";
    const n = name.toLowerCase();
    if (n.includes("mtn")) return "📱";
    if (n.includes("orange")) return "🟠";
    if (n.includes("moov")) return "🔵";
    if (n.includes("wave")) return "🌊";
    if (n.includes("card") || n.includes("carte")) return "💳";
    return "💳";
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    return !isNaN(d) ? d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) : value;
  };

  if (isLoading) {
    return (
      <div className="historic-page">
        <h1 className="historic-title">HISTORIQUE</h1>
        <div className="historic-container loading-state">
          <div className="loading-spinner"></div>
          <p>Chargement de l'historique...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="historic-page">
        <h1 className="historic-title">HISTORIQUE</h1>
        <div className="historic-container error-message">
          <span className="error-icon">⚠️</span> Impossible de charger l'historique des transactions
        </div>
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="historic-page">
        <h1 className="historic-title">HISTORIQUE</h1>
        <div className="historic-container empty-state">
          <div className="empty-icon">📊</div>
          <h3>Aucune transaction trouvée</h3>
          <p>Vos transactions apparaîtront ici</p>
        </div>
      </div>
    );
  }

  return (
    <div className="historic-page">
      <h1 className="historic-title">HISTORIQUE</h1>

      <div className="historic-container">
        <div className="historic-summary">
          <span className="transaction-count">
            {history.length} transaction{history.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="table-container">
          <table className="historic-table">
            <thead>
              <tr>
                <th>Méthode</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((t, i) => (
                <tr key={t.id || i}>
                  <td>
                    <span className="method-icon">{getMethodIcon(t.method_name)}</span>{" "}
                    {t.method_name || "Non spécifié"}
                  </td>
                  <td>{t.amount} <span className="currency">$BKC</span></td>
                  <td>{getStatusBadge(t.status)}</td>
                  <td>{formatDate(t.created_at || t.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}