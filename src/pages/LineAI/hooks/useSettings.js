import { useState } from "react";

export default function useSettings() {
  const [darkMode, setDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState("md");

  return {
    darkMode,
    setDarkMode,
    fontSize,
    setFontSize,
  };
}