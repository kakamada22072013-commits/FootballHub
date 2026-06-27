export interface SportSRCMatch {
  id: string;
  title: string;
  category: string;
  date: number;
  popular: boolean;
  poster?: string;
  teams: {
    home: { name: string; badge?: string };
    away: { name: string; badge?: string };
  };
}

export interface SportSRCResponse {
  success: boolean;
  data: SportSRCMatch[];
}

const API_BASE = "https://api.sportsrc.org";

async function fetchMatches(): Promise<SportSRCMatch[]> {
  const res = await fetch(`${API_BASE}/?data=matches&category=football`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`SportSRC API error: ${res.status}`);
  const json: SportSRCResponse = await res.json();
  return json.data || [];
}

export async function getLiveMatches(): Promise<SportSRCMatch[]> {
  const all = await fetchMatches();
  const now = Date.now();
  const twoHours = 2 * 60 * 60 * 1000;
  return all.filter((m) => Math.abs(m.date - now) < twoHours);
}

export async function getUpcomingMatches(): Promise<SportSRCMatch[]> {
  const all = await fetchMatches();
  const now = Date.now();
  return all.filter((m) => m.date > now).sort((a, b) => a.date - b.date);
}

export async function getFinishedMatches(): Promise<SportSRCMatch[]> {
  const all = await fetchMatches();
  const now = Date.now();
  return all.filter((m) => m.date < now && m.date > now - 7 * 24 * 60 * 60 * 1000);
}

export interface SportSRCStream {
  id: string;
  streamNo: number;
  language: string;
  hd: boolean;
  embedUrl: string;
  source: string;
  viewers: number;
}

export interface SportSRCMatchDetail extends SportSRCMatch {
  sources: SportSRCStream[];
}

export async function getMatchDetail(id: string): Promise<SportSRCMatchDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/?data=detail&category=football&id=${encodeURIComponent(id)}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function searchSportSRC(query: string): Promise<SportSRCMatch[]> {
  const all = await fetchMatches();
  const q = query.toLowerCase();
  return all.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      m.teams.home.name.toLowerCase().includes(q) ||
      m.teams.away.name.toLowerCase().includes(q)
  );
}
