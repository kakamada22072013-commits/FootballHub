"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar, Clock, Tv } from "lucide-react";
import { getEvent } from "@/lib/api/sportsdb";
import { getMatchDetail } from "@/lib/api/sportsrc";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { SafeImage } from "@/components/ui/SafeImage";
import { StreamPlayer } from "@/components/stream/StreamPlayer";
import { ShareButton, CopyLinkButton } from "@/components/ui/ActionButtons";
import { LoadingState, ErrorState } from "@/components/ui/States";
import { formatDate, formatTime, getMatchStatus, getCountdown } from "@/lib/utils";
import type { Event } from "@/types/sportsdb";
import type { SportSRCMatchDetail } from "@/lib/api/sportsrc";

export default function MatchDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { addView } = useRecentlyViewed();
  const [event, setEvent] = useState<Event | null>(null);
  const [sportSrc, setSportSrc] = useState<SportSRCMatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const src = await getMatchDetail(id);
      if (src) {
        setSportSrc(src);
        addView({ id, type: "match", name: src.title, href: `/matches/${id}` });
        return;
      }
      const e = await getEvent(id);
      if (e) {
        setEvent(e);
        addView({ id, type: "match", name: `${e.strHomeTeam} vs ${e.strAwayTeam}`, href: `/matches/${id}` });
        return;
      }
      setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <LoadingState message="Loading match..." />;
  if (error || (!event && !sportSrc)) return <ErrorState onRetry={load} message="Match not found" />;

  const url = typeof window !== "undefined" ? window.location.href : `/matches/${id}`;

  if (sportSrc) {
    const now = Date.now();
    const isLive = sportSrc.date <= now && sportSrc.date > now - 3 * 60 * 60 * 1000;
    const isFinished = sportSrc.date < now - 3 * 60 * 60 * 1000;
    const dateStr = new Date(sportSrc.date).toLocaleDateString("en-GB", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    });
    const timeStr = new Date(sportSrc.date).toLocaleTimeString("en-GB", {
      hour: "2-digit", minute: "2-digit",
    });

    return (
      <div className="space-y-8 pb-8 max-w-4xl mx-auto">
        <div className="glass-card text-center py-8">
          <div className="flex items-center justify-center gap-6 md:gap-12">
            <div className="flex flex-col items-center gap-3 flex-1 max-w-[140px]">
              <SafeImage src={sportSrc.teams.home.badge} alt={sportSrc.teams.home.name} width={80} height={80} type="team" />
              <span className="font-bold text-sm md:text-base">{sportSrc.teams.home.name}</span>
            </div>

            <div className="text-center">
              {isLive && <span className="status-live text-sm block mb-2">LIVE</span>}
              {isLive && sportSrc.sources && (
                <span className="text-xs text-neon-green block mb-2">
                  <Tv className="w-3 h-3 inline mr-1" />
                  {sportSrc.sources.length} streams available
                </span>
              )}
              <p className="text-4xl md:text-5xl font-black">vs</p>
              <p className="text-xs text-slate-500 mt-2">{dateStr} · {timeStr}</p>
            </div>

            <div className="flex flex-col items-center gap-3 flex-1 max-w-[140px]">
              <SafeImage src={sportSrc.teams.away.badge} alt={sportSrc.teams.away.name} width={80} height={80} type="team" />
              <span className="font-bold text-sm md:text-base">{sportSrc.teams.away.name}</span>
            </div>
          </div>
        </div>

        {sportSrc.sources && sportSrc.sources.length > 0 ? (
          <StreamPlayer streams={sportSrc.sources} matchTitle={sportSrc.title} />
        ) : (
          <div className="glass-card p-6 text-center">
            <Tv className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No streams available for this match yet</p>
            <p className="text-xs text-slate-600 mt-1">Streams appear when the match goes live</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
          <ShareButton url={url} title={sportSrc.title} />
          <CopyLinkButton url={url} />
        </div>
      </div>
    );
  }

  if (!event) return <ErrorState onRetry={load} message="Match not found" />;

  const status = getMatchStatus(event);
  const score =
    event.intHomeScore != null && event.intAwayScore != null
      ? `${event.intHomeScore} - ${event.intAwayScore}`
      : null;

  return (
    <div className="space-y-8 pb-8 max-w-3xl mx-auto">
      <div className="glass-card text-center py-10">
        <p className="text-sm text-neon-green mb-2">{event.strLeague}</p>
        <p className="text-xs text-slate-500 mb-6">{formatDate(event.dateEvent)} · {formatTime(event.strTime)}</p>

        <div className="flex items-center justify-center gap-6 md:gap-12">
          <Link href={event.idHomeTeam ? `/teams/${event.idHomeTeam}` : "#"} className="flex flex-col items-center gap-3 flex-1 max-w-[140px] group">
            <SafeImage src={event.strHomeTeamBadge} alt={event.strHomeTeam || "Home"} width={80} height={80} type="team" className="group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm md:text-base group-hover:text-neon-green">{event.strHomeTeam}</span>
          </Link>

          <div className="text-center">
            {status === "live" && <span className="status-live text-sm block mb-2">LIVE</span>}
            {status === "upcoming" && (
              <span className="text-neon-blue text-sm block mb-2">{getCountdown(event.dateEvent || "", event.strTime)}</span>
            )}
            <p className="text-4xl md:text-5xl font-black">{score ?? "vs"}</p>
            {event.strStatus && <p className="text-xs text-slate-500 mt-2">{event.strStatus}</p>}
          </div>

          <Link href={event.idAwayTeam ? `/teams/${event.idAwayTeam}` : "#"} className="flex flex-col items-center gap-3 flex-1 max-w-[140px] group">
            <SafeImage src={event.strAwayTeamBadge} alt={event.strAwayTeam || "Away"} width={80} height={80} type="team" className="group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm md:text-base group-hover:text-neon-green">{event.strAwayTeam}</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <ShareButton url={url} title={`${event.strHomeTeam} vs ${event.strAwayTeam}`} />
        <CopyLinkButton url={url} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {event.strVenue && (
          <div className="glass-card flex items-center gap-3">
            <MapPin className="w-5 h-5 text-neon-blue shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Stadium</p>
              <p className="font-medium text-sm">{event.strVenue}</p>
            </div>
          </div>
        )}
        {event.dateEvent && (
          <div className="glass-card flex items-center gap-3">
            <Calendar className="w-5 h-5 text-neon-green shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Date</p>
              <p className="font-medium text-sm">{formatDate(event.dateEvent)}</p>
            </div>
          </div>
        )}
        {event.strTime && (
          <div className="glass-card flex items-center gap-3">
            <Clock className="w-5 h-5 text-neon-purple shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Kick-off</p>
              <p className="font-medium text-sm">{formatTime(event.strTime)}</p>
            </div>
          </div>
        )}
      </div>

      {event.strDescriptionEN && (
        <section className="glass-card">
          <h2 className="font-bold mb-2">Match Info</h2>
          <p className="text-slate-400 text-sm">{event.strDescriptionEN}</p>
        </section>
      )}
    </div>
  );
}
