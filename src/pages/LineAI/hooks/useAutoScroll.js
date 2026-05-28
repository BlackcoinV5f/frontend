import { useEffect } from "react";

export default function useAutoScroll(ref, deps) {
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, deps);
}