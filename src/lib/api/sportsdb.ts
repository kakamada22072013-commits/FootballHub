import { API_BASE, API_KEY, CACHE_TTL } from "@/lib/constants";
import { getCached } from "@/lib/cache";
import type {
  Country,
  Event,
  Honour,
  League,
  Player,
  TableEntry,
  Team,
} from "@/types/sportsdb";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchWithRetry<T>(
  url: string,
  retries = 2,
  delay = 500
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new ApiError(`HTTP ${res.status}`, res.status);
      }

      const data = (await res.json()) as T;
      return data;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (i < retries - 1) {
        await new Promise((r) => setTimeout(r, delay * (i + 1)));
      }
    }
  }

  throw lastError ?? new ApiError("Request failed");
}

function apiUrl(path: string): string {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${API_BASE}/${API_KEY}/${clean}`;
}

function cachedFetch<T>(key: string, path: string, ttl = CACHE_TTL.medium): Promise<T> {
  return getCached(key, () => fetchWithRetry<T>(apiUrl(path)), ttl);
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchTeams(query: string): Promise<Team[]> {
  if (!query.trim()) return [];
  const data = await cachedFetch<{ teams: Team[] | null }>(
    `search_teams_${query}`,
    `searchteams.php?t=${encodeURIComponent(query)}`,
    CACHE_TTL.short
  );
  return data.teams ?? [];
}

export async function searchPlayers(query: string): Promise<Player[]> {
  if (!query.trim()) return [];
  const data = await cachedFetch<{ player: Player[] | null }>(
    `search_players_${query}`,
    `searchplayers.php?p=${encodeURIComponent(query)}`,
    CACHE_TTL.short
  );
  return data.player ?? [];
}

export async function searchLeagues(query: string): Promise<League[]> {
  if (!query.trim()) return [];
  const data = await cachedFetch<{ leagues: League[] | null }>(
    `search_leagues_${query}`,
    `search_all_leagues.php?s=Soccer`,
    CACHE_TTL.long
  );
  const all = data.leagues ?? [];
  const q = query.toLowerCase();
  return all.filter(
    (l) =>
      l.strLeague.toLowerCase().includes(q) ||
      (l.strCountry?.toLowerCase().includes(q) ?? false)
  );
}

/** Format "Arsenal vs Chelsea" → "Arsenal_vs_Chelsea" for TheSportsDB */
export function formatEventSearchQuery(query: string): string {
  return query.trim().replace(/\s+vs\.?\s+/gi, "_").replace(/\s+/g, "_");
}

export interface SearchEventsOptions {
  season?: string;
  date?: string;
  filename?: string;
}

export async function searchEvents(
  query: string,
  options: SearchEventsOptions = {}
): Promise<Event[]> {
  if (!query.trim() && !options.filename) return [];

  let path: string;
  if (options.filename) {
    path = `searchevents.php?f=${encodeURIComponent(options.filename)}`;
  } else {
    const e = formatEventSearchQuery(query);
    path = `searchevents.php?e=${encodeURIComponent(e)}`;
    if (options.season) path += `&s=${encodeURIComponent(options.season)}`;
    if (options.date) path += `&d=${encodeURIComponent(options.date)}`;
  }

  const cacheKey = `search_events_${path}`;
  const data = await cachedFetch<{ event: Event[] | null; events: Event[] | null }>(
    cacheKey,
    path,
    CACHE_TTL.short
  );
  return data.event ?? data.events ?? [];
}

export async function searchByFilename(
  filename: string,
  season?: string
): Promise<Event[]> {
  if (!filename.trim()) return [];
  let path = `searchfilename.php?e=${encodeURIComponent(filename)}`;
  if (season) path += `&s=${encodeURIComponent(season)}`;

  const data = await cachedFetch<{ event: Event[] | null; events: Event[] | null }>(
    `search_filename_${filename}_${season || ""}`,
    path,
    CACHE_TTL.short
  );
  return data.event ?? data.events ?? [];
}

// ─── Lookup ───────────────────────────────────────────────────────────────────

export async function getTeam(id: string): Promise<Team | null> {
  const data = await cachedFetch<{ teams: Team[] | null }>(
    `team_${id}`,
    `lookupteam.php?id=${id}`
  );
  return data.teams?.[0] ?? null;
}

export async function getPlayer(id: string): Promise<Player | null> {
  const data = await cachedFetch<{ players: Player[] | null }>(
    `player_${id}`,
    `lookupplayer.php?id=${id}`
  );
  return data.players?.[0] ?? null;
}

export async function getLeague(id: string): Promise<League | null> {
  const data = await cachedFetch<{ leagues: League[] | null }>(
    `league_${id}`,
    `lookupleague.php?id=${id}`
  );
  return data.leagues?.[0] ?? null;
}

export async function getTeamPlayers(teamId: string): Promise<Player[]> {
  const data = await cachedFetch<{ player: Player[] | null }>(
    `team_players_${teamId}`,
    `lookup_all_players.php?id=${teamId}`
  );
  return data.player ?? [];
}

export async function getLeagueTeams(leagueId: string): Promise<Team[]> {
  const data = await cachedFetch<{ teams: Team[] | null }>(
    `league_teams_${leagueId}`,
    `lookup_all_teams.php?id=${leagueId}`
  );
  return data.teams ?? [];
}

export async function getLeagueTable(leagueId: string, season?: string): Promise<TableEntry[]> {
  const seasonParam = season ? `&s=${season}` : "";
  const data = await cachedFetch<{ table: TableEntry[] | null }>(
    `table_${leagueId}_${season || "current"}`,
    `lookuptable.php?l=${leagueId}${seasonParam}`,
    CACHE_TTL.short
  );
  return data.table ?? [];
}

export async function getTeamHonours(teamId: string): Promise<Honour[]> {
  const data = await cachedFetch<{ honours: Honour[] | null }>(
    `honours_team_${teamId}`,
    `lookuphonours.php?id=${teamId}`
  );
  return data.honours ?? [];
}

export async function getPlayerHonours(playerId: string): Promise<Honour[]> {
  const data = await cachedFetch<{ honours: Honour[] | null }>(
    `honours_player_${playerId}`,
    `lookuphonours.php?id=${playerId}`
  );
  return data.honours ?? [];
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function getEventsByDay(date: string): Promise<Event[]> {
  const data = await cachedFetch<{ events: Event[] | null }>(
    `events_day_${date}`,
    `eventsday.php?d=${date}&s=Soccer`,
    CACHE_TTL.short
  );
  return data.events ?? [];
}

export async function getTeamNextEvents(teamId: string): Promise<Event[]> {
  const data = await cachedFetch<{ events: Event[] | null }>(
    `events_next_${teamId}`,
    `eventsnext.php?id=${teamId}`,
    CACHE_TTL.short
  );
  return data.events ?? [];
}

export async function getTeamLastEvents(teamId: string): Promise<Event[]> {
  const data = await cachedFetch<{ events: Event[] | null }>(
    `events_last_${teamId}`,
    `eventslast.php?id=${teamId}`,
    CACHE_TTL.short
  );
  return data.events ?? [];
}

export async function getLeagueNextEvents(leagueId: string): Promise<Event[]> {
  const data = await cachedFetch<{ events: Event[] | null }>(
    `events_next_league_${leagueId}`,
    `eventsnextleague.php?id=${leagueId}`,
    CACHE_TTL.short
  );
  return data.events ?? [];
}

export async function getLeaguePastEvents(leagueId: string): Promise<Event[]> {
  const data = await cachedFetch<{ events: Event[] | null }>(
    `events_past_league_${leagueId}`,
    `eventspastleague.php?id=${leagueId}`,
    CACHE_TTL.short
  );
  return data.events ?? [];
}

export async function getEvent(id: string): Promise<Event | null> {
  const data = await cachedFetch<{ events: Event[] | null }>(
    `event_${id}`,
    `lookupevent.php?id=${id}`
  );
  return data.events?.[0] ?? null;
}

export async function getLiveScores(): Promise<Event[]> {
  const today = new Date().toISOString().split("T")[0];
  const events = await getEventsByDay(today);
  return events.filter((e) => {
    const s = (e.strStatus || "").toLowerCase();
    return s.includes("live") || s.includes("1h") || s.includes("2h") || s.includes("ht");
  });
}

// ─── Countries & Leagues ──────────────────────────────────────────────────────

export async function getAllCountries(): Promise<Country[]> {
  const data = await cachedFetch<{ countries: Country[] | null }>(
    "all_countries",
    "all_countries.php",
    CACHE_TTL.long
  );
  return data.countries ?? [];
}

export async function getAllLeagues(): Promise<League[]> {
  const data = await cachedFetch<{ leagues: League[] | null }>(
    "all_leagues_soccer",
    "search_all_leagues.php?s=Soccer",
    CACHE_TTL.long
  );
  return (data.leagues ?? []).filter((l) => l.strSport === "Soccer" || !l.strSport);
}

export async function getLeaguesByCountry(country: string): Promise<League[]> {
  const data = await cachedFetch<{ countries?: League[] | null; leagues?: League[] | null }>(
    `leagues_country_${country}`,
    `search_all_leagues.php?c=${encodeURIComponent(country)}&s=Soccer`,
    CACHE_TTL.long
  );
  return data.leagues ?? data.countries ?? [];
}

export async function getTeamsByCountry(country: string): Promise<Team[]> {
  const leagues = await getLeaguesByCountry(country);
  const mainLeague = leagues[0];
  if (!mainLeague) return [];
  return getLeagueTeams(mainLeague.idLeague);
}

// ─── News (using league events as football news proxy) ────────────────────────

export async function getLatestFootballEvents(): Promise<Event[]> {
  const today = new Date();
  const events: Event[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayEvents = await getEventsByDay(dateStr);
    events.push(...dayEvents);
  }

  return events.slice(0, 30);
}
