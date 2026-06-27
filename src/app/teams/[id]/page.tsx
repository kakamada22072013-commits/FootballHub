"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import {
  getTeam,
  getTeamPlayers,
  getTeamNextEvents,
  getTeamLastEvents,
  getTeamHonours,
} from "@/lib/api/sportsdb";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { SafeImage } from "@/components/ui/SafeImage";
import { FavouriteButton, ShareButton } from "@/components/ui/ActionButtons";
import { MatchCard } from "@/components/cards/MatchCard";
import { PlayerCard } from "@/components/cards/PlayerCard";
import { LoadingState, ErrorState } from "@/components/ui/States";
import type { Team, Player, Event, Honour } from "@/types/sportsdb";

export default function TeamDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { addView } = useRecentlyViewed();
  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [recent, setRecent] = useState<Event[]>([]);
  const [honours, setHonours] = useState<Honour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [t, p, next, last, h] = await Promise.all([
        getTeam(id),
        getTeamPlayers(id),
        getTeamNextEvents(id),
        getTeamLastEvents(id),
        getTeamHonours(id),
      ]);
      if (!t) {
        setError(true);
        return;
      }
      setTeam(t);
      setPlayers(p);
      setUpcoming(next);
      setRecent(last);
      setHonours(h);
      addView({
        id,
        type: "team",
        name: t.strTeam,
        image: t.strTeamBadge,
        href: `/teams/${id}`,
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (loading) return <LoadingState message="Loading team..." />;
  if (error || !team) return <ErrorState onRetry={load} message="Team not found" />;

  const url = typeof window !== "undefined" ? window.location.href : `/teams/${id}`;
  const socials = [
    { icon: Globe, href: team.strWebsite, label: "Website" },
    { icon: Facebook, href: team.strFacebook, label: "Facebook" },
    { icon: Twitter, href: team.strTwitter, label: "Twitter" },
    { icon: Instagram, href: team.strInstagram, label: "Instagram" },
    { icon: Youtube, href: team.strYoutube, label: "YouTube" },
  ].filter((s) => s.href);

  return (
    <div className="space-y-8 pb-8">
      <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden">
        <SafeImage src={team.strTeamBanner || team.strTeamFanart1} alt={team.strTeam} fill type="team" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-6">
          <SafeImage src={team.strTeamBadge} alt={team.strTeam} width={100} height={100} type="team" className="drop-shadow-neon" />
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-black">{team.strTeam}</h1>
            <p className="text-slate-400">{team.strLeague} · {team.strCountry}</p>
          </div>
          <div className="flex gap-2">
            <FavouriteButton id={team.idTeam} type="team" name={team.strTeam} image={team.strTeamBadge} subtitle={team.strLeague} />
            <ShareButton url={url} title={team.strTeam} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {team.strDescriptionEN && (
            <section className="glass-card">
              <h2 className="text-xl font-bold mb-3">About</h2>
              <p className="text-slate-400 leading-relaxed text-sm">{team.strDescriptionEN.slice(0, 800)}...</p>
            </section>
          )}

          {honours.length > 0 && (
            <section className="glass-card">
              <h2 className="text-xl font-bold mb-4">Honours</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {honours.slice(0, 12).map((h, i) => (
                  <div key={i} className="flex justify-between p-3 rounded-lg bg-slate-800/50 text-sm">
                    <span>{h.strHonour}</span>
                    <span className="text-neon-green">{h.strSeason}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xl font-bold mb-4">Squad</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {players.map((p) => (
                <PlayerCard key={p.idPlayer} player={p} />
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="glass-card space-y-4">
            <h3 className="font-bold">Club Info</h3>
            {team.intFormedYear && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Calendar className="w-4 h-4 text-neon-green" /> Founded {team.intFormedYear}
              </div>
            )}
            {team.strStadium && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-neon-blue" /> {team.strStadium}
              </div>
            )}
            {team.intStadiumCapacity && (
              <p className="text-xs text-slate-500">Capacity: {Number(team.intStadiumCapacity).toLocaleString()}</p>
            )}
            {team.strStadiumThumb && (
              <div className="relative h-32 rounded-xl overflow-hidden">
                <SafeImage src={team.strStadiumThumb} alt={team.strStadium || "Stadium"} fill type="generic" />
              </div>
            )}
            {team.strTeamJersey && (
              <div className="relative h-40 rounded-xl overflow-hidden bg-slate-800/50">
                <SafeImage src={team.strTeamJersey} alt="Jersey" fill type="team" className="object-contain" />
              </div>
            )}
          </div>

          {socials.length > 0 && (
            <div className="glass-card">
              <h3 className="font-bold mb-3">Social</h3>
              <div className="flex flex-wrap gap-2">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href!.startsWith("http") ? href! : `https://${href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-xs py-2"
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {team.idLeague && (
            <Link href={`/leagues/${team.idLeague}`} className="btn-secondary w-full justify-center">
              View League
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-bold mb-4 text-neon-blue">Upcoming</h2>
          <div className="space-y-3">
            {upcoming.length > 0 ? upcoming.map((e) => <MatchCard key={e.idEvent} event={e} compact />) : <p className="text-slate-400 text-sm">No upcoming matches</p>}
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-4">Recent Results</h2>
          <div className="space-y-3">
            {recent.length > 0 ? recent.map((e) => <MatchCard key={e.idEvent} event={e} compact />) : <p className="text-slate-400 text-sm">No recent matches</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
