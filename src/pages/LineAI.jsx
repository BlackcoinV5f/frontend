// src/pages/LineAI.jsx

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles, Send, Loader2,
  ArrowLeft, Settings, X, Trash2,
  Moon, Sun, Info
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import "./LineAI.css";

const BASE_URL = import.meta.env.VITE_DEPOSIT_API_URL;
const API_URL = `${BASE_URL}/api/blackai`;

const LineAI = ({ onBack }) => {
  const [message, setMessage]     = useState("");
  const [messages, setMessages]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode]   = useState(true);
  const [fontSize, setFontSize]   = useState("md");

  const textareaRef = useRef(null);
  const bottomRef   = useRef(null);
  const settingsRef = useRef(null);

  /* ---------- resize textarea ---------- */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [message]);

  /* ---------- scroll to bottom ---------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ---------- close settings on outside click ---------- */
  useEffect(() => {
    const handler = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------- send ---------- */
  const sendMessage = async () => {
    const question = message.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: data.answer || "❌ Réponse vide.", source: data.source },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: `❌ Impossible de joindre le serveur.\n\n_${err.message}_`, source: "error" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setShowSettings(false);
  };

  const fontClass = `font-${fontSize}`;

  return (
    <div className={`lineai-root ${darkMode ? "dark" : "light"} ${fontClass}`}>

      {/* ===================== TOPBAR ===================== */}
      <header className="lineai-topbar">

        {/* Bouton retour */}
        <button
          className="lineai-topbar-btn lineai-back-btn"
          onClick={onBack || (() => window.history.back())}
          aria-label="Retour"
        >
          <ArrowLeft size={20} />
          <span>Retour</span>
        </button>

        {/* Titre centré */}
        <div className="lineai-topbar-title">
          <Sparkles size={16} className="lineai-title-icon" />
          <span>LineAI</span>
        </div>

        {/* Paramètres */}
        <div className="lineai-settings-wrapper" ref={settingsRef}>
          <button
            className="lineai-topbar-btn lineai-settings-btn"
            onClick={() => setShowSettings((v) => !v)}
            aria-label="Paramètres"
          >
            <Settings size={20} />
          </button>

          {showSettings && (
            <div className="lineai-settings-panel">
              <div className="lineai-settings-header">
                <span>Paramètres</span>
                <button onClick={() => setShowSettings(false)}><X size={16} /></button>
              </div>

              {/* Thème */}
              <div className="lineai-settings-item">
                <span>Thème</span>
                <button
                  className="lineai-toggle"
                  onClick={() => setDarkMode((v) => !v)}
                >
                  {darkMode ? <><Moon size={14}/> Sombre</> : <><Sun size={14}/> Clair</>}
                </button>
              </div>

              {/* Taille texte */}
              <div className="lineai-settings-item">
                <span>Taille texte</span>
                <div className="lineai-font-btns">
                  {["sm", "md", "lg"].map((s) => (
                    <button
                      key={s}
                      className={`lineai-font-btn ${fontSize === s ? "active" : ""}`}
                      onClick={() => setFontSize(s)}
                    >
                      {s === "sm" ? "A" : s === "md" ? "A" : "A"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vider */}
              <div className="lineai-settings-item">
                <span>Conversation</span>
                <button className="lineai-danger-btn" onClick={clearConversation}>
                  <Trash2 size={14} /> Vider
                </button>
              </div>

              {/* Info */}
              <div className="lineai-settings-footer">
                <Info size={12} /> LineAI v1.0 · Powered by BlackAI
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ===================== BODY ===================== */}
      <main className="lineai-body">

        {/* Écran d'accueil */}
        {messages.length === 0 && (
          <div className="lineai-welcome">
            <div className="lineai-welcome-orb" />
            <h1 className="lineai-welcome-title">LineAI</h1>
            <p className="lineai-welcome-sub">Ton assistant intelligent nouvelle génération.</p>
            <div className="lineai-suggestions">
              {[
                "Explique-moi l'IA en 3 points",
                "Quelles sont les news du jour ?",
                "Aide-moi à coder une API REST",
              ].map((s) => (
                <button
                  key={s}
                  className="lineai-suggestion-chip"
                  onClick={() => setMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="lineai-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`lineai-msg lineai-msg--${msg.role}`}>
                {msg.role === "bot" && (
                  <div className="lineai-avatar">
                    <Sparkles size={14} />
                  </div>
                )}
                <div className={`lineai-bubble lineai-bubble--${msg.role}`}>
                  {msg.role === "bot"
                    ? <ReactMarkdown>{msg.content}</ReactMarkdown>
                    : msg.content
                  }
                </div>
              </div>
            ))}

            {loading && (
              <div className="lineai-msg lineai-msg--bot">
                <div className="lineai-avatar">
                  <Sparkles size={14} />
                </div>
                <div className="lineai-bubble lineai-bubble--bot lineai-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </main>

      {/* ===================== FOOTER ===================== */}
      <footer className="lineai-footer">
        <div className="lineai-input-bar">
          <textarea
            ref={textareaRef}
            className="lineai-textarea"
            placeholder="Écris ton message…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={loading}
          />
          <button
            className="lineai-send"
            onClick={sendMessage}
            disabled={loading || !message.trim()}
            aria-label="Envoyer"
          >
            {loading
              ? <Loader2 size={18} className="spin" />
              : message.trim()
                ? <Send size={18} />
                : <Sparkles size={18} />
            }
          </button>
        </div>
      </footer>

    </div>
  );
};

export default LineAI;
