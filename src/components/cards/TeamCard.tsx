"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";
import type { Team } from "@/types/sportsdb";

interface TeamCardProps {
  team: Team;
  compact?: boolean;
}

export function TeamCard({ team, compact }: TeamCardProps) {
  return (
    <Link href={`/teams/${team.idTeam}`}>
      <motion.article
        whileHover={{ scale: 1.05, y: -4 }}
        className="glass-card flex flex-col items-center text-center gap-3 cursor-pointer group h-full"
      >
        <div className="relative w-20 h-20 group-hover:animate-float">
          <SafeImage
            src={team.strTeamBadge}
            alt={team.strTeam}
            width={80}
            height={80}
            type="team"
            className="object-contain"
          />
        </div>
        {!compact && (
          <>
            <h3 className="font-semibold group-hover:text-neon-green transition-colors">
              {team.strTeam}
            </h3>
            <p className="text-xs text-slate-400">{team.strLeague || team.strCountry}</p>
          </>
        )}
        {compact && (
          <span className="text-sm font-medium truncate w-full">{team.strTeam}</span>
        )}
      </motion.article>
    </Link>
  );
}
