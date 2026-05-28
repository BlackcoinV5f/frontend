import { X, Moon, Sun, Trash2, Info } from "lucide-react";
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
  if (!visible) return null;

  return (
    <div className="settings-panel">

      <div className="settings-header">
        Paramètres
        <button onClick={onClose}><X size={16} /></button>
      </div>

      <div className="settings-item">
        <span>Thème</span>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Moon size={14} /> : <Sun size={14} />}
        </button>
      </div>

      <div className="settings-item">
        <span>Taille texte</span>

        <div className="font-buttons">
          {["sm", "md", "lg"].map((f) => (
            <button
              key={f}
              className={fontSize === f ? "active" : ""}
              onClick={() => setFontSize(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-item">
        <span>Conversation</span>
        <button onClick={onClear}>
          <Trash2 size={14} /> Vider
        </button>
      </div>

      <div className="settings-footer">
        <Info size={12} /> LineAI v1
      </div>

    </div>
  );
}
