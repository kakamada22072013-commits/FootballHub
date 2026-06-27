export const API_BASE = "https://www.thesportsdb.com/api/v1/json";

export const API_KEY =
  process.env.NEXT_PUBLIC_SPORTSDB_API_KEY || "123";

export const FEATURED_LEAGUES = [
  { id: "4328", name: "Premier League", country: "England", slug: "premier-league" },
  { id: "4335", name: "La Liga", country: "Spain", slug: "la-liga" },
  { id: "4332", name: "Serie A", country: "Italy", slug: "serie-a" },
  { id: "4331", name: "Bundesliga", country: "Germany", slug: "bundesliga" },
  { id: "4334", name: "Ligue 1", country: "France", slug: "ligue-1" },
  { id: "4480", name: "Champions League", country: "Europe", slug: "champions-league" },
  { id: "4481", name: "Europa League", country: "Europe", slug: "europa-league" },
  { id: "4429", name: "World Cup", country: "International", slug: "world-cup" },
  { id: "4499", name: "Copa America", country: "South America", slug: "copa-america" },
  { id: "4847", name: "CAF Champions League", country: "Africa", slug: "caf-champions-league" },
  { id: "4846", name: "CAF Confederation Cup", country: "Africa", slug: "caf-confederation-cup" },
] as const;

export const FEATURED_TEAMS = [
  { id: "133604", name: "Arsenal" },
  { id: "133602", name: "Manchester United" },
  { id: "133616", name: "Chelsea" },
  { id: "133615", name: "Liverpool" },
  { id: "133739", name: "Barcelona" },
  { id: "133738", name: "Real Madrid" },
  { id: "133676", name: "Bayern Munich" },
  { id: "133630", name: "Juventus" },
  { id: "133714", name: "PSG" },
  { id: "133610", name: "Manchester City" },
] as const;

export const FEATURED_PLAYERS = [
  { id: "34145937", name: "Erling Haaland" },
  { id: "34146304", name: "Kylian Mbappé" },
  { id: "34146308", name: "Mohamed Salah" },
  { id: "34146307", name: "Harry Kane" },
  { id: "34146306", name: "Kevin De Bruyne" },
  { id: "34146305", name: "Virgil van Dijk" },
  { id: "34146303", name: "Robert Lewandowski" },
  { id: "34146302", name: "Luka Modrić" },
] as const;

export const TOP_COUNTRIES = [
  "England",
  "Spain",
  "Germany",
  "Italy",
  "France",
  "Brazil",
  "Argentina",
  "Portugal",
  "Netherlands",
  "Belgium",
  "Nigeria",
  "Egypt",
  "Morocco",
  "Senegal",
] as const;

export const POPULAR_SEARCHES = [
  "Arsenal",
  "Barcelona",
  "Real Madrid",
  "Premier League",
  "Champions League",
  "Arsenal vs Chelsea",
  "Danny Welbeck",
  "Ronaldo",
  "Haaland",
  "Mbappé",
  "Liverpool",
] as const;

export const CACHE_TTL = {
  short: 5 * 60 * 1000,
  medium: 30 * 60 * 1000,
  long: 60 * 60 * 1000,
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home", icon: "Home" },
  { href: "/teams", label: "Teams", icon: "Shield" },
  { href: "/players", label: "Players", icon: "Users" },
  { href: "/leagues", label: "Leagues", icon: "Trophy" },
  { href: "/matches", label: "Matches", icon: "Calendar" },
  { href: "/countries", label: "Countries", icon: "Globe" },
  { href: "/favourites", label: "Favourites", icon: "Heart" },
  { href: "/profile", label: "Profile", icon: "User" },
] as const;
