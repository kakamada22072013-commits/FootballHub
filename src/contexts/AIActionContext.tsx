"use client";

import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "./SettingsContext";
import { useFavourites } from "./FavouritesContext";
import { usePageContext } from "./PageContext";
import type { AIAction, AIActionType } from "@/types/ai-actions";

interface AIActionContextValue {
  executeAction: (action: AIAction) => Promise<void>;
  executeActions: (actions: AIAction[]) => Promise<void>;
}

const AIActionContext = createContext<AIActionContextValue | null>(null);

export function AIActionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { toggleTheme, toggleAnimations, setLanguage } = useSettings();
  const { toggleFavourite, removeFavourite } = useFavourites();
  const pageContext = usePageContext();

  const executeAction = useCallback(
    async (action: AIAction) => {
      console.log("Executing AI action:", action);

      switch (action.type) {
        case "navigate":
          if (action.payload?.path) {
            router.push(action.payload.path);
          }
          break;

        case "open_team":
          if (action.payload?.teamId) {
            router.push(`/teams/${action.payload.teamId}`);
          } else if (action.payload?.teamName) {
            // Search for team by name and navigate
            router.push(`/teams?q=${encodeURIComponent(action.payload.teamName)}`);
          }
          break;

        case "open_player":
          if (action.payload?.playerId) {
            router.push(`/players/${action.payload.playerId}`);
          } else if (action.payload?.playerName) {
            router.push(`/players?q=${encodeURIComponent(action.payload.playerName)}`);
          }
          break;

        case "open_league":
          if (action.payload?.leagueId) {
            router.push(`/leagues/${action.payload.leagueId}`);
          } else if (action.payload?.leagueName) {
            router.push(`/leagues?q=${encodeURIComponent(action.payload.leagueName)}`);
          }
          break;

        case "open_match":
          if (action.payload?.matchId) {
            router.push(`/matches/${action.payload.matchId}`);
          }
          break;

        case "search":
          if (action.payload?.query) {
            router.push(`/search?q=${encodeURIComponent(action.payload.query)}`);
            // Open search modal
            window.dispatchEvent(new CustomEvent("open-search-modal", { 
              detail: { query: action.payload.query } 
            }));
          }
          break;

        case "filter":
          // Dispatch filter event to current page
          window.dispatchEvent(new CustomEvent("ai-filter", { 
            detail: action.payload 
          }));
          break;

        case "sort":
          // Dispatch sort event to current page
          window.dispatchEvent(new CustomEvent("ai-sort", { 
            detail: action.payload 
          }));
          break;

        case "add_favourite":
          if (action.payload?.id && action.payload?.type && action.payload?.name) {
            toggleFavourite({
              id: action.payload.id,
              type: action.payload.type,
              name: action.payload.name,
              image: action.payload.image,
              subtitle: action.payload.subtitle,
            });
          }
          break;

        case "remove_favourite":
          if (action.payload?.id && action.payload?.type) {
            removeFavourite(action.payload.id, action.payload.type);
          }
          break;

        case "open_favourites":
          router.push("/favourites");
          break;

        case "open_settings":
          router.push("/settings");
          break;

        case "toggle_theme":
          toggleTheme();
          break;

        case "toggle_animations":
          toggleAnimations();
          break;

        case "set_language":
          if (action.payload?.language) {
            setLanguage(action.payload.language);
          }
          break;

        case "open_standings":
          if (pageContext.leagueId) {
            router.push(`/leagues/${pageContext.leagueId}#standings`);
          } else {
            router.push("/leagues");
          }
          break;

        case "open_statistics":
          if (pageContext.leagueId) {
            router.push(`/leagues/${pageContext.leagueId}#statistics`);
          } else {
            router.push("/leagues");
          }
          break;

        case "open_live_matches":
          router.push("/matches?filter=live");
          break;

        case "open_upcoming_matches":
          router.push("/matches?filter=upcoming");
          break;

        case "open_completed_matches":
          router.push("/matches?filter=finished");
          break;

        case "scroll_to":
          if (action.payload?.sectionId) {
            const element = document.getElementById(action.payload.sectionId);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }
          break;

        case "open_notifications":
          // Open notifications panel/modal
          window.dispatchEvent(new CustomEvent("open-notifications"));
          break;

        case "clear_cache":
          // Clear localStorage cache
          if (typeof window !== "undefined") {
            localStorage.clear();
            window.location.reload();
          }
          break;

        default:
          console.warn("Unknown AI action type:", action.type);
      }
    },
    [router, toggleTheme, toggleAnimations, setLanguage, toggleFavourite, removeFavourite, pageContext]
  );

  const executeActions = useCallback(
    async (actions: AIAction[]) => {
      for (const action of actions) {
        await executeAction(action);
      }
    },
    [executeAction]
  );

  return (
    <AIActionContext.Provider value={{ executeAction, executeActions }}>
      {children}
    </AIActionContext.Provider>
  );
}

export function useAIActions() {
  const ctx = useContext(AIActionContext);
  if (!ctx) throw new Error("useAIActions must be used within AIActionProvider");
  return ctx;
}
