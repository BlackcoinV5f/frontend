import { useEffect } from "react";

export default function useAutoScroll(ref, deps) {
  useEffect(() => {
    if (!ref.current) return;

    requestAnimationFrame(() => {
      ref.current.scrollIntoView({
        block: "end",
        inline: "nearest",
      });
    });
  }, deps);
}