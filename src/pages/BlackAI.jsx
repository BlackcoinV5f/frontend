import React, { useEffect, useState, useRef } from "react";
import "./BlackAI.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

// =========================
// 🔥 BACKEND URL (PROPRE)
// =========================
const BASE_URL = import.meta.env.VITE_DEPOSIT_API_URL;

if (!BASE_URL) {
  console.error("❌ VITE_DEPOSIT_API_URL manquant dans .env");
}

const API_URL = `${BASE_URL}/api/blackai`;

// =========================

const BlackAI = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ✅ Scroll auto
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  // ✅ Welcome message
  useEffect(() => {
    if (!user) return;

    const userName =
      user?.username ||
      user?.name ||
      user?.firstName ||
      "Utilisateur";

    setMessages([
      {
        id: Date.now(),
        sender: "ai",
        text: `👋 ${getGreeting()} ${userName}, je suis BlackAI. Comment puis-je vous assister ?`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, [user]);

  // =========================
  // 🔥 API CALL
  // =========================
  const mutation = useMutation({
    mutationFn: async (question) => {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Erreur serveur");
      }

      const data = await res.json();
      return data?.answer || "❌ Réponse vide";
    },

    onSuccess: (aiText) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "ai",
          text: aiText,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    },

    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "ai",
          text: "❌ Erreur serveur",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    },
  });

  // =========================
  // ✉️ SEND MESSAGE
  // =========================
  const handleSend = () => {
    if (!inputValue.trim() || mutation.isPending) return;

    const userText = inputValue.trim();

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: userText,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    setInputValue("");
    if (inputRef.current) inputRef.current.style.height = "auto";

    mutation.mutate(userText);
  };

  // Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // textarea resize
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  // markdown cleanup
  const cleanMarkdown = (text) => {
    return text
      .replace(/\n\s*\n\s*\n/g, "\n\n")
      .replace(/[ \t]+$/gm, "")
      .replace(/([.!?])\n\n/g, "$1\n");
  };

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div className="blackai-container">

      {/* HEADER */}
      <div className="chat-header">
        <div className="header-left">

          <button
            className="back-button"
            onClick={() => {
              if (window.history.length > 1) navigate(-1);
              else navigate("/home");
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M15 18l-6-6 6-6"
                stroke="white"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="ai-icon">🤖</div>

          <div className="header-info">
            <h2>Black AI</h2>
            <span className="online-status">● En ligne</span>
          </div>
        </div>

        <button
          className="settings-button"
          onClick={() => setShowSettings((prev) => !prev)}
        >
          ⚙️
        </button>
      </div>

      {/* SETTINGS */}
      {showSettings && (
        <div className="settings-menu">
          <div className="settings-item">
            🌙 Mode sombre <input type="checkbox" />
          </div>

          <div className="settings-item">
            🔔 Notifications <input type="checkbox" defaultChecked />
          </div>

          <button
            className="settings-close"
            onClick={() => setShowSettings(false)}
          >
            Fermer
          </button>
        </div>
      )}

      {/* MESSAGES */}
      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
            <div className="message-avatar">
              {msg.sender === "ai" ? "🤖" : "👤"}
            </div>

            <div className="message-bubble fade-in">
              <div className="message-text">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {cleanMarkdown(msg.text)}
                </ReactMarkdown>
              </div>

              <div className="message-time">{msg.timestamp}</div>
            </div>
          </div>
        ))}

        {/* typing */}
        {mutation.isPending && (
          <div className="message-wrapper ai">
            <div className="message-avatar">🤖</div>
            <div className="message-bubble">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="input-wrapper">
        <div className="input-container">
          <textarea
            ref={inputRef}
            placeholder="Écris ton message..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
            className="message-input"
          />

          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || mutation.isPending}
            className={`send-button ${
              !inputValue.trim() || mutation.isPending ? "disabled" : ""
            }`}
          >
            ✨
          </button>
        </div>

        <div className="input-hint">
          Entrée = envoyer • Shift+Entrée = ligne
        </div>
      </div>
    </div>
  );
};

export default BlackAI;