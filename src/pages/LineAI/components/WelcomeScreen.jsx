import "../styles/welcome.css";

export default function WelcomeScreen({ onSelect }) {
  const suggestions = [
    "Explique-moi l'IA",
    "Aide-moi à coder une API",
    "Quelles sont les news ?",
  ];

  return (
    <div className="welcome">

      <h1>LineAI</h1>
      <p>Assistant intelligent</p>

      <div className="chips">
        {suggestions.map((s) => (
          <button key={s} onClick={() => onSelect(s)}>
            {s}
          </button>
        ))}
      </div>

    </div>
  );
}
