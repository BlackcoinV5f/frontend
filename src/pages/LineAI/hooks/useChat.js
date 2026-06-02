import { useEffect, useState } from "react";
import { sendMessageToAI } from "../services/chatApi";

const STORAGE_KEY = "lineai_chat";

export default function useChat() {

  // IMPORTANT :
  // charger directement depuis localStorage
  // dans useState

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) return [];

      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);

  /* =========================
     SAVE AUTO
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(messages)
    );
  }, [messages]);

  /* =========================
     SEND MESSAGE
  ========================= */

  const sendMessage = async (question) => {

    const text = question?.trim();

    if (!text || loading) return;

    const userMessage = {
      role: "user",
      content: text,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setLoading(true);

    try {

      const data =
        await sendMessageToAI(text);

      const botMessage = {
        role: "bot",
        content:
          data?.answer ||
          "❌ Réponse vide.",
      };

      setMessages((prev) => [
        ...prev,
        botMessage,
      ]);

    } catch (err) {

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            `❌ ${err.message}`,
        },
      ]);

    } finally {
      setLoading(false);
    }
  };

  /* =========================
     CLEAR
  ========================= */

  const clearMessages = () => {

    setMessages([]);

    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    messages,
    loading,
    sendMessage,
    clearMessages,
  };
}