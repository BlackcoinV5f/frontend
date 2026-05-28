import MessageItem from "./MessageItem";
import "../styles/messages.css";

export default function MessageList({ messages, loading, bottomRef }) {
  return (
    <div className="messages">

      {messages.map((m, i) => (
        <MessageItem key={i} message={m} />
      ))}

      {loading && (
        <div className="msg msg--bot">
          <div className="bubble typing">
            <span /><span /><span />
          </div>
        </div>
      )}

      <div ref={bottomRef} />

    </div>
  );
}
