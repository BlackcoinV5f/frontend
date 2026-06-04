import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

import "../styles/messages.css";
import "../styles/markdown.css";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button className="copy-btn" onClick={handleCopy}>
      {copied ? "✓ Copié" : "Copier"}
    </button>
  );
}

function CodeBlock({ language, children }) {
  const code = String(children).replace(/\n$/, "");

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-lang">{language || "code"}</span>
        <CopyButton text={code} />
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language || "text"}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: "0 0 10px 10px",
          fontSize: "13px",
          padding: "16px",
          background: "#1e1e2e",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default function MessageItem({ message }) {
  if (!message) return null;

  const isUser = message.role === "user";

  return (
    <div className={`msg ${isUser ? "msg--user" : "msg--bot"}`}>
      <div className={`bubble ${isUser ? "bubble--user" : "bubble--bot"}`}>
        {isUser ? (
          <div className="user-message">{message.content}</div>
        ) : (
          <div className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline ? (
                    <CodeBlock language={match?.[1]}>
                      {children}
                    </CodeBlock>
                  ) : (
                    <code className="inline-code" {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content || ""}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}