import ReactMarkdown from "react-markdown";
import "../styles/messages.css";
import "../styles/markdown.css";

export default function MessageItem({ message }) {
  return (
    <div className={`msg msg--${message.role}`}>
      
      <div className={`bubble bubble--${message.role}`}>
        {message.role === "bot"
          ? <ReactMarkdown>{message.content}</ReactMarkdown>
          : message.content}
      </div>

    </div>
  );
}