import React, { useEffect, useState } from "react";
import { useAdm } from "../contexts/AdmContext";
import "./Historic.css";

const Historic = () => {
  const { user, axiosDeposit } = useAdm();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const res = await axiosDeposit.get(`/history/${user.id}`);
        setHistory(res.data);
      } catch (err) {
        console.error("Erreur récupération historique:", err);
        setError("Impossible de charger l'historique des transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, axiosDeposit]);

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("approved") || statusLower.includes("approuvé")) {
      return <span className="status approved">✓ Approuvé</span>;
    } else if (statusLower.includes("rejected") || statusLower.includes("rejeté")) {
      return <span className="status rejected">✗ Rejeté</span>;
    } else if (statusLower.includes("pending") || statusLower.includes("attente")) {
      return <span className="status pending">⏳ En attente</span>;
    } else {
      return <span className="status unknown">{status || "Inconnu"}</span>;
    }
  };

  const getMethodIcon = (methodName) => {
    if (!methodName) return "💳";
    const name = methodName.toLowerCase();
    if (name.includes("mtn")) return "📱";
    if (name.includes("orange")) return "🟠";
    if (name.includes("moov")) return "🔵";
    if (name.includes("wave")) return "🌊";
    if (name.includes("card") || name.includes("carte")) return "💳";
    return "💳";
  };

  const formatDate = (value) => {
    if (!value) return "-";
    if (!isNaN(Date.parse(value))) {
      const dateObj = new Date(value);
      return dateObj.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return value;
  };

  if (loading) {
    return (
      <div className="historic-page">
        <h1 className="historic-title">HISTORIQUE</h1>
        <div className="historic-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Chargement de l'historique...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="historic-page">
        <h1 className="historic-title">HISTORIQUE</h1>
        <div className="historic-container">
          <div className="error-message">
            <span className="error-icon">⚠️</span> {error}
          </div>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="historic-page">
        <h1 className="historic-title">HISTORIQUE</h1>
        <div className="historic-container">
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>Aucune transaction trouvée</h3>
            <p>Vos transactions apparaîtront ici</p>
          </div>
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
              {history.map((transaction, index) => (
                <tr key={transaction.id || index}>
                  <td>
                    <span className="method-icon">{getMethodIcon(transaction.method_name)}</span>{" "}
                    {transaction.method_name || "Non spécifié"}
                  </td>
                  <td>
                    {transaction.amount} <span className="currency">$BKC</span>
                  </td>
                  <td>{getStatusBadge(transaction.status)}</td>
                  <td>{formatDate(transaction.created_at || transaction.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Historic;
