"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";
import type { League } from "@/types/sportsdb";

interface LeagueCardProps {
  league: League | { idLeague: string; strLeague: string; strBadge?: string; strCountry?: string };
}

export function LeagueCard({ league }: LeagueCardProps) {
  return (
    <Link href={`/leagues/${league.idLeague}`}>
      <motion.article
        whileHover={{ scale: 1.05, y: -4 }}
        className="glass-card flex flex-col items-center text-center gap-3 cursor-pointer group h-full"
      >
        <SafeImage
          src={league.strBadge}
          alt={league.strLeague}
          width={64}
          height={64}
          type="league"
          className="object-contain"
        />
        <h3 className="font-semibold group-hover:text-neon-green transition-colors text-sm">
          {league.strLeague}
        </h3>
        {league.strCountry && (
          <p className="text-xs text-slate-400">{league.strCountry}</p>
        )}
      </motion.article>
    </Link>
  );
}
