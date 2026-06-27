"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getLeague,
  getLeagueTeams,
  getLeagueTable,
  getLeagueNextEvents,
  getLeaguePastEvents,
} from "@/lib/api/sportsdb";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { SafeImage } from "@/components/ui/SafeImage";
import { FavouriteButton, ShareButton } from "@/components/ui/ActionButtons";
import { TeamCard } from "@/components/cards/TeamCard";
import { MatchCard } from "@/components/cards/MatchCard";
import { LoadingState, ErrorState } from "@/components/ui/States";
import type { League, Team, Event, TableEntry } from "@/types/sportsdb";

export default function LeagueDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { addView } = useRecentlyViewed();
  const [league, setLeague] = useState<League | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [table, setTable] = useState<TableEntry[]>([]);
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [recent, setRecent] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [l, t, tb, next, past] = await Promise.all([
        getLeague(id),
        getLeagueTeams(id),
        getLeagueTable(id),
        getLeagueNextEvents(id),
        getLeaguePastEvents(id),
      ]);
      if (!l) { setError(true); return; }
      setLeague(l);
      setTeams(t);
      setTable(tb);
      setUpcoming(next);
      setRecent(past);
      addView({ id, type: "league", name: l.strLeague, image: l.strBadge, href: `/leagues/${id}` });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <LoadingState message="Loading league..." />;
  if (error || !league) return <ErrorState onRetry={load} message="League not found" />;

  const url = typeof window !== "undefined" ? window.location.href : `/leagues/${id}`;

  return (
    <div className="space-y-8 pb-8">
      <div className="relative h-48 md:h-56 rounded-3xl overflow-hidden glass-card p-0">
        {league.strBanner && <SafeImage src={league.strBanner} alt={league.strLeague} fill type="league" />}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/90 to-transparent flex items-center gap-6 p-8">
          <SafeImage src={league.strBadge} alt={league.strLeague} width={80} height={80} type="league" />
          <div className="flex-1">
            <h1 className="text-3xl font-black">{league.strLeague}</h1>
            <p className="text-slate-400">{league.strCountry} · {league.strCurrentSeason || "Current Season"}</p>
          </div>
          <div className="flex gap-2">
            <FavouriteButton id={league.idLeague} type="league" name={league.strLeague} image={league.strBadge} subtitle={league.strCountry} />
            <ShareButton url={url} title={league.strLeague} />
          </div>
        </div>
      </div>

      {league.strDescriptionEN && (
        <section className="glass-card">
          <h2 className="text-xl font-bold mb-3">About</h2>
          <p className="text-slate-400 text-sm leading-relaxed">{league.strDescriptionEN.slice(0, 600)}</p>
        </section>
      )}

      {table.length > 0 && (
        <section className="glass-card overflow-x-auto">
          <h2 className="text-xl font-bold mb-4">League Table</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-white/10">
                <th className="text-left py-2 px-2">#</th>
                <th className="text-left py-2 px-2">Team</th>
                <th className="text-center py-2 px-1">P</th>
                <th className="text-center py-2 px-1 hidden sm:table-cell">W</th>
                <th className="text-center py-2 px-1 hidden sm:table-cell">D</th>
                <th className="text-center py-2 px-1 hidden sm:table-cell">L</th>
                <th className="text-center py-2 px-1 hidden md:table-cell">GD</th>
                <th className="text-center py-2 px-2 font-bold">Pts</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row) => (
                <tr key={row.idTeam} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-2 text-neon-green font-bold">{row.intRank}</td>
                  <td className="py-3 px-2">
                    <Link href={`/teams/${row.idTeam}`} className="flex items-center gap-2 hover:text-neon-green">
                      <SafeImage src={row.strBadge} alt={row.strTeam} width={24} height={24} type="team" />
                      <span className="truncate max-w-[120px] sm:max-w-none">{row.strTeam}</span>
                    </Link>
                  </td>
                  <td className="text-center py-3 px-1">{row.intPlayed}</td>
                  <td className="text-center py-3 px-1 hidden sm:table-cell">{row.intWin}</td>
                  <td className="text-center py-3 px-1 hidden sm:table-cell">{row.intDraw}</td>
                  <td className="text-center py-3 px-1 hidden sm:table-cell">{row.intLoss}</td>
                  <td className="text-center py-3 px-1 hidden md:table-cell">{row.intGoalDifference}</td>
                  <td className="text-center py-3 px-2 font-bold">{row.intPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-bold mb-4 text-neon-blue">Upcoming</h2>
          <div className="space-y-3">
            {upcoming.length > 0 ? upcoming.slice(0, 5).map((e) => <MatchCard key={e.idEvent} event={e} compact />) : <p className="text-slate-400 text-sm">No upcoming matches</p>}
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-4">Recent Results</h2>
          <div className="space-y-3">
            {recent.length > 0 ? recent.slice(0, 5).map((e) => <MatchCard key={e.idEvent} event={e} compact />) : <p className="text-slate-400 text-sm">No recent matches</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
