import { useEffect, useState, useRef } from "react";
import { sendMessageToAI } from "../services/chatApi";
import {
  loadConversations,
  createConversation,
  updateConversation,
  getActiveId,
  setActiveId,
} from "./useConversations";

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveIdState] = useState(null);
  const activeIdRef = useRef(null);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  // Sauvegarde auto — seulement les messages terminés (pas isTyping)
  useEffect(() => {
    const finished = messages.filter((m) => !m.isTyping);
    if (activeIdRef.current && finished.length > 0) {
      updateConversation(activeIdRef.current, finished);
    }
  }, [messages]);

  const sendMessage = async (question) => {
    const text = question?.trim();
    if (!text || loading) return;

    let convId = activeIdRef.current;
    if (!convId) {
      const newConv = createConversation(text);
      convId = newConv.id;
      activeIdRef.current = convId;
      setActiveIdState(convId);
    }

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const data = await sendMessageToAI(text);
      const botMessage = {
        role: "bot",
        content: data?.answer || "❌ Réponse vide.",
        isTyping: true,   // ✅ flag pour déclencher l'animation
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: `❌ ${err.message}`, isTyping: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Appelé par MessageItem quand l'animation est terminée
  const markTypingDone = (index) => {
    setMessages((prev) =>
      prev.map((m, i) => (i === index ? { ...m, isTyping: false } : m))
    );
  };

  const loadConversation = (id) => {
    const convs = loadConversations();
    const conv = convs.find((c) => c.id === id);
    if (conv) {
      setMessages(conv.messages);
      activeIdRef.current = id;
      setActiveIdState(id);
      setActiveId(id);
    }
  };

  const newConversation = () => {
    setMessages([]);
    activeIdRef.current = null;
    setActiveIdState(null);
    setActiveId(null);
  };

  const clearMessages = () => {
    setMessages([]);
    if (activeIdRef.current) {
      updateConversation(activeIdRef.current, []);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    clearMessages,
    loadConversation,
    newConversation,
    activeId,
    markTypingDone,
  };
}