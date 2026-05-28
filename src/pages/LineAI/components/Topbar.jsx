import { ArrowLeft, Sparkles, Settings } from "lucide-react";
import "../styles/topbar.css";

export default function Topbar({ onBack, onToggleSettings }) {
  return (
    <header className="lineai-topbar">

      <button className="lineai-topbar-btn" onClick={onBack}>
        <ArrowLeft size={18} />
        Retour
      </button>

      <div className="lineai-title">
        <Sparkles size={14} />
        LineAI
      </div>

      <button className="lineai-topbar-btn" onClick={onToggleSettings}>
        <Settings size={18} />
      </button>

    </header>
  );
}
