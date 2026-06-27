"use client";

import { useLiveClock } from "@/hooks";
import { Clock } from "lucide-react";

export function LiveClock() {
  const time = useLiveClock();

  if (!time) return null;

  return (
    <div className="hidden lg:flex items-center gap-2 text-sm text-slate-400 glass px-3 py-1.5 rounded-lg">
      <Clock className="w-4 h-4 text-neon-green" />
      <time dateTime={time.toISOString()}>
        {time.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </time>
    </div>
  );
}
