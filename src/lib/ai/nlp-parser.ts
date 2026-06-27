import type { AIAction, AIResponse, PageContext } from "@/types/ai-actions";
import { FEATURED_TEAMS, FEATURED_LEAGUES, FEATURED_PLAYERS } from "@/lib/constants";

export function parseUserInput(
  input: string,
  context: PageContext
): AIResponse {
  const q = input.toLowerCase().trim();
  const actions: AIAction[] = [];
  let text = "";

  // Theme control
  if (q.includes("dark mode") || q.includes("enable dark")) {
    return {
      text: "I've enabled **dark mode** for you. 🌙",
      actions: [{ type: "toggle_theme", payload: {}, timestamp: Date.now() }],
    };
  }
  if (q.includes("light mode") || q.includes("enable light")) {
    return {
      text: "I've enabled **light mode** for you. ☀️",
      actions: [{ type: "toggle_theme", payload: {}, timestamp: Date.now() }],
    };
  }

  // Animations
  if (q.includes("enable animations") || q.includes("turn on animations")) {
    return {
      text: "I've enabled **animations**. ✨",
      actions: [{ type: "toggle_animations", payload: {}, timestamp: Date.now() }],
    };
  }
  if (q.includes("disable animations") || q.includes("turn off animations")) {
    return {
      text: "I've disabled **animations** for better performance.",
      actions: [{ type: "toggle_animations", payload: {}, timestamp: Date.now() }],
    };
  }

  // Language
  if (q.includes("set language") || q.includes("change language")) {
    if (q.includes("french") || q.includes("français")) {
      return {
        text: "I've changed the language to **French**. 🇫🇷",
        actions: [{ type: "set_language", payload: { language: "fr" }, timestamp: Date.now() }],
      };
    }
    if (q.includes("spanish") || q.includes("español")) {
      return {
        text: "I've changed the language to **Spanish**. 🇪🇸",
        actions: [{ type: "set_language", payload: { language: "es" }, timestamp: Date.now() }],
      };
    }
    if (q.includes("german") || q.includes("deutsch")) {
      return {
        text: "I've changed the language to **German**. 🇩🇪",
        actions: [{ type: "set_language", payload: { language: "de" }, timestamp: Date.now() }],
      };
    }
    if (q.includes("arabic") || q.includes("العربية")) {
      return {
        text: "I've changed the language to **Arabic**. 🇸🇦",
        actions: [{ type: "set_language", payload: { language: "ar" }, timestamp: Date.now() }],
      };
    }
    if (q.includes("english")) {
      return {
        text: "I've changed the language to **English**. 🇬🇧",
        actions: [{ type: "set_language", payload: { language: "en" }, timestamp: Date.now() }],
      };
    }
  }

  // Navigation to pages
  if (q.includes("open settings") || q.includes("go to settings")) {
    return {
      text: "Opening **Settings** for you. ⚙️",
      actions: [{ type: "open_settings", payload: {}, timestamp: Date.now() }],
    };
  }
  if (q.includes("open favourites") || q.includes("go to favourites") || q.includes("my favorites")) {
    return {
      text: "Opening your **Favourites**. ❤️",
      actions: [{ type: "open_favourites", payload: {}, timestamp: Date.now() }],
    };
  }

  // Matches
  if (q.includes("live matches") || q.includes("live scores") || q.includes("today's matches")) {
    return {
      text: "Showing you **live matches** right now. ⚽",
      actions: [{ type: "open_live_matches", payload: {}, timestamp: Date.now() }],
    };
  }
  if (q.includes("upcoming matches") || q.includes("future matches") || q.includes("next matches")) {
    return {
      text: "Showing you **upcoming matches**. 📅",
      actions: [{ type: "open_upcoming_matches", payload: {}, timestamp: Date.now() }],
    };
  }
  if (q.includes("completed matches") || q.includes("finished matches") || q.includes("past matches")) {
    return {
      text: "Showing you **completed matches**. ✅",
      actions: [{ type: "open_completed_matches", payload: {}, timestamp: Date.now() }],
    };
  }

  // Standings and statistics
  if (q.includes("standings") || q.includes("table") || q.includes("league table")) {
    if (context.leagueId) {
      return {
        text: "Opening the **standings** for this league. 📊",
        actions: [{ type: "open_standings", payload: {}, timestamp: Date.now() }],
      };
    }
    return {
      text: "I'll show you the **standings**. Please select a league first, or I can take you to the leagues page.",
      actions: [{ type: "navigate", payload: { path: "/leagues" }, timestamp: Date.now() }],
    };
  }
  if (q.includes("statistics") || q.includes("stats")) {
    if (context.leagueId) {
      return {
        text: "Opening **statistics** for this league. 📈",
        actions: [{ type: "open_statistics", payload: {}, timestamp: Date.now() }],
      };
    }
    return {
      text: "I'll show you **statistics**. Please select a league first.",
      actions: [{ type: "navigate", payload: { path: "/leagues" }, timestamp: Date.now() }],
    };
  }

  // Search
  if (q.startsWith("search for") || q.startsWith("find") || q.startsWith("look for")) {
    const searchQuery = q.replace(/^(search for|find|look for)\s+/i, "").trim();
    if (searchQuery) {
      return {
        text: `Searching for **${searchQuery}**... 🔍`,
        actions: [{ type: "search", payload: { query: searchQuery }, timestamp: Date.now() }],
      };
    }
  }

  // Team navigation
  const teamMatch = FEATURED_TEAMS.find((t) => 
    q.includes(t.name.toLowerCase()) || 
    q.includes(t.name.toLowerCase().replace(/\s/g, ""))
  );
  if (teamMatch && (q.includes("open") || q.includes("show") || q.includes("go to") || q.includes("take me to"))) {
    return {
      text: `Opening **${teamMatch.name}** page. ⚽`,
      actions: [{ type: "open_team", payload: { teamId: teamMatch.id, teamName: teamMatch.name }, timestamp: Date.now() }],
    };
  }

  // League navigation
  const leagueMatch = FEATURED_LEAGUES.find((l) => 
    q.includes(l.name.toLowerCase()) || 
    q.includes(l.slug.toLowerCase()) ||
    (l.name.toLowerCase().includes("premier") && q.includes("premier")) ||
    (l.name.toLowerCase().includes("la liga") && q.includes("la liga")) ||
    (l.name.toLowerCase().includes("champions") && q.includes("champions"))
  );
  if (leagueMatch && (q.includes("open") || q.includes("show") || q.includes("go to") || q.includes("take me to"))) {
    return {
      text: `Opening **${leagueMatch.name}** page. 🏆`,
      actions: [{ type: "open_league", payload: { leagueId: leagueMatch.id, leagueName: leagueMatch.name }, timestamp: Date.now() }],
    };
  }

  // Player navigation
  const playerMatch = FEATURED_PLAYERS.find((p) => 
    q.includes(p.name.toLowerCase()) || 
    q.includes(p.name.toLowerCase().replace(/\s/g, "").toLowerCase())
  );
  if (playerMatch && (q.includes("open") || q.includes("show") || q.includes("go to") || q.includes("take me to"))) {
    return {
      text: `Opening **${playerMatch.name}** page. ⭐`,
      actions: [{ type: "open_player", payload: { playerId: playerMatch.id, playerName: playerMatch.name }, timestamp: Date.now() }],
    };
  }

  // Add to favourites
  if (q.includes("add") && q.includes("favourite") || q.includes("add") && q.includes("favorite")) {
    if (context.teamId && context.teamName) {
      return {
        text: `Added **${context.teamName}** to your favourites! ❤️`,
        actions: [{ 
          type: "add_favourite", 
          payload: { 
            id: context.teamId, 
            type: "team", 
            name: context.teamName 
          }, 
          timestamp: Date.now() 
        }],
      };
    }
    if (teamMatch) {
      return {
        text: `Adding **${teamMatch.name}** to your favourites! ❤️`,
        actions: [{ 
          type: "add_favourite", 
          payload: { 
            id: teamMatch.id, 
            type: "team", 
            name: teamMatch.name 
          }, 
          timestamp: Date.now() 
        }],
      };
    }
    return {
      text: "I can add teams, players, or leagues to your favourites. Please specify which one, or navigate to a page first.",
    };
  }

  // Remove from favourites
  if (q.includes("remove") && q.includes("favourite") || q.includes("remove") && q.includes("favorite")) {
    if (context.teamId) {
      return {
        text: "Removed from your favourites.",
        actions: [{ 
          type: "remove_favourite", 
          payload: { id: context.teamId, type: "team" }, 
          timestamp: Date.now() 
        }],
      };
    }
    return {
      text: "I can remove items from your favourites. Please navigate to the item first.",
    };
  }

  // Context-aware responses
  if (q.includes("compare") || q.includes("similar")) {
    if (context.teamName) {
      return {
        text: `I can help you compare **${context.teamName}** with other teams. Which team would you like to compare it with?`,
      };
    }
    if (context.playerName) {
      return {
        text: `I can help you compare **${context.playerName}** with other players. Which player would you like to compare with?`,
      };
    }
    return {
      text: "I can help you compare teams or players. Please navigate to a team or player page first.",
    };
  }

  // Football knowledge responses
  if (q.includes("premier league") || q.includes("epl")) {
    return {
      text: "The **Premier League** is England's top division — one of the most competitive leagues globally. Top clubs include Manchester City, Arsenal, Liverpool, and Manchester United. Would you like me to open the Premier League page?",
      actions: [{ 
        type: "open_league", 
        payload: { leagueId: "4328", leagueName: "Premier League" }, 
        timestamp: Date.now() 
      }],
    };
  }
  if (q.includes("la liga") || q.includes("spain")) {
    return {
      text: "**La Liga** features Real Madrid and Barcelona among the world's greatest clubs. Known for technical football and legendary rivalries like El Clásico. Want me to take you there?",
      actions: [{ 
        type: "open_league", 
        payload: { leagueId: "4335", leagueName: "La Liga" }, 
        timestamp: Date.now() 
      }],
    };
  }
  if (q.includes("champions league") || q.includes("ucl")) {
    return {
      text: "The **UEFA Champions League** is Europe's premier club competition. Real Madrid holds the record for most titles. Shall I open the Champions League section?",
      actions: [{ 
        type: "open_league", 
        payload: { leagueId: "4480", leagueName: "Champions League" }, 
        timestamp: Date.now() 
      }],
    };
  }
  if (q.includes("world cup")) {
    return {
      text: "The **FIFA World Cup** is football's biggest tournament, held every four years. Brazil leads with 5 titles. Argentina are the current champions. Want to explore World Cup data?",
      actions: [{ 
        type: "open_league", 
        payload: { leagueId: "4429", leagueName: "World Cup" }, 
        timestamp: Date.now() 
      }],
    };
  }

  // Team recommendations
  if (q.includes("team") || q.includes("club")) {
    const teams = FEATURED_TEAMS.slice(0, 5).map((t) => t.name).join(", ");
    return {
      text: `Here are some elite teams to explore: **${teams}**. I can open any of these for you — just say "Open [team name]"`,
    };
  }

  // Player recommendations
  if (q.includes("player") || q.includes("star")) {
    const players = FEATURED_PLAYERS.slice(0, 5).map((p) => p.name).join(", ");
    return {
      text: `Top players to watch include **${players}**. I can open any player's page — just ask!`,
    };
  }

  // League recommendations
  if (q.includes("league") || q.includes("competition") || q.includes("recommend")) {
    const leagues = FEATURED_LEAGUES.slice(0, 6).map((l) => l.name).join(", ");
    return {
      text: `I'd recommend following: **${leagues}**. Each offers unique football culture and world-class talent. Want me to open any of these?`,
    };
  }

  // Greetings
  if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
    return {
      text: "Hello! 👋 I'm your **FootballHub AI** assistant. I can help you:\n\n• **Navigate** to teams, players, leagues, matches\n• **Search** for anything football-related\n• **Control settings** like dark mode and language\n• **Manage favourites**\n• **Answer football questions**\n\nWhat would you like to do?",
    };
  }

  // Help
  if (q.includes("help") || q.includes("what can you do")) {
    return {
      text: "I can help you with:\n\n**Navigation:**\n• \"Open Real Madrid\" — Opens team page\n• \"Show me Barcelona\" — Navigates to team\n• \"Open Champions League\" — Opens league\n• \"Show today's matches\" — Shows live matches\n\n**Settings:**\n• \"Enable dark mode\" — Changes theme\n• \"Set language to Spanish\" — Changes language\n• \"Disable animations\" — Turns off animations\n\n**Favourites:**\n• \"Add to favourites\" — Adds current item\n• \"Open my favourites\" — Shows favourites\n\n**Search:**\n• \"Search for Mbappe\" — Performs search\n\n**Football Knowledge:**\n• Ask about any team, player, or league\n• Get recommendations and comparisons",
    };
  }

  // Default response
  return {
    text: "I'm your FootballHub AI assistant! I can help you navigate the platform, search for teams/players/leagues, control settings, manage favourites, and answer football questions.\n\nTry saying:\n• \"Open Real Madrid\"\n• \"Show today's matches\"\n• \"Enable dark mode\"\n• \"Search for Haaland\"\n• \"Add to favourites\"",
  };
}
