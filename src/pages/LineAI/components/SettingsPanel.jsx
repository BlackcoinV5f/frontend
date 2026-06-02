import { useState } from "react";
import { X, Moon, Sun, Trash2, Info, AlertTriangle } from "lucide-react";
import "../styles/settings.css";

export default function SettingsPanel({
  visible,
  onClose,
  darkMode,
  setDarkMode,
  fontSize,
  setFontSize,
  onClear,
}) {
  const [confirmClear, setConfirmClear] = useState(false);

  if (!visible) return null;

  const handleClear = () => {
    onClear();
    setConfirmClear(false);
    onClose();
  };

  const handleClose = () => {
    setConfirmClear(false);
    onClose();
  };

  const fontLabels = { sm: "Petit", md: "Moyen", lg: "Grand" };

  return (
    // Backdrop : clic extérieur ferme le panel
    <div className="settings-backdrop" onClick={handleClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="settings-header">
          <span>Paramètres</span>
          <button onClick={handleClose} aria-label="Fermer les paramètres">
            <X size={16} />
          </button>
        </div>

        {/* THÈME — avec label textuel Clair / Sombre */}
        <div className="settings-item">
          <span>Thème</span>
          <button
            className="settings-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            {darkMode ? <Moon size={14} /> : <Sun size={14} />}
            <span>{darkMode ? "Sombre" : "Clair"}</span>
          </button>
        </div>

        {/* TAILLE TEXTE — Petit / Moyen / Grand */}
        <div className="settings-item">
          <span>Taille texte</span>
          <div className="font-buttons">
            {Object.entries(fontLabels).map(([key, label]) => (
              <button
                key={key}
                className={fontSize === key ? "active" : ""}
                onClick={() => setFontSize(key)}
                aria-pressed={fontSize === key}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* CONVERSATION — Vider avec confirmation */}
        <div className="settings-item settings-item--column">
          <div className="settings-item-row">
            <span>Conversation</span>
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
                Supprimer tous les messages ?
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

        {/* FOOTER */}
        <div className="settings-footer">
          <Info size={12} />
          <span>LineAI v1</span>
        </div>

      </div>
    </div>
  );
}
