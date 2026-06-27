"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getEventsByDay, getLiveScores } from "@/lib/api/sportsdb";
import { getLiveMatches, getUpcomingMatches, getFinishedMatches } from "@/lib/api/sportsrc";
import { MatchCard } from "@/components/cards/MatchCard";
import { SportSRCMatchCard } from "@/components/cards/SportSRCMatchCard";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/States";
import { getMatchStatus, cn } from "@/lib/utils";
import { useI18n } from "@/contexts/I18nContext";
import type { Event } from "@/types/sportsdb";
import type { SportSRCMatch } from "@/lib/api/sportsrc";

type Tab = "live" | "upcoming" | "finished";
type Source = "all" | "thesportsdb" | "sportsrc";

function MatchesContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) || "live";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [source, setSource] = useState<Source>("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [srcMatches, setSrcMatches] = useState<SportSRCMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { t } = useI18n();

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const today = new Date();
      const allEvents: Event[] = [];

      for (let i = -3; i <= 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split("T")[0];
        const dayEvents = await getEventsByDay(dateStr);
        allEvents.push(...dayEvents);
      }

      const liveEvents = await getLiveScores();
      const merged = [...liveEvents, ...allEvents.filter((e) => !liveEvents.find((l) => l.idEvent === e.idEvent))];
      setEvents(merged);

      const [live, upcoming, finished] = await Promise.all([
        getLiveMatches(),
        getUpcomingMatches(),
        getFinishedMatches(),
      ]);
      setSrcMatches([...live, ...upcoming, ...finished]);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filteredEvents = events.filter((e) => {
    const status = getMatchStatus(e);
    if (tab === "live") return status === "live";
    if (tab === "upcoming") return status === "upcoming";
    return status === "finished";
  });

  const filteredSrc = srcMatches.filter((m) => {
    const now = Date.now();
    const isLive = m.date <= now && m.date > now - 3 * 60 * 60 * 1000;
    const isFinished = m.date < now - 3 * 60 * 60 * 1000;
    if (tab === "live") return isLive;
    if (tab === "upcoming") return !isLive && !isFinished;
    return isFinished;
  });

  const showSportsDB = source === "all" || source === "thesportsdb";
  const showSportSRC = source === "all" || source === "sportsrc";

  const tabs: { id: Tab; label: string }[] = [
    { id: "live", label: t.matches.live },
    { id: "upcoming", label: t.matches.upcoming },
    { id: "finished", label: t.matches.finished },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">{t.matches.title}</h1>
          <p className="text-slate-400">{t.matches.subtitle}</p>
        </div>
        <div className="flex gap-2">
          {(["all", "thesportsdb", "sportsrc"] as Source[]).map((s) => (
            <button
              key={s}
              onClick={() => setSource(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                source === s
                  ? "bg-neon-green/20 text-neon-green border border-neon-green/30"
                  : "glass text-slate-400 hover:text-white"
              )}
            >
              {s === "all" ? "All" : s === "thesportsdb" ? "SportsDB" : "SportSRC"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-5 py-2.5 rounded-xl font-medium transition-all",
              tab === t.id
                ? "bg-neon-green/20 text-neon-green border border-neon-green/30"
                : "glass text-slate-400 hover:text-white"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <LoadingState />}
      {error && <ErrorState onRetry={load} />}

      {!loading && !error && (
        <div className="space-y-4">
          {showSportsDB && filteredEvents.length > 0 && (
            <section>
              {source === "all" && <h3 className="text-sm font-semibold text-slate-400 mb-3">TheSportsDB</h3>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEvents.map((event) => (
                  <MatchCard key={event.idEvent} event={event} />
                ))}
              </div>
            </section>
          )}
          {showSportSRC && filteredSrc.length > 0 && (
            <section>
              {source === "all" && (
                <h3 className="text-sm font-semibold text-slate-400 mb-3 mt-6">SportSRC</h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSrc.map((m) => (
                  <SportSRCMatchCard key={m.id} match={m} />
                ))}
              </div>
            </section>
          )}
          {!loading && !error && filteredEvents.length === 0 && filteredSrc.length === 0 && (
            <EmptyState title={`No ${tab} matches`} description={t.matches.checkBack} />
          )}
        </div>
      )}
    </div>
  );
}

export default function MatchesPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <MatchesContent />
    </Suspense>
  );
}
