import React, { useEffect, useState, useRef } from "react";
import "./BlackAI.css";

const BlackAI = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll automatique
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Message de bienvenue
  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: "ai",
        text: "👋 Salut ! Je suis ton assistant IA. Comment puis-je t'aider aujourd'hui ?",
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  }, []);

  // Simulation réponse IA améliorée
  const generateAIResponse = async (userMessage) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerMsg = userMessage.toLowerCase();
    
    const responses = {
      "bonjour": "Bonjour ! 😊 Comment allez-vous aujourd'hui ?",
      "salut": "Salut ! 👋 Comment puis-je t'aider ?",
      "ça va": "Je vais très bien, merci ! 🌟 Et toi ?",
      "comment ça va": "Je vais très bien, merci ! 🌟 Et toi ?",
      "aide": "Bien sûr ! Je peux t'aider avec :\n• Des questions générales\n• Des explications\n• Des conseils\n• Et bien plus ! Que veux-tu savoir ?",
      "merci": "Avec plaisir ! 🙏 N'hésite pas si tu as d'autres questions.",
      "au revoir": "À bientôt ! 👋 Passe une excellente journée !",
      "bye": "À bientôt ! 👋 Prends soin de toi !",
      "quoi de neuf": "Pas grand-chose ! Je suis là pour discuter avec toi. 😄",
      "bien": "Tant mieux ! 😊 Je suis content de l'entendre.",
      "pas bien": "Oh désolé de l'apprendre 😕 Veux-tu en parler ? Je suis là pour t'écouter."
    };

    // Recherche de mots-clés
    for (const key in responses) {
      if (lowerMsg.includes(key)) {
        setIsTyping(false);
        return responses[key];
      }
    }

    // Réponse par défaut plus intelligente
    if (lowerMsg.length > 10) {
      setIsTyping(false);
      return "Intéressant ! 🤔 Pourrais-tu m'en dire plus ? Je veux bien t'aider à approfondir ce sujet.";
    }

    setIsTyping(false);
    return "Je ne comprends pas encore tout à fait 🤔 Peux-tu reformuler ou me poser une autre question ?";
  };

  // Envoyer message
  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    const aiText = await generateAIResponse(inputValue);

    const aiMessage = {
      id: Date.now() + 1,
      sender: "ai",
      text: aiText,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  // Entrée clavier
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Resize textarea
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  return (
    <div className="blackai-container">
      {/* HEADER AVEC PARAMÈTRES */}
      <div className="chat-header">
        <div className="header-left">
          <div className="ai-icon">🤖</div>
          <div className="header-info">
            <h2>Black AI Assistant</h2>
            <span className="online-status">● En ligne</span>
          </div>
        </div>
        <div className="header-right">
          <button 
            className="settings-button"
            onClick={() => setShowSettings(!showSettings)}
            title="Paramètres"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* MENU PARAMÈTRES */}
      {showSettings && (
        <div className="settings-menu">
          <div className="settings-item">
            <span>🌙 Mode sombre</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
          <div className="settings-item">
            <span>🔔 Notifications</span>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <div className="settings-item">
            <span>💬 Son des messages</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
          <div className="settings-divider"></div>
          <button className="settings-close" onClick={() => setShowSettings(false)}>
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
            <div className="message-content">
              <div className="message-bubble">
                <div className="message-text">{msg.text}</div>
                <div className="message-time">{msg.timestamp}</div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message-wrapper ai">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="message-bubble typing-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT ZONE */}
      <div className="input-wrapper">
        <div className="input-container">
          <textarea
            ref={inputRef}
            placeholder="Écris ton message ici..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
            className="message-input"
          />
          <button
            className={`send-button ${!inputValue.trim() || isTyping ? "disabled" : ""}`}
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
          >
            ✨
          </button>
        </div>
        <div className="input-hint">
          Appuie sur Entrée pour envoyer, Maj+Entrée pour sauter une ligne
        </div>
      </div>
    </div>
  );
};

export default BlackAI;