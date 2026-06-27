"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SafeImage } from "@/components/ui/SafeImage";
import type { Player } from "@/types/sportsdb";

interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <Link href={`/players/${player.idPlayer}`}>
      <motion.article
        whileHover={{ scale: 1.05, y: -4 }}
        className="glass-card flex flex-col items-center text-center gap-3 cursor-pointer group h-full overflow-hidden"
      >
        <div className="relative w-full h-36 -mx-4 -mt-4 mb-1">
          <SafeImage
            src={player.strCutout || player.strThumb}
            alt={player.strPlayer}
            fill
            type="player"
            className="object-contain object-bottom"
          />
        </div>
        <h3 className="font-semibold group-hover:text-neon-blue transition-colors px-2">
          {player.strPlayer}
        </h3>
        <p className="text-xs text-slate-400">{player.strPosition || player.strTeam}</p>
        {player.strNationality && (
          <span className="text-xs text-neon-green/80">{player.strNationality}</span>
        )}
      </motion.article>
    </Link>
  );
}
