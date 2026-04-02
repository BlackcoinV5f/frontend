import React, { useEffect, useState, useRef } from "react";
import BlackAiLogo from "../assets/BlackAiLogo.png";
import "./BlackAI.css";

const BlackAI = () => {
  const [particles, setParticles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const logoRef = useRef(null);

  // Générer des particules
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`
      });
    }
    setParticles(newParticles);
  }, []);

  // Défilement automatique sur toute la page
  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  // Message de bienvenue
  useEffect(() => {
    setMessages([
      {
        sender: "ai",
        text: "👋 Bonjour ! Je suis BlackAi. Comment puis-je vous aider aujourd'hui ?",
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  }, []);

  // Simulation de réponse IA
  const generateAIResponse = async (userMessage) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const responses = {
      "bonjour": "Bonjour ! Comment allez-vous ?",
      "comment ça va": "Je vais très bien, merci ! Et vous ?",
      "aide": "Je suis là pour vous aider ! Posez-moi n'importe quelle question.",
      "merci": "Avec plaisir ! N'hésitez pas si vous avez d'autres questions.",
      "au revoir": "Au revoir ! À bientôt sur BlackAi !"
    };

    const lowerMsg = userMessage.toLowerCase();
    let response = "Je suis désolé, je n'ai pas encore de réponse à cette question.";

    for (const [key, value] of Object.entries(responses)) {
      if (lowerMsg.includes(key)) {
        response = value;
        break;
      }
    }

    setIsTyping(false);
    return response;
  };

  // Envoyer un message
  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = {
      sender: "user",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    const aiText = await generateAIResponse(inputValue);
    const aiMessage = {
      sender: "ai",
      text: aiText,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLogoClick = () => {
    if (logoRef.current) {
      logoRef.current.style.transform = "scale(1.1)";
      setTimeout(() => (logoRef.current.style.transform = "scale(1)"), 300);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: "ai",
        text: "💬 Chat réinitialisé ! Comment puis-je vous aider ?",
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  return (
    <div className="blackai-page">
      {/* Particules */}
      <div className="particles">
        {particles.map(p => (
          <div key={p.id} className="particle" style={{ left: p.left, top: p.top }} />
        ))}
      </div>

      {/* Logo */}
      <img
        ref={logoRef}
        src={BlackAiLogo}
        alt="BlackAi Logo"
        className="blackai-logo-top"
        onClick={handleLogoClick}
      />

      {/* Chat */}
      <div className="chat-container">
        <div className="chat-header">
          <h2>BlackAi Assistant</h2>
          <button onClick={clearChat} className="clear-button">🗑️ Effacer</button>
        </div>

        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.sender}`}>
              <div className="message-header">
                <span className="message-sender">{msg.sender === "user" ? "👤 Vous" : "🤖 BlackAi"}</span>
                <span className="message-time">{msg.timestamp}</span>
              </div>
              <div className="message-text">{msg.text}</div>
            </div>
          ))}

          {isTyping && (
            <div className="message ai typing">
              <div className="message-header">
                <span className="message-sender">🤖 BlackAi</span>
              </div>
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>

        <div className="input-container">
          <textarea
            placeholder="Tapez votre question... (Shift+Enter pour nouvelle ligne)"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
            className="message-input"
          />
          <button
            className="send-button"
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
          >
            📤
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlackAI;