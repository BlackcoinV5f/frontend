import MessageItem from "./MessageItem";

export default function MessageList({
  messages,
  loading,
  bottomRef,
}) {
  if (!Array.isArray(messages)) return null;

  const validMessages = messages.filter(
    (msg) =>
      msg &&
      msg.role &&
      typeof msg.content === "string" &&
      msg.content.trim() !== ""
  );

  return (
    <div className="message-list">
      {validMessages.map((msg, index) => (
        <MessageItem
          key={`${msg.role}-${index}`}
          message={msg}
        />
      ))}

      {loading && (
        <div className="message-loading">
          Écriture...
        </div>
      )}

      {/* auto scroll target */}
      <div ref={bottomRef} />
    </div>
  );
}