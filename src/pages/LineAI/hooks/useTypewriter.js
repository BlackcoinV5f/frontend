import { useState, useEffect, useRef } from "react";

export default function useTypewriter(text, speed = 8) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!text) return;

    // Reset
    setDisplayed("");
    setDone(false);
    indexRef.current = 0;

    intervalRef.current = setInterval(() => {
      indexRef.current += 3; // caractères par tick
      setDisplayed(text.slice(0, indexRef.current));

      if (indexRef.current >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(intervalRef.current);
      }
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [text]);

  return { displayed, done };
}