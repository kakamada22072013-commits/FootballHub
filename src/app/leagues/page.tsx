"use client";

import { useEffect, useState } from "react";
import { getAllLeagues } from "@/lib/api/sportsdb";
import { FEATURED_LEAGUES } from "@/lib/constants";
import { LeagueCard } from "@/components/cards/LeagueCard";
import { LoadingState, ErrorState } from "@/components/ui/States";
import type { League } from "@/types/sportsdb";

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("");

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getAllLeagues();
      setLeagues(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = leagues.filter(
    (l) =>
      !filter ||
      l.strLeague.toLowerCase().includes(filter.toLowerCase()) ||
      (l.strCountry?.toLowerCase().includes(filter.toLowerCase()) ?? false)
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Leagues & Competitions</h1>
        <p className="text-slate-400">Premier League, La Liga, Champions League and more</p>
      </div>

      <section>
        <h2 className="text-xl font-bold mb-4">Featured Competitions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {FEATURED_LEAGUES.map((l) => (
            <LeagueCard key={l.id} league={{ idLeague: l.id, strLeague: l.name, strCountry: l.country }} />
          ))}
        </div>
      </section>

      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter leagues..."
        className="w-full max-w-xl px-4 py-3 rounded-xl glass border border-white/10 outline-none focus:border-neon-green/40"
      />

      {loading && <LoadingState />}
      {error && <ErrorState onRetry={load} />}

      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((league) => (
            <LeagueCard key={league.idLeague} league={league} />
          ))}
        </div>
      )}
    </div>
  );
}
