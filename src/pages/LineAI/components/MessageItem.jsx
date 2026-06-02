import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import "../styles/messages.css";
import "../styles/markdown.css";

export default function MessageItem({ message }) {

  if (!message) return null;

  const isUser = message.role === "user";

  return (
    <div className={`msg ${isUser ? "msg--user" : "msg--bot"}`}>

      <div
        className={`bubble ${
          isUser
            ? "bubble--user"
            : "bubble--bot"
        }`}
      >

        {isUser ? (

          <div className="user-message">
            {message.content}
          </div>

        ) : (

          <div className="markdown-body">

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
            >
              {message.content || ""}
            </ReactMarkdown>

          </div>

        )}

      </div>

    </div>
  );
}