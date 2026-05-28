import { Send, Loader2, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import useTextareaResize from "../hooks/useTextareaResize";
import "../styles/footer.css";
import "../styles/animations.css";

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState("");
  const ref = useRef(null);

  useTextareaResize(ref, text);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <footer className="chat-input">

      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
        placeholder="Écris ton message..."
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
