"use client";

import { useScrollToTop } from "@/hooks";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const { visible, scrollToTop } = useScrollToTop();

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 left-6 z-50 p-3 rounded-full glass border-neon-green/30
        hover:shadow-neon hover:scale-110 transition-all duration-300"
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5 text-neon-green" />
    </button>
  );
}
