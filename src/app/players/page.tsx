"use client";

import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import { searchPlayers, getPlayer } from "@/lib/api/sportsdb";
import { FEATURED_PLAYERS } from "@/lib/constants";
import { PlayerCard } from "@/components/cards/PlayerCard";
import { useDebounce, useInfiniteScroll } from "@/hooks";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/States";
import type { Player } from "@/types/sportsdb";

export default function PlayersPage() {
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const debounced = useDebounce(query, 400);

  const loadFeatured = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const results = await Promise.all(FEATURED_PLAYERS.map((p) => getPlayer(p.id)));
      setPlayers(results.filter(Boolean) as Player[]);
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
    searchPlayers(debounced)
      .then(setPlayers)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [debounced, loadFeatured]);

  const displayed = players.slice(0, (page + 1) * 12);
  const hasMore = displayed.length < players.length;
  useInfiniteScroll(() => setPage((p) => p + 1), hasMore, loading);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">Players</h1>
        <p className="text-slate-400">Discover football stars from around the world</p>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(0); }}
          placeholder="Search players..."
          className="w-full pl-12 pr-4 py-3 rounded-xl glass border border-white/10 outline-none focus:border-neon-green/40"
        />
      </div>

      {loading && players.length === 0 && <LoadingState />}
      {error && <ErrorState onRetry={loadFeatured} />}
      {!loading && !error && players.length === 0 && (
        <EmptyState title="No players found" description="Try a different search term" />
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {displayed.map((player) => (
          <PlayerCard key={player.idPlayer} player={player} />
        ))}
      </div>
    </div>
  );
}
