import React from "react";
import { useAdm } from "../contexts/AdmContext";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import "./Historic.css";

export default function Historic() {
  // ✅ namespace correct
  const { t, i18n } = useTranslation("transactions");
  const { user, axiosDeposit } = useAdm();

  const { data: history = [], isLoading, isError } = useQuery({
    queryKey: ["history", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await axiosDeposit.get(`/history/${user.id}`);
      return res.data;
    },
    enabled: !!user?.id,
  });

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();

    if (s.includes("approved") || s.includes("approuvé"))
      return <span className="status approved">✓ {t("history.status.approved")}</span>;

    if (s.includes("rejected") || s.includes("rejeté"))
      return <span className="status rejected">✗ {t("history.status.rejected")}</span>;

    if (s.includes("pending") || s.includes("attente"))
      return <span className="status pending">⏳ {t("history.status.pending")}</span>;

    return <span className="status unknown">{status || t("history.status.unknown")}</span>;
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
    return !isNaN(d)
      ? d.toLocaleString(i18n.language.split("-")[0], {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : value;
  };

  if (isLoading) {
    return (
      <div className="historic-page">
        <h1 className="historic-title">{t("history.title")}</h1>
        <div className="historic-container loading-state">
          <div className="loading-spinner"></div>
          <p>{t("history.loading")}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="historic-page">
        <h1 className="historic-title">{t("history.title")}</h1>
        <div className="historic-container error-message">
          ⚠️ {t("history.error")}
        </div>
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="historic-page">
        <h1 className="historic-title">{t("history.title")}</h1>
        <div className="historic-container empty-state">
          <div className="empty-icon">📊</div>
          <h3>{t("history.empty.title")}</h3>
          <p>{t("history.empty.text")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="historic-page">
      <h1 className="historic-title">{t("history.title")}</h1>

      <div className="historic-container">
        <div className="historic-summary">
          <span className="transaction-count">
            {t("history.count", { count: history.length })}
          </span>
        </div>

        <div className="table-container">
          <table className="historic-table">
            <thead>
              <tr>
                <th>{t("history.table.method")}</th>
                <th>{t("history.table.amount")}</th>
                <th>{t("history.table.status")}</th>
                <th>{t("history.table.date")}</th>
              </tr>
            </thead>
            <tbody>
              {history.map((tItem, i) => (
                <tr key={tItem.id || i}>
                  <td>
                    <span className="method-icon">
                      {getMethodIcon(tItem.method_name)}
                    </span>{" "}
                    {tItem.method_name || t("history.notSpecified")}
                  </td>

                  <td>
                    {tItem.amount} <span className="currency">BKC</span>
                  </td>

                  <td>{getStatusBadge(tItem.status)}</td>

                  <td>{formatDate(tItem.created_at || tItem.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}