"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";
import { cn, formatDate, formatTime, getMatchStatus, getCountdown } from "@/lib/utils";
import type { Event } from "@/types/sportsdb";

interface MatchCardProps {
  event: Event;
  compact?: boolean;
}

export function MatchCard({ event, compact }: MatchCardProps) {
  const status = getMatchStatus(event);
  const isLive = status === "live";
  const isFinished = status === "finished";
  const score =
    event.intHomeScore != null && event.intAwayScore != null
      ? `${event.intHomeScore} - ${event.intAwayScore}`
      : null;

  return (
    <Link href={`/matches/${event.idEvent}`}>
      <motion.article
        whileHover={{ scale: 1.02, y: -2 }}
        className={cn(
          "glass-card block cursor-pointer group",
          isLive && "border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-400 truncate max-w-[60%]">
            {event.strLeague}
          </span>
          <span
            className={cn(
              "text-xs font-semibold uppercase",
              isLive && "status-live",
              isFinished && "status-finished",
              status === "upcoming" && "status-upcoming"
            )}
          >
            {isLive ? "LIVE" : isFinished ? "FT" : getCountdown(event.dateEvent || "", event.strTime)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <SafeImage
              src={event.strHomeTeamBadge}
              alt={event.strHomeTeam || "Home"}
              width={compact ? 28 : 36}
              height={compact ? 28 : 36}
              type="team"
              className="rounded-full shrink-0"
            />
            <span className="font-medium truncate text-sm">{event.strHomeTeam}</span>
          </div>

          <div className="px-3 py-1 rounded-lg bg-slate-800/80 font-bold text-center min-w-[60px]">
            {score ?? (formatTime(event.strTime) || "vs")}
          </div>

          <div className="flex-1 flex items-center gap-2 min-w-0 justify-end">
            <span className="font-medium truncate text-sm text-right">{event.strAwayTeam}</span>
            <SafeImage
              src={event.strAwayTeamBadge}
              alt={event.strAwayTeam || "Away"}
              width={compact ? 28 : 36}
              height={compact ? 28 : 36}
              type="team"
              className="rounded-full shrink-0"
            />
          </div>
        </div>

        {!compact && (
          <div className="mt-3 pt-3 border-t border-white/5 flex justify-between text-xs text-slate-500">
            <span>{formatDate(event.dateEvent)}</span>
            {event.strVenue && <span className="truncate max-w-[50%]">{event.strVenue}</span>}
          </div>
        )}
      </motion.article>
    </Link>
  );
}
