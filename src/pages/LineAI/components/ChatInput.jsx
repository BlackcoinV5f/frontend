import { Send, Loader2, Sparkles } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import "../styles/footer.css";
import "../styles/animations.css";

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState("");
  const ref = useRef(null);

  // ── Auto-resize à chaque changement de texte
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.height = "auto";                          // reset d'abord
    el.style.height = el.scrollHeight + "px";          // adapte au contenu
    el.style.overflowY = el.scrollHeight > 160 ? "auto" : "hidden";
  }, [text]);

  const handleSend = () => {
    if (!text.trim() || loading) return;
    onSend(text);
    setText("");

    // Reset hauteur après envoi
    if (ref.current) {
      ref.current.style.height = "36px";
      ref.current.style.overflowY = "hidden";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();   // pas de saut de ligne
      handleSend();
    }
    // Shift + Enter → saut de ligne normal
  };

  return (
    <footer className="chat-input">
      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        placeholder="Écris ton message..."
        rows={1}
      />
      <button onClick={handleSend} disabled={loading || !text.trim()}>
        {loading ? (
          <Loader2 className="spin" />
        ) : text.trim() ? (
          <Send />
        ) : (
          <Sparkles />
        )}
      </button>
    </footer>
  );
}