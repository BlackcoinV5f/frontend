
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "./components/Topbar";
import SettingsPanel from "./components/SettingsPanel";
import MessageList from "./components/MessageList";
import WelcomeScreen from "./components/WelcomeScreen";
import ChatInput from "./components/ChatInput";
import useChat from "./hooks/useChat";
import useSettings from "./hooks/useSettings";
import useAutoScroll from "./hooks/useAutoScroll";
import "./styles/variables.css";
import "./styles/animations.css";
import "./styles/layout.css";
import "./styles/LineAI.css";
import "./styles/responsive.css";

export default function LineAI() {
  const {
    messages,
    loading,
    sendMessage,
    clearMessages,
    loadConversation,
    newConversation,
    markTypingDone,   // ✅ nouveau
    activeId,
  } = useChat();

  const {
    darkMode,
    setDarkMode,
    fontSize,
    setFontSize,
  } = useSettings();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  useAutoScroll(bottomRef, [messages, loading]);

  return (
    <div className={`lineai-root lineai ${darkMode ? "dark" : "light"} font-${fontSize}`}>

      <Topbar
        onBack={() => navigate(-1)}
        onToggleSettings={() => setSettingsOpen(true)}
      />

      <SettingsPanel
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onClear={clearMessages}
        onLoadConversation={loadConversation}
        onNewConversation={newConversation}
        activeId={activeId}
      />

      <main className="chat-main">
        {messages.length === 0 ? (
          <WelcomeScreen onSelect={sendMessage} />
        ) : (
          <MessageList
            messages={messages}
            loading={loading}
            bottomRef={bottomRef}
            markTypingDone={markTypingDone}   // ✅ nouveau
          />
        )}
      </main>

      <div className="chat-input-wrapper">
        <ChatInput onSend={sendMessage} loading={loading} />
      </div>

    </div>
  );
}
