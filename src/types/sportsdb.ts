export interface Team {
  idTeam: string;
  strTeam: string;
  strTeamShort?: string;
  strAlternate?: string;
  intFormedYear?: string;
  strSport?: string;
  strLeague?: string;
  idLeague?: string;
  strDivision?: string;
  strManager?: string;
  strStadium?: string;
  strKeywords?: string;
  strRSS?: string;
  strStadiumThumb?: string;
  strStadiumDescription?: string;
  strStadiumLocation?: string;
  intStadiumCapacity?: string;
  strWebsite?: string;
  strFacebook?: string;
  strTwitter?: string;
  strInstagram?: string;
  strDescriptionEN?: string;
  strGender?: string;
  strCountry?: string;
  strTeamBadge?: string;
  strTeamJersey?: string;
  strTeamLogo?: string;
  strTeamFanart1?: string;
  strTeamFanart2?: string;
  strTeamFanart3?: string;
  strTeamBanner?: string;
  strYoutube?: string;
  strLocked?: string;
}

export interface Player {
  idPlayer: string;
  strPlayer: string;
  strTeam?: string;
  idTeam?: string;
  strSport?: string;
  strNationality?: string;
  dateBorn?: string;
  strNumber?: string;
  dateSigned?: string;
  strSigning?: string;
  strWage?: string;
  strOutfitter?: string;
  strKit?: string;
  strAgent?: string;
  strBirthLocation?: string;
  strDescriptionEN?: string;
  strGender?: string;
  strSide?: string;
  strPosition?: string;
  strCollege?: string;
  strFacebook?: string;
  strWebsite?: string;
  strTwitter?: string;
  strInstagram?: string;
  strYoutube?: string;
  strHeight?: string;
  strWeight?: string;
  intLoved?: string;
  strThumb?: string;
  strCutout?: string;
  strRender?: string;
  strBanner?: string;
  strFanart1?: string;
  strFanart2?: string;
  strFanart3?: string;
  strCreativeCommons?: string;
  strLocked?: string;
}

export interface League {
  idLeague: string;
  strLeague: string;
  strSport?: string;
  strLeagueAlternate?: string;
  intDivision?: string;
  idCup?: string;
  strCurrentSeason?: string;
  intFormedYear?: string;
  dateFirstEvent?: string;
  strGender?: string;
  strCountry?: string;
  strWebsite?: string;
  strFacebook?: string;
  strTwitter?: string;
  strYoutube?: string;
  strRSS?: string;
  strDescriptionEN?: string;
  strFanart1?: string;
  strFanart2?: string;
  strFanart3?: string;
  strFanart4?: string;
  strBanner?: string;
  strBadge?: string;
  strLogo?: string;
  strPoster?: string;
  strTrophy?: string;
  strNaming?: string;
  strComplete?: string;
  strLocked?: string;
}

export interface Event {
  idEvent: string;
  idAPIfootball?: string;
  strEvent?: string;
  strEventAlternate?: string;
  strFilename?: string;
  strSport?: string;
  idLeague?: string;
  strLeague?: string;
  strSeason?: string;
  strDescriptionEN?: string;
  strHomeTeam?: string;
  strAwayTeam?: string;
  intHomeScore?: string | null;
  intAwayScore?: string | null;
  intRound?: string;
  intSpectators?: string;
  strOfficial?: string;
  strTimestamp?: string;
  dateEvent?: string;
  dateEventLocal?: string;
  strTime?: string;
  strTimeLocal?: string;
  strGroup?: string;
  idHomeTeam?: string;
  strHomeTeamBadge?: string;
  idAwayTeam?: string;
  strAwayTeamBadge?: string;
  intScore?: string | null;
  intScoreVotes?: string | null;
  strResult?: string;
  idVenue?: string;
  strVenue?: string;
  strCountry?: string;
  strCity?: string;
  strPoster?: string;
  strSquare?: string;
  strFanart?: string;
  strThumb?: string;
  strBanner?: string;
  strMap?: string;
  strTweet1?: string;
  strTweet2?: string;
  strTweet3?: string;
  strVideo?: string;
  strStatus?: string;
  strPostponed?: string;
  strLocked?: string;
}

export interface TableEntry {
  idStanding?: string;
  intRank: string;
  idTeam: string;
  strTeam: string;
  strBadge?: string;
  idLeague?: string;
  strLeague?: string;
  strSeason?: string;
  strForm?: string;
  strDescription?: string;
  intPlayed: string;
  intWin: string;
  intDraw: string;
  intLoss: string;
  intGoalsFor: string;
  intGoalsAgainst: string;
  intGoalDifference: string;
  intPoints: string;
  dateUpdated?: string;
}

export interface Country {
  idAPIfootball?: string;
  idCountry?: string;
  strCountry: string;
  strFlag?: string;
}

export interface Honour {
  idHonour?: string;
  idTeam?: string;
  idPlayer?: string;
  strHonour?: string;
  strSeason?: string;
  strSport?: string;
  strTeam?: string;
  strPlayer?: string;
}

export interface FavouriteItem {
  id: string;
  type: "team" | "player" | "league";
  name: string;
  image?: string;
  subtitle?: string;
  addedAt: number;
}

export interface RecentlyViewedItem {
  id: string;
  type: "team" | "player" | "league" | "match" | "country";
  name: string;
  image?: string;
  href: string;
  viewedAt: number;
}

export interface AppSettings {
  theme: "dark" | "light";
  language: "en" | "fr" | "es" | "de" | "ar";
  animationsEnabled: boolean;
}

export type SearchResultType = "team" | "player" | "league" | "match";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  name: string;
  subtitle?: string;
  image?: string;
  href: string;
}
