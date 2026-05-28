import { useEffect } from "react";

export default function useTextareaResize(ref, value) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [value, ref]);
}