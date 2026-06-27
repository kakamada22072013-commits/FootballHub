"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, X, Clock, TrendingUp, Shield, User, Trophy, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchTeams, searchPlayers, searchLeagues, searchEvents } from "@/lib/api/sportsdb";
import { POPULAR_SEARCHES } from "@/lib/constants";
import { useDebounce, useRecentSearches } from "@/hooks";
import { SafeImage } from "@/components/ui/SafeImage";
import { Skeleton } from "@/components/ui/Skeleton";
import type { SearchResult } from "@/types/sportsdb";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const typeIcons = { team: Shield, player: User, league: Trophy, match: Calendar };

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 350);
  const { searches, addSearch, clearSearches } = useRecentSearches();

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const isMatchQuery = /\bvs\.?\b/i.test(q);
      const [teams, players, leagues, events] = await Promise.all([
        searchTeams(q),
        searchPlayers(q),
        searchLeagues(q),
        isMatchQuery ? searchEvents(q) : Promise.resolve([]),
      ]);

      const mapped: SearchResult[] = [
        ...teams.slice(0, 5).map((t) => ({
          id: t.idTeam,
          type: "team" as const,
          name: t.strTeam,
          subtitle: t.strLeague || t.strCountry,
          image: t.strTeamBadge,
          href: `/teams/${t.idTeam}`,
        })),
        ...players.slice(0, 5).map((p) => ({
          id: p.idPlayer,
          type: "player" as const,
          name: p.strPlayer,
          subtitle: p.strTeam || p.strPosition,
          image: p.strCutout || p.strThumb,
          href: `/players/${p.idPlayer}`,
        })),
        ...leagues.slice(0, 5).map((l) => ({
          id: l.idLeague,
          type: "league" as const,
          name: l.strLeague,
          subtitle: l.strCountry,
          image: l.strBadge,
          href: `/leagues/${l.idLeague}`,
        })),
        ...events.slice(0, 5).map((e) => ({
          id: e.idEvent,
          type: "match" as const,
          name: `${e.strHomeTeam} vs ${e.strAwayTeam}`,
          subtitle: [e.strLeague, e.dateEvent].filter(Boolean).join(" · "),
          image: e.strHomeTeamBadge,
          href: `/matches/${e.idEvent}`,
        })),
      ];
      setResults(mapped);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!open) {
          /* handled by navbar */
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleSelect = (result: SearchResult) => {
    addSearch(result.name);
    onClose();
  };

  const handlePopularClick = (term: string) => {
    setQuery(term);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="w-full max-w-2xl glass rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-label="Search"
        >
          <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
            <Search className="w-5 h-5 text-neon-green shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search teams, players, leagues..."
              className="flex-1 bg-transparent outline-none text-lg placeholder:text-slate-500"
            />
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4">
            {loading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            )}

            {!loading && results.length > 0 && (
              <ul className="space-y-1">
                {results.map((r) => {
                  const Icon = typeIcons[r.type];
                  return (
                    <li key={`${r.type}-${r.id}`}>
                      <Link
                        href={r.href}
                        onClick={() => handleSelect(r)}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                      >
                        <SafeImage
                          src={r.image}
                          alt={r.name}
                          width={40}
                          height={40}
                          type={r.type === "team" ? "team" : r.type === "player" ? "player" : "league"}
                          className="rounded-lg object-contain"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{r.name}</p>
                          <p className="text-xs text-slate-400 truncate">{r.subtitle}</p>
                        </div>
                        <Icon className="w-4 h-4 text-slate-500 shrink-0" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            {!loading && query && results.length === 0 && (
              <p className="text-center text-slate-400 py-8">No results for &quot;{query}&quot;</p>
            )}

            {!query && (
              <div className="space-y-6">
                {searches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4" /> Recent Searches
                      </h3>
                      <button
                        onClick={clearSearches}
                        className="text-xs text-slate-500 hover:text-neon-green"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searches.map((s) => (
                        <button
                          key={s}
                          onClick={() => handlePopularClick(s)}
                          className="px-3 py-1.5 rounded-lg glass text-sm hover:border-neon-green/30"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-400 mb-3">
                    <TrendingUp className="w-4 h-4" /> Popular Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((s) => (
                      <button
                        key={s}
                        onClick={() => handlePopularClick(s)}
                        className="px-3 py-1.5 rounded-lg glass text-sm hover:border-neon-blue/30"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
