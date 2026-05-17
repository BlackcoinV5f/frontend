import React, { useEffect, useState, useRef } from "react";
import "./BlackAI.css";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const BASE_URL = import.meta.env.VITE_DEPOSIT_API_URL;
const API_URL = `${BASE_URL}/api/blackai`;

const BlackAI = () => {

  const navigate = useNavigate();
  const { user } = useUser();

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ─────────────────────────────
  // AUTO SCROLL
  // ─────────────────────────────
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ─────────────────────────────
  // SAVE MESSAGES TO CACHE (24h)
  // ─────────────────────────────
  useEffect(() => {
    if (messages.length === 0) return;

    const cache = {
      messages,
      savedAt: Date.now(),
    };

    localStorage.setItem("blackai_messages", JSON.stringify(cache));
  }, [messages]);

  // ─────────────────────────────
  // GREETING
  // ─────────────────────────────
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bonjour";
    if (h < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  // ─────────────────────────────
  // MESSAGE INITIAL + CACHE
  // ─────────────────────────────
  useEffect(() => {
    if (!user) return;

    const name =
      user?.username ||
      user?.name ||
      user?.firstName ||
      "Utilisateur";

    // Vérifier le cache localStorage
    const cached = localStorage.getItem("blackai_messages");

    if (cached) {
      try {
        const { messages: savedMessages, savedAt } = JSON.parse(cached);
        const heures24 = 24 * 60 * 60 * 1000;

        // Si moins de 24h → restaurer
        if (Date.now() - savedAt < heures24) {
          setMessages(savedMessages);
          return;
        } else {
          // Cache expiré → supprimer
          localStorage.removeItem("blackai_messages");
        }
      } catch {
        localStorage.removeItem("blackai_messages");
      }
    }

    // Aucun cache valide → message d'accueil
    setMessages([
      {
        id: Date.now(),
        sender: "ai",
        text:
          `${getGreeting()} **${name}** 👋\n\n` +
          `Je suis **Black AI**, votre assistant intelligent.\n\n` +
          `Comment puis-je vous aider aujourd'hui ?`,
      },
    ]);
  }, [user]);

  // ─────────────────────────────
  // STREAM TEXT EFFECT
  // ─────────────────────────────
  const streamAIResponse = async (fullText) => {
    const aiMessageId = Date.now();

    // Créer message vide
    setMessages((prev) => [
      ...prev,
      {
        id: aiMessageId,
        sender: "ai",
        text: "",
      },
    ]);

    // Écrire caractère par caractère
    for (let i = 0; i <= fullText.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 8));

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, text: fullText.slice(0, i) }
            : msg
        )
      );

      scrollToBottom();
    }
  };

  // ─────────────────────────────
  // API CALL
  // ─────────────────────────────
  const mutation = useMutation({
    mutationFn: async (question) => {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        throw new Error((await res.text()) || "Erreur serveur");
      }

      const data = await res.json();
      return data?.answer || "❌ Réponse vide";
    },

    onSuccess: async (aiText) => {
      // Supprimer les blocs HTML parasites
      const cleanText = aiText
        .replace(/```html[\s\S]*?```/gi, "")
        .replace(/<div[\s\S]*?>/gi, "")
        .replace(/<\/div>/gi, "");

      await streamAIResponse(cleanText);
    },

    onError: async () => {
      await streamAIResponse("❌ Une erreur est survenue. Veuillez réessayer.");
    },
  });

  // ─────────────────────────────
  // SEND MESSAGE
  // ─────────────────────────────
  const handleSend = () => {
    if (!inputValue.trim() || mutation.isPending) return;

    const userText = inputValue.trim();

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: userText,
      },
    ]);

    setInputValue("");

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    mutation.mutate(userText);
  };

  // ─────────────────────────────
  // ENTER KEY
  // ─────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ─────────────────────────────
  // AUTO HEIGHT INPUT
  // ─────────────────────────────
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  // ─────────────────────────────
  // EFFACER LE CACHE
  // ─────────────────────────────
  const handleClearCache = () => {
    localStorage.removeItem("blackai_messages");
    window.location.reload();
  };

  // ─────────────────────────────
  // MARKDOWN COMPONENTS
  // ─────────────────────────────
  const markdownComponents = {
    h1: ({ children }) => <h1>{children}</h1>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    ul: ({ children }) => <ul>{children}</ul>,
    ol: ({ children }) => <ol>{children}</ol>,
    li: ({ children }) => <li>{children}</li>,
    p: ({ children }) => <p>{children}</p>,
    strong: ({ children }) => <strong>{children}</strong>,
  };

  const userInitial =
    (user?.username || user?.name || "U")[0].toUpperCase();

  return (
    <div className="blackai-container">

      {/* HEADER */}
      <div className="chat-header">
        <div className="header-left">

          <button
            className="back-button"
            onClick={() =>
              window.history.length > 1
                ? navigate(-1)
                : navigate("/home")
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
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

          <div className="header-avatar">⚡</div>

          <div className="header-info">
            <h2>Black AI</h2>
            <span className="online-status">En ligne</span>
          </div>

        </div>

        <button
          className="settings-button"
          onClick={() => setShowSettings((p) => !p)}
        >
          ⚙️
        </button>
      </div>

      {/* SETTINGS */}
      {showSettings && (
        <div className="settings-menu">

          <div className="settings-item">
            🌙 Mode sombre
            <input type="checkbox" />
          </div>

          <div className="settings-item">
            🔔 Notifications
            <input type="checkbox" defaultChecked />
          </div>

          <div className="settings-item">
            🗑️ Effacer la conversation
            <button className="clear-button" onClick={handleClearCache}>
              Effacer
            </button>
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
          <div
            key={msg.id}
            className={`message-wrapper ${msg.sender}`}
          >
            {/* Avatar uniquement pour l'utilisateur */}
            {msg.sender !== "ai" && (
              <div className="message-avatar">{userInitial}</div>
            )}

            {/* Bulle */}
            <div className="message-bubble">
              <div className="message-text">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={markdownComponents}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>

          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="input-wrapper">
        <div className="input-container">

          <textarea
            ref={inputRef}
            placeholder="Écris ton message…"
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
            ✦
          </button>

        </div>

        <div className="input-hint">
          Entrée = envoyer · Shift+Entrée = ligne
        </div>
      </div>

    </div>
  );
};

export default BlackAI;
