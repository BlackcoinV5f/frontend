import { useState, useEffect } from "react";
import { X, Moon, Sun, Trash2, Info, AlertTriangle, Plus, MessageSquare, ChevronRight } from "lucide-react";
import { loadConversations, deleteConversation } from "../hooks/useConversations";
import "../styles/settings.css";

export default function SettingsPanel({
  visible,
  onClose,
  darkMode,
  setDarkMode,
  fontSize,
  setFontSize,
  onClear,
  onLoadConversation,
  onNewConversation,
  activeId,
}) {
  const [confirmClear, setConfirmClear] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Recharger les conversations à chaque ouverture du panel
  useEffect(() => {
    if (visible) {
      setConversations(loadConversations());
    }
  }, [visible]);

  if (!visible) return null;

  const handleClear = () => {
    onClear();
    setConfirmClear(false);
  };

  const handleClose = () => {
    setConfirmClear(false);
    setConfirmDeleteId(null);
    onClose();
  };

  const handleLoadConv = (id) => {
    onLoadConversation(id);
    onClose();
  };

  const handleDeleteConv = (e, id) => {
    e.stopPropagation();
    deleteConversation(id);
    setConversations(loadConversations());
    if (id === activeId) onNewConversation();
    setConfirmDeleteId(null);
  };

  const handleNew = () => {
    onNewConversation();
    onClose();
  };

  const fontLabels = { sm: "Petit", md: "Moyen", lg: "Grand" };

  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  };

  return (
    <div className="settings-backdrop" onClick={handleClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="settings-header">
          <span>Paramètres</span>
          <button onClick={handleClose} aria-label="Fermer">
            <X size={16} />
          </button>
        </div>

        {/* THÈME */}
        <div className="settings-item">
          <span>Thème</span>
          <button
            className="settings-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Moon size={14} /> : <Sun size={14} />}
            <span>{darkMode ? "Sombre" : "Clair"}</span>
          </button>
        </div>

        {/* TAILLE TEXTE */}
        <div className="settings-item">
          <span>Taille texte</span>
          <div className="font-buttons">
            {Object.entries(fontLabels).map(([key, label]) => (
              <button
                key={key}
                className={fontSize === key ? "active" : ""}
                onClick={() => setFontSize(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* CONVERSATION ACTIVE — Vider */}
        <div className="settings-item settings-item--column">
          <div className="settings-item-row">
            <span>Conversation active</span>
            {!confirmClear && (
              <button
                className="settings-danger-btn"
                onClick={() => setConfirmClear(true)}
              >
                <Trash2 size={13} />
                <span>Vider</span>
              </button>
            )}
          </div>
          {confirmClear && (
            <div className="confirm-clear-box">
              <span className="confirm-text">
                <AlertTriangle size={12} style={{ verticalAlign: "middle", marginRight: 5, color: "#e05252" }} />
                Supprimer les messages ?
              </span>
              <div className="confirm-actions">
                <button className="confirm-btn confirm-btn--danger" onClick={handleClear}>
                  Confirmer
                </button>
                <button className="confirm-btn confirm-btn--cancel" onClick={() => setConfirmClear(false)}>
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>

        {/* HISTORIQUE DES CONVERSATIONS */}
        <div className="settings-section-title">
          <MessageSquare size={13} />
          <span>Historique</span>
          <button className="new-conv-btn" onClick={handleNew} title="Nouvelle conversation">
            <Plus size={14} />
          </button>
        </div>

        <div className="conv-list">
          {conversations.length === 0 ? (
            <p className="conv-empty">Aucune conversation</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`conv-item ${conv.id === activeId ? "conv-item--active" : ""}`}
                onClick={() => handleLoadConv(conv.id)}
              >
                <div className="conv-item-info">
                  <span className="conv-title">{conv.title}</span>
                  <span className="conv-date">{formatDate(conv.updatedAt)}</span>
                </div>

                {confirmDeleteId === conv.id ? (
                  <div className="conv-confirm-delete" onClick={(e) => e.stopPropagation()}>
                    <button className="confirm-btn confirm-btn--danger" onClick={(e) => handleDeleteConv(e, conv.id)}>
                      Supprimer
                    </button>
                    <button className="confirm-btn confirm-btn--cancel" onClick={() => setConfirmDeleteId(null)}>
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button
                    className="conv-delete-btn"
                    onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(conv.id); }}
                    title="Supprimer"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="settings-footer">
          <Info size={12} />
          <span>LineAI v1</span>
        </div>

      </div>
    </div>
  );
}