"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Zap, Globe, TrendingUp, Newspaper } from "lucide-react";
import {
  getTeam,
  getPlayer,
  getEventsByDay,
  getLeagueNextEvents,
  getLeaguePastEvents,
  getAllLeagues,
} from "@/lib/api/sportsdb";
import {
  FEATURED_TEAMS,
  FEATURED_LEAGUES,
  FEATURED_PLAYERS,
  TOP_COUNTRIES,
} from "@/lib/constants";
import { TeamCard } from "@/components/cards/TeamCard";
import { PlayerCard } from "@/components/cards/PlayerCard";
import { LeagueCard } from "@/components/cards/LeagueCard";
import { MatchCard } from "@/components/cards/MatchCard";
import { HorizontalSlider, SliderItem } from "@/components/ui/HorizontalSlider";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { MatchSkeleton } from "@/components/ui/Skeleton";
import { useI18n } from "@/contexts/I18nContext";
import type { Team, Player, Event, League } from "@/types/sportsdb";
import { getMatchStatus } from "@/lib/utils";

export function HomePage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [recent, setRecent] = useState<Event[]>([]);
  const [live, setLive] = useState<Event[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { t } = useI18n();

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

      const wrap = <T,>(p: Promise<T>): Promise<T | null> => p.catch(() => null);

      const [teamResults, playerResults, todayEvents, yesterdayEvents, nextPL, pastPL, allLeagues] =
        await Promise.all([
          Promise.all(FEATURED_TEAMS.map((t) => wrap(getTeam(t.id)))),
          Promise.all(FEATURED_PLAYERS.map((p) => wrap(getPlayer(p.id)))),
          wrap(getEventsByDay(today)),
          wrap(getEventsByDay(yesterday)),
          wrap(getLeagueNextEvents("4328")),
          wrap(getLeaguePastEvents("4328")),
          wrap(getAllLeagues()),
        ]);

      setTeams((teamResults?.filter(Boolean) as Team[]) ?? []);
      setPlayers((playerResults?.filter(Boolean) as Player[]) ?? []);
      setLive((todayEvents as Event[])?.filter((e) => getMatchStatus(e) === "live") ?? []);
      setUpcoming([...(nextPL as Event[]) ?? [], ...(todayEvents as Event[])?.filter((e) => getMatchStatus(e) === "upcoming") ?? []].slice(0, 8));
      setRecent([...(pastPL as Event[]) ?? [], ...(yesterdayEvents as Event[])?.filter((e) => getMatchStatus(e) === "finished") ?? []].slice(0, 8));
      setLeagues((allLeagues as League[])?.slice(0, 20) ?? []);
    } catch {
      // fall through — page renders with whatever data loaded
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-12">
        <div className="h-96 skeleton rounded-3xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 skeleton rounded-2xl" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <MatchSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState onRetry={loadData} message="Failed to load football data. Check your connection and try again." />;
  }

  return (
    <div className="space-y-16 pb-8">
      <section className="relative min-h-[420px] rounded-3xl overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='none' stroke='%2300ff88' stroke-width='0.5'/%3E%3Cpath d='M50 10 L50 90 M10 50 L90 50' stroke='%2300d4ff' stroke-width='0.3'/%3E%3C/svg%3E")`,
            backgroundSize: "80px 80px",
          }}
        />
        <div className="relative z-10 px-6 md:px-12 py-16 w-full">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-4"
          >
            {t.home.welcome}{" "}
            <span className="gradient-text block mt-2">{t.home.footballHub}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mb-8"
          >
            {t.home.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/search" className="btn-primary">
              <Search className="w-5 h-5" />
              {t.home.searchFootball}
            </Link>
            <Link href="/matches" className="btn-secondary">
              <Zap className="w-5 h-5 text-neon-green" />
              {t.home.liveMatches}
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t.home.teams, value: teams.length * 100 + 500, icon: "⚽" },
          { label: t.home.leagues, value: leagues.length + 150, icon: "🏆" },
          { label: t.home.liveNow, value: live.length, icon: "🔴" },
          { label: t.home.countries, value: TOP_COUNTRIES.length + 180, icon: "🌍" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card text-center"
          >
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-2xl md:text-3xl font-bold gradient-text mt-2">
              <AnimatedCounter value={stat.value} suffix="+" />
            </p>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </section>

      {live.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            {t.home.liveMatches}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {live.map((e) => (
              <MatchCard key={e.idEvent} event={e} />
            ))}
          </div>
        </section>
      )}

      <HorizontalSlider title={t.home.featuredTeams} subtitle={t.home.featuredTeamsSub}>
        {teams.map((team) => (
          <SliderItem key={team.idTeam}>
            <TeamCard team={team} />
          </SliderItem>
        ))}
      </HorizontalSlider>

      <section>
        <h2 className="text-2xl font-bold gradient-text mb-6">{t.home.popularLeagues}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {FEATURED_LEAGUES.map((l) => (
            <LeagueCard key={l.id} league={{ idLeague: l.id, strLeague: l.name, strCountry: l.country }} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-bold mb-4 text-neon-blue">{t.home.upcomingMatches}</h2>
          <div className="space-y-3">
            {upcoming.length > 0 ? (
              upcoming.map((e) => <MatchCard key={e.idEvent} event={e} compact />)
            ) : (
              <p className="text-slate-400 text-sm">{t.common.noResults}</p>
            )}
          </div>
          <Link href="/matches?tab=upcoming" className="inline-block mt-4 text-sm text-neon-green hover:underline">
            {t.home.viewAllUpcoming}
          </Link>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-4 text-slate-400">{t.home.recentResults}</h2>
          <div className="space-y-3">
            {recent.length > 0 ? (
              recent.map((e) => <MatchCard key={e.idEvent} event={e} compact />)
            ) : (
              <p className="text-slate-400 text-sm">{t.common.noResults}</p>
            )}
          </div>
          <Link href="/matches?tab=finished" className="inline-block mt-4 text-sm text-neon-green hover:underline">
            {t.home.viewAllResults}
          </Link>
        </section>
      </div>

      <HorizontalSlider title={t.home.trendingPlayers} subtitle={t.home.trendingPlayersSub}>
        {players.map((player) => (
          <SliderItem key={player.idPlayer} className="w-[180px]">
            <PlayerCard player={player} />
          </SliderItem>
        ))}
      </HorizontalSlider>

      <section>
        <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center gap-2">
          <Globe className="w-6 h-6" /> {t.home.topFootballCountries}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {TOP_COUNTRIES.map((country) => (
            <Link
              key={country}
              href={`/countries/${encodeURIComponent(country)}`}
              className="glass-card text-center py-4 hover:border-neon-green/30 transition-all hover:scale-105"
            >
              <span className="text-2xl mb-2 block">🏳️</span>
              <span className="text-sm font-medium">{country}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-neon-blue" /> {t.home.latestEvents}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recent.slice(0, 6).map((e) => (
            <Link key={e.idEvent} href={`/matches/${e.idEvent}`} className="glass-card hover:border-neon-blue/30 block">
              <p className="text-xs text-neon-green mb-2">{e.strLeague}</p>
              <p className="font-semibold">
                {e.strHomeTeam} {e.intHomeScore != null ? e.intHomeScore : ""} - {e.intAwayScore != null ? e.intAwayScore : ""} {e.strAwayTeam}
              </p>
              <p className="text-xs text-slate-500 mt-2">{e.dateEvent}</p>
            </Link>
          ))}
        </div>
      </section>

      <HorizontalSlider title={t.home.featuredCompetitions} subtitle={t.home.featuredCompetitionsSub}>
        {leagues.slice(0, 12).map((l) => (
          <SliderItem key={l.idLeague}>
            <LeagueCard league={l} />
          </SliderItem>
        ))}
      </HorizontalSlider>

      <section className="glass-card text-center py-12 bg-card-gradient">
        <TrendingUp className="w-12 h-12 mx-auto text-neon-green mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t.home.aiPowered}</h2>
        <p className="text-slate-400 mb-6 max-w-lg mx-auto">
          {t.home.aiDescription}
        </p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-ai-chat"))}
          className="btn-primary"
        >
          {t.home.openAi}
        </button>
      </section>
    </div>
  );
}
