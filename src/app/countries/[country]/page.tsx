"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getLeaguesByCountry, getTeamsByCountry, searchPlayers } from "@/lib/api/sportsdb";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { LeagueCard } from "@/components/cards/LeagueCard";
import { TeamCard } from "@/components/cards/TeamCard";
import { PlayerCard } from "@/components/cards/PlayerCard";
import { LoadingState, ErrorState } from "@/components/ui/States";
import type { League, Team, Player } from "@/types/sportsdb";

export default function CountryDetailPage() {
  const params = useParams();
  const country = decodeURIComponent(params.country as string);
  const { addView } = useRecentlyViewed();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [l, t, p] = await Promise.all([
        getLeaguesByCountry(country),
        getTeamsByCountry(country),
        searchPlayers(country),
      ]);
      setLeagues(l);
      setTeams(t);
      setPlayers(p.slice(0, 12));
      addView({ id: country, type: "country", name: country, href: `/countries/${encodeURIComponent(country)}` });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [country]);

  if (loading) return <LoadingState message={`Loading ${country}...`} />;
  if (error) return <ErrorState onRetry={load} />;

  return (
    <div className="space-y-10 pb-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text">{country}</h1>
        <p className="text-slate-400">Leagues, teams, and players from {country}</p>
      </div>

      {leagues.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Leagues</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {leagues.map((l) => (
              <LeagueCard key={l.idLeague} league={l} />
            ))}
          </div>
        </section>
      )}

      {teams.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Teams</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {teams.slice(0, 12).map((team) => (
              <TeamCard key={team.idTeam} team={team} compact />
            ))}
          </div>
        </section>
      )}

      {players.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Players</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {players.map((p) => (
              <PlayerCard key={p.idPlayer} player={p} />
            ))}
          </div>
        </section>
      )}

      {leagues.length === 0 && teams.length === 0 && players.length === 0 && (
        <p className="text-slate-400 text-center py-12">No football data found for {country}.</p>
      )}
    </div>
  );
}
