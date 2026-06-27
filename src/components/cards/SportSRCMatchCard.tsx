"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Tv } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { cn } from "@/lib/utils";
import type { SportSRCMatch } from "@/lib/api/sportsrc";

interface Props {
  match: SportSRCMatch;
  compact?: boolean;
}

export function SportSRCMatchCard({ match, compact }: Props) {
  const now = Date.now();
  const isLive = match.date <= now && match.date > now - 3 * 60 * 60 * 1000;
  const isFinished = match.date < now - 3 * 60 * 60 * 1000;
  const dateStr = new Date(match.date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const timeStr = new Date(match.date).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link href={`/matches/${match.id}`}>
      <motion.article
        whileHover={{ scale: 1.02, y: -2 }}
        className={cn(
          "glass-card block cursor-pointer group",
          isLive && "border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-400 truncate max-w-[60%]">International Match</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neon-green flex items-center gap-1">
              <Tv className="w-3 h-3" /> Watch
            </span>
            <span
              className={cn(
                "text-xs font-semibold uppercase",
                isLive && "status-live",
                isFinished && "status-finished",
                !isLive && !isFinished && "status-upcoming"
              )}
            >
              {isLive ? "LIVE" : isFinished ? "FT" : timeStr}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <SafeImage
              src={match.teams.home.badge}
              alt={match.teams.home.name}
              width={compact ? 28 : 36}
              height={compact ? 28 : 36}
              type="team"
              className="rounded-full shrink-0"
            />
            <span className="font-medium truncate text-sm">{match.teams.home.name}</span>
          </div>

          <div className="px-3 py-1 rounded-lg bg-slate-800/80 font-bold text-center min-w-[60px] text-xs">
            vs
          </div>

          <div className="flex-1 flex items-center gap-2 min-w-0 justify-end">
            <span className="font-medium truncate text-sm text-right">{match.teams.away.name}</span>
            <SafeImage
              src={match.teams.away.badge}
              alt={match.teams.away.name}
              width={compact ? 28 : 36}
              height={compact ? 28 : 36}
              type="team"
              className="rounded-full shrink-0"
            />
          </div>
        </div>

        {!compact && (
          <div className="mt-3 pt-3 border-t border-white/5 flex justify-between text-xs text-slate-500">
            <span>{dateStr}</span>
          </div>
        )}
      </motion.article>
    </Link>
  );
}
