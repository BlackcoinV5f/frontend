import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState, useEffect, useRef } from "react";
import { ProgressBar, StatBar } from "./ProgressBar";

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
        customStyle={{ margin: 0, borderRadius: "0 0 10px 10px", fontSize: "13px", padding: "16px", background: "#1e1e2e" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function parseSpecialBlocks(content) {
  const parts = [];
  const regex = /::(progress|stat)\s+(.*?)::/gs;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "markdown", content: content.slice(lastIndex, match.index) });
    }
    const [, type, args] = match;
    const params = args.split("|").map((s) => s.trim());
    if (type === "progress") {
      parts.push({ type: "progress", labelA: params[0] || "A", percentA: params[1] || "50", labelB: params[2] || "B", percentB: params[3] || "50" });
    } else if (type === "stat") {
      parts.push({ type: "stat", label: params[0] || "", value: params[1] || "0%", description: params[2] || "" });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: "markdown", content: content.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: "markdown", content }];
}

// ✅ Composant typewriter
function TypewriterContent({ content, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!content) return;
    setDisplayed("");
    indexRef.current = 0;

    intervalRef.current = setInterval(() => {
      indexRef.current += 4;
      setDisplayed(content.slice(0, indexRef.current));

      if (indexRef.current >= content.length) {
        setDisplayed(content);
        clearInterval(intervalRef.current);
        onDone?.();
      }
    }, 8);

    return () => clearInterval(intervalRef.current);
  }, [content]);

  const blocks = parseSpecialBlocks(displayed);

  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === "progress") {
          return <ProgressBar key={i} labelA={block.labelA} percentA={block.percentA} labelB={block.labelB} percentB={block.percentB} />;
        }
        if (block.type === "stat") {
          return <StatBar key={i} label={block.label} value={block.value} description={block.description} />;
        }
        return (
          <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline ? (
                <CodeBlock language={match?.[1]}>{children}</CodeBlock>
              ) : (
                <code className="inline-code" {...props}>{children}</code>
              );
            },
          }}>
            {block.content}
          </ReactMarkdown>
        );
      })}
      {/* ✅ curseur clignotant */}
      <span className="typing-cursor">▋</span>
    </>
  );
}

export default function MessageItem({ message, index, onTypingDone }) {
  if (!message) return null;

  const isUser = message.role === "user";
  const isTyping = message.isTyping === true;

  const blocks = (!isUser && !isTyping)
    ? parseSpecialBlocks(message.content || "")
    : null;

  return (
    <div className={`msg ${isUser ? "msg--user" : "msg--bot"}`}>
      <div className={`bubble ${isUser ? "bubble--user" : "bubble--bot"}`}>
        {isUser ? (
          <div className="user-message">{message.content}</div>
        ) : (
          <div className="markdown-body">
            {isTyping ? (
              // ✅ Animation typewriter
              <TypewriterContent
                content={message.content}
                onDone={() => onTypingDone?.(index)}
              />
            ) : (
              // Message déjà affiché (historique)
              blocks.map((block, i) => {
                if (block.type === "progress") {
                  return <ProgressBar key={i} labelA={block.labelA} percentA={block.percentA} labelB={block.labelB} percentB={block.percentB} />;
                }
                if (block.type === "stat") {
                  return <StatBar key={i} label={block.label} value={block.value} description={block.description} />;
                }
                return (
                  <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline ? (
                        <CodeBlock language={match?.[1]}>{children}</CodeBlock>
                      ) : (
                        <code className="inline-code" {...props}>{children}</code>
                      );
                    },
                  }}>
                    {block.content}
                  </ReactMarkdown>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}