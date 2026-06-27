"use client";

import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import { searchTeams } from "@/lib/api/sportsdb";
import { FEATURED_TEAMS } from "@/lib/constants";
import { getTeam } from "@/lib/api/sportsdb";
import { TeamCard } from "@/components/cards/TeamCard";
import { useDebounce, useInfiniteScroll } from "@/hooks";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/States";
import type { Team } from "@/types/sportsdb";

export default function TeamsPage() {
  const [query, setQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const debounced = useDebounce(query, 400);

  const loadFeatured = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const results = await Promise.all(FEATURED_TEAMS.map((t) => getTeam(t.id)));
      setTeams(results.filter(Boolean) as Team[]);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!debounced.trim()) {
      loadFeatured();
      return;
    }
    setLoading(true);
    searchTeams(debounced)
      .then(setTeams)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [debounced, loadFeatured]);

  const displayed = teams.slice(0, (page + 1) * 12);
  const hasMore = displayed.length < teams.length;

  useInfiniteScroll(() => setPage((p) => p + 1), hasMore, loading);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Teams</h1>
        <p className="text-slate-400">Explore football clubs from around the world</p>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(0); }}
          placeholder="Search teams..."
          className="w-full pl-12 pr-4 py-3 rounded-xl glass border border-white/10 outline-none focus:border-neon-green/40"
        />
      </div>

      {loading && teams.length === 0 && <LoadingState />}
      {error && <ErrorState onRetry={loadFeatured} />}
      {!loading && !error && teams.length === 0 && (
        <EmptyState title="No teams found" description="Try a different search term" />
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {displayed.map((team) => (
          <TeamCard key={team.idTeam} team={team} />
        ))}
      </div>
    </div>
  );
}
