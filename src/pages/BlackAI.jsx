import React, { useEffect, useState, useRef } from "react";
import "./BlackAI.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useMutation } from "@tanstack/react-query";

// 🔥 Backend URL
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8001/api/blackai";

const BlackAI = () => {
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

  // ✅ Message de bienvenue
  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        sender: "ai",
        text: "👋 Salut ! Je suis BlackAI. Pose-moi une question.",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  // 🔥 Mutation (appel API)
  const mutation = useMutation({
    mutationFn: async (question) => {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();
      return data?.answer || "❌ Réponse vide";
    },

    onSuccess: (aiText) => {
      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: aiText,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
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

  // ✅ Envoi message
  const handleSend = () => {
    if (!inputValue.trim() || mutation.isPending) return;

    const userText = inputValue.trim();

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    if (inputRef.current) inputRef.current.style.height = "auto";

    mutation.mutate(userText);
  };

  // ✅ Entrée clavier
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ✅ Resize textarea
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  // Fonction pour nettoyer le texte Markdown
  const cleanMarkdown = (text) => {
    // Supprimer les lignes vides multiples
    let cleaned = text.replace(/\n\s*\n\s*\n/g, '\n\n');
    // Supprimer les espaces en début/fin de ligne
    cleaned = cleaned.replace(/[ \t]+$/gm, '');
    // Supprimer les retours à la ligne multiples dans les paragraphes
    cleaned = cleaned.replace(/([.!?])\n\n/g, '$1\n');
    return cleaned;
  };

  return (
    <div className="blackai-container">
      {/* HEADER */}
      <div className="chat-header">
        <div className="header-left">
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

            <div className="message-bubble">
              <div className="message-text">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    // Contrôle des paragraphes
                    p: ({ children, ...props }) => {
                      const text = children?.[0];

                      // Progress bar special
                      if (
                        typeof text === "string" &&
                        text.includes("[progress:")
                      ) {
                        const match = text.match(/\[progress:(\d+)\]/);
                        const value = match ? parseInt(match[1]) : 0;

                        return (
                          <div className="progress-container">
                            <div
                              className="progress-bar"
                              style={{ width: `${value}%` }}
                            />
                            <span className="progress-text">{value}%</span>
                          </div>
                        );
                      }

                      return <p className="markdown-paragraph" {...props}>{children}</p>;
                    },
                    
                    // Headings avec espacement réduit
                    h1: ({ children }) => <h1 className="markdown-h1">{children}</h1>,
                    h2: ({ children }) => <h2 className="markdown-h2">{children}</h2>,
                    h3: ({ children }) => <h3 className="markdown-h3">{children}</h3>,
                    h4: ({ children }) => <h4 className="markdown-h4">{children}</h4>,
                    
                    // Listes
                    ul: ({ children }) => <ul className="markdown-ul">{children}</ul>,
                    ol: ({ children }) => <ol className="markdown-ol">{children}</ol>,
                    li: ({ children }) => <li className="markdown-li">{children}</li>,
                    
                    // Code blocks
                    pre: ({ children }) => <pre className="markdown-pre">{children}</pre>,
                    code: ({ children }) => <code className="markdown-code">{children}</code>,
                    
                    // Blockquote
                    blockquote: ({ children }) => <blockquote className="markdown-blockquote">{children}</blockquote>,
                    
                    // Tableaux
                    table: ({ children }) => (
                      <table className="custom-table">
                        {children}
                      </table>
                    ),
                    th: ({ children }) => <th className="table-header">{children}</th>,
                    td: ({ children }) => <td className="table-cell">{children}</td>,
                    
                    // Éviter les sauts de ligne excessifs
                    br: () => <br className="markdown-br" />,
                  }}
                >
                  {cleanMarkdown(msg.text)}
                </ReactMarkdown>
              </div>

              <div className="message-time">{msg.timestamp}</div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
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