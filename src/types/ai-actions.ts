export type AIActionType =
  | "navigate"
  | "open_team"
  | "open_player"
  | "open_league"
  | "open_match"
  | "search"
  | "filter"
  | "sort"
  | "add_favourite"
  | "remove_favourite"
  | "open_favourites"
  | "open_settings"
  | "toggle_theme"
  | "toggle_animations"
  | "set_language"
  | "open_standings"
  | "open_statistics"
  | "open_live_matches"
  | "open_upcoming_matches"
  | "open_completed_matches"
  | "scroll_to"
  | "open_notifications"
  | "clear_cache";

export interface AIAction {
  type: AIActionType;
  payload?: Record<string, any>;
  timestamp: number;
}

export interface PageContext {
  page: string;
  teamId?: string;
  teamName?: string;
  playerId?: string;
  playerName?: string;
  leagueId?: string;
  leagueName?: string;
  matchId?: string;
  country?: string;
}

export interface AIResponse {
  text: string;
  actions?: AIAction[];
  requiresConfirmation?: boolean;
}

export interface ImageContent {
  type: "image_url";
  image_url: { url: string };
}

export interface TextContent {
  type: "text";
  text: string;
}

export type ContentPart = TextContent | ImageContent;

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string | ContentPart[];
}
