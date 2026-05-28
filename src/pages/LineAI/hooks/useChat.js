import { useState } from "react";
import { sendMessageToAI } from "../services/chatApi";

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (question) => {
    const text = question.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const data = await sendMessageToAI(text);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: data.answer || "❌ Réponse vide.",
          source: data.source,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: `❌ Erreur serveur\n\n_${err.message}_`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => setMessages([]);

  return {
    messages,
    loading,
    sendMessage,
    clearMessages,
  };
}