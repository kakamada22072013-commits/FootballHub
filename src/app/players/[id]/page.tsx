"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, Ruler, Weight, Heart, MapPin } from "lucide-react";
import { getPlayer, getTeamPlayers, getPlayerHonours } from "@/lib/api/sportsdb";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { SafeImage } from "@/components/ui/SafeImage";
import { FavouriteButton, ShareButton } from "@/components/ui/ActionButtons";
import { PlayerCard } from "@/components/cards/PlayerCard";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { calculateAge } from "@/lib/utils";
import type { Player, Honour } from "@/types/sportsdb";

export default function PlayerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { addView } = useRecentlyViewed();
  const [player, setPlayer] = useState<Player | null>(null);
  const [related, setRelated] = useState<Player[]>([]);
  const [honours, setHonours] = useState<Honour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const p = await getPlayer(id);
      if (!p) { setError(true); return; }
      setPlayer(p);
      addView({ id, type: "player", name: p.strPlayer, image: p.strCutout || p.strThumb, href: `/players/${id}` });

      const [h, teamPlayers] = await Promise.all([
        getPlayerHonours(id),
        p.idTeam ? getTeamPlayers(p.idTeam) : Promise.resolve([]),
      ]);
      setHonours(h);
      setRelated(teamPlayers.filter((tp) => tp.idPlayer !== id).slice(0, 8));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <LoadingState message="Loading player..." />;
  if (error || !player) return <ErrorState onRetry={load} message="Player not found" />;

  const url = typeof window !== "undefined" ? window.location.href : `/players/${id}`;
  const age = calculateAge(player.dateBorn);
  const loved = player.intLoved ? Number(player.intLoved) : 0;

  return (
    <div className="space-y-8 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="glass-card relative h-80 overflow-hidden">
            <SafeImage src={player.strCutout || player.strRender || player.strThumb} alt={player.strPlayer} fill type="player" className="object-contain object-bottom" priority />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black">{player.strPlayer}</h1>
              <p className="text-slate-400 mt-1">{player.strPosition} · {player.strNationality}</p>
              {player.idTeam && (
                <Link href={`/teams/${player.idTeam}`} className="text-neon-green hover:underline text-sm mt-1 inline-block">
                  {player.strTeam}
                </Link>
              )}
            </div>
            <div className="flex gap-2">
              <FavouriteButton id={player.idPlayer} type="player" name={player.strPlayer} image={player.strCutout || player.strThumb} subtitle={player.strTeam} />
              <ShareButton url={url} title={player.strPlayer} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {player.dateBorn && (
              <div className="glass-card text-center py-3">
                <Calendar className="w-4 h-4 mx-auto text-neon-green mb-1" />
                <p className="text-xs text-slate-400">Born</p>
                <p className="font-semibold text-sm">{player.dateBorn}{age ? ` (${age})` : ""}</p>
              </div>
            )}
            {player.strHeight && (
              <div className="glass-card text-center py-3">
                <Ruler className="w-4 h-4 mx-auto text-neon-blue mb-1" />
                <p className="text-xs text-slate-400">Height</p>
                <p className="font-semibold text-sm">{player.strHeight}</p>
              </div>
            )}
            {player.strWeight && (
              <div className="glass-card text-center py-3">
                <Weight className="w-4 h-4 mx-auto text-neon-purple mb-1" />
                <p className="text-xs text-slate-400">Weight</p>
                <p className="font-semibold text-sm">{player.strWeight}</p>
              </div>
            )}
            {loved > 0 && (
              <div className="glass-card text-center py-3">
                <Heart className="w-4 h-4 mx-auto text-red-400 mb-1" />
                <p className="text-xs text-slate-400">Fan Favourite</p>
                <p className="font-semibold text-sm">{loved.toLocaleString()} fans</p>
              </div>
            )}
          </div>

          {player.strBirthLocation && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="w-4 h-4" /> Born in {player.strBirthLocation}
            </div>
          )}

          {player.strDescriptionEN && (
            <section className="glass-card">
              <h2 className="text-xl font-bold mb-3">Biography</h2>
              <p className="text-slate-400 leading-relaxed text-sm">{player.strDescriptionEN.slice(0, 1000)}</p>
            </section>
          )}

          {honours.length > 0 && (
            <section className="glass-card">
              <h2 className="text-xl font-bold mb-4">Honours</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {honours.slice(0, 10).map((h, i) => (
                  <div key={i} className="flex justify-between p-3 rounded-lg bg-slate-800/50 text-sm">
                    <span>{h.strHonour}</span>
                    <span className="text-neon-green">{h.strSeason}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Related Players</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {related.map((p) => (
              <PlayerCard key={p.idPlayer} player={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
