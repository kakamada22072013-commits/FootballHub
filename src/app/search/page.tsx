"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { searchTeams, searchPlayers, searchLeagues, searchEvents } from "@/lib/api/sportsdb";
import { POPULAR_SEARCHES } from "@/lib/constants";
import { useDebounce, useRecentSearches } from "@/hooks";
import { SafeImage } from "@/components/ui/SafeImage";
import { LoadingState } from "@/components/ui/States";
import type { SearchResult } from "@/types/sportsdb";

function SearchContent() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("q") || "";
  const [query, setQuery] = useState(initial);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(query, 400);
  const { searches, addSearch, clearSearches } = useRecentSearches();

  useEffect(() => {
    if (!debounced.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const isMatchQuery = /\bvs\.?\b/i.test(debounced);
    Promise.all([
      searchTeams(debounced),
      searchPlayers(debounced),
      searchLeagues(debounced),
      isMatchQuery ? searchEvents(debounced) : Promise.resolve([]),
    ])
      .then(([teams, players, leagues, events]) => {
        const mapped: SearchResult[] = [
          ...teams.map((t) => ({
            id: t.idTeam,
            type: "team" as const,
            name: t.strTeam,
            subtitle: t.strLeague,
            image: t.strTeamBadge,
            href: `/teams/${t.idTeam}`,
          })),
          ...players.map((p) => ({
            id: p.idPlayer,
            type: "player" as const,
            name: p.strPlayer,
            subtitle: p.strTeam,
            image: p.strCutout || p.strThumb,
            href: `/players/${p.idPlayer}`,
          })),
          ...leagues.map((l) => ({
            id: l.idLeague,
            type: "league" as const,
            name: l.strLeague,
            subtitle: l.strCountry,
            image: l.strBadge,
            href: `/leagues/${l.idLeague}`,
          })),
          ...events.map((e) => ({
            id: e.idEvent,
            type: "match" as const,
            name: `${e.strHomeTeam} vs ${e.strAwayTeam}`,
            subtitle: [e.strLeague, e.dateEvent].filter(Boolean).join(" · "),
            image: e.strHomeTeamBadge,
            href: `/matches/${e.idEvent}`,
          })),
        ];
        setResults(mapped);
        addSearch(debounced);
      })
      .finally(() => setLoading(false));
  }, [debounced, addSearch]);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold gradient-text">Search Football</h1>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Teams, players, leagues, matches (e.g. Arsenal vs Chelsea)..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl glass text-lg outline-none focus:border-neon-green/40 border border-white/10"
          autoFocus
        />
      </div>

      {!query && (
        <div className="space-y-6">
          {searches.length > 0 && (
            <div>
              <div className="flex justify-between mb-3">
                <h2 className="font-semibold text-slate-400">Recent Searches</h2>
                <button onClick={clearSearches} className="text-sm text-neon-green">Clear</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searches.map((s) => (
                  <button key={s} onClick={() => setQuery(s)} className="px-4 py-2 glass rounded-xl text-sm">{s}</button>
                ))}
              </div>
            </div>
          )}
          <div>
            <h2 className="font-semibold text-slate-400 mb-3">Popular Searches</h2>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((s) => (
                <button key={s} onClick={() => setQuery(s)} className="px-4 py-2 glass rounded-xl text-sm hover:border-neon-blue/30">{s}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading && <LoadingState message="Searching..." />}

      {!loading && query && results.length === 0 && (
        <p className="text-center text-slate-400 py-12">No results for &quot;{query}&quot;</p>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-slate-400">{results.length} results</p>
          {results.map((r) => (
            <Link
              key={`${r.type}-${r.id}`}
              href={r.href}
              className="flex items-center gap-4 p-4 glass-card"
            >
              <SafeImage src={r.image} alt={r.name} width={48} height={48} type={r.type === "team" ? "team" : r.type === "player" ? "player" : r.type === "league" ? "league" : "generic"} />
              <div>
                <p className="font-semibold">{r.name}</p>
                <p className="text-sm text-slate-400 capitalize">{r.type} · {r.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="h-32 skeleton rounded-2xl" />}>
      <SearchContent />
    </Suspense>
  );
}
