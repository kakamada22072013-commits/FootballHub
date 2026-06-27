import { NextRequest, NextResponse } from "next/server";
import type { AIAction, AIResponse, PageContext } from "@/types/ai-actions";

const VALID_ACTION_TYPES = [
  "navigate", "open_team", "open_player", "open_league", "open_match",
  "search", "filter", "sort", "add_favourite", "remove_favourite",
  "open_favourites", "open_settings", "toggle_theme", "toggle_animations",
  "set_language", "open_standings", "open_statistics", "open_live_matches",
  "open_upcoming_matches", "open_completed_matches", "scroll_to",
  "open_notifications", "clear_cache",
] as const;

const LANGUAGE_PROMPTS: Record<string, string> = {
  en: "Respond in English only.",
  fr: "Réponds en Français uniquement.",
  ar: "استجب باللغة العربية فقط.",
  de: "Antworte nur auf Deutsch.",
  es: "Responde solo en Español.",
  pt: "Responda apenas em Português.",
  ru: "Отвечай только на Русском.",
  zh: "请只用中文回答。",
  ja: "日本語でのみ回答してください。",
  hi: "केवल हिंदी में उत्तर दें।",
  bn: "শুধুমাত্র বাংলায় উত্তর দিন।",
  ur: "صرف اردو میں جواب دیں۔",
};

function buildSystemPrompt(context: PageContext, language = "en"): string {
  const langInstruction = LANGUAGE_PROMPTS[language] || LANGUAGE_PROMPTS.en;
  return `You are FootballHub AI, an intelligent assistant for a football (soccer) platform. ${langInstruction}

You help users navigate, search, control settings, manage favourites, and answer football questions.

AVAILABLE ACTIONS (you MUST include them as JSON when relevant):
- navigate: { "path": "/some-url" }
- open_team: { "teamId": "...", "teamName": "..." }
- open_player: { "playerId": "...", "playerName": "..." }
- open_league: { "leagueId": "...", "leagueName": "..." }
- open_match: { "matchId": "..." }
- search: { "query": "..." }
- add_favourite: { "id": "...", "type": "team|player|league", "name": "...", "image?": "...", "subtitle?": "..." }
- remove_favourite: { "id": "...", "type": "team|player|league" }
- open_favourites: {}
- open_settings: {}
- toggle_theme: {}
- toggle_animations: {}
- set_language: { "language": "en|fr|ar" }
- open_standings: {}
- open_statistics: {}
- open_live_matches: {}
- open_upcoming_matches: {}
- open_completed_matches: {}
- scroll_to: { "sectionId": "..." }
- clear_cache: {}

CURRENT PAGE CONTEXT: ${JSON.stringify(context)}

INSTRUCTIONS:
1. Respond conversationally and concisely (1-3 sentences).
2. If the user wants to navigate, search, change settings, etc. — include the action as JSON.
3. Wrap the JSON action block in a code block with language "actions".
4. You can include multiple actions in the array.
5. If no action is needed, omit the actions block.
6. For football knowledge questions (history, stats, players), answer from your training data.
7. Use **bold** sparingly for emphasis.
8. Detect the user's language and respond in the same language.`;
}

function extractActions(text: string): AIAction[] {
  const match = text.match(/```actions\n([\s\S]*?)```/);
  if (!match) return [];
  try {
    const parsed = JSON.parse(match[1].trim());
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((a: any) => a && typeof a === "object" && VALID_ACTION_TYPES.includes(a.type))
      .map((a: any) => ({
        type: a.type,
        payload: a.payload || {},
        timestamp: a.timestamp || Date.now(),
      }));
  } catch {
    return [];
  }
}

function cleanText(text: string): string {
  return text.replace(/```actions\n[\s\S]*?```/g, "").trim();
}

interface ChatRequest {
  messages: { role: "user" | "assistant"; content: string }[];
  pageContext: PageContext;
  language?: string;
}

export async function POST(req: NextRequest) {
  const token = process.env.HF_TOKEN;
  if (!token) {
    return NextResponse.json<AIResponse>(
      { text: "AI is not configured. Please set the HF_TOKEN environment variable.", actions: [] },
      { status: 200 }
    );
  }

  try {
    const body: ChatRequest = await req.json();
    const { messages, pageContext, language = "en" } = body;

    const systemMsg = { role: "system", content: buildSystemPrompt(pageContext, language) };

    const apiMessages = [
      systemMsg,
      ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
    ];

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-7B-Instruct",
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 512,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "Unknown error");
      return NextResponse.json<AIResponse>(
        { text: `Sorry, I encountered an error: ${errText}`, actions: [] },
        { status: 200 }
      );
    }

    const json = await response.json();
    const raw = json.choices?.[0]?.message?.content || "";

    if (raw.includes("Cannot read") || json.error) {
      return NextResponse.json<AIResponse>(
        { text: "Sorry, the AI model returned an unexpected response. Please try again.", actions: [] },
        { status: 200 }
      );
    }

    const actions = extractActions(raw);
    const text = cleanText(raw);

    return NextResponse.json<AIResponse>({ text, actions });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json<AIResponse>(
      { text: `Sorry, I encountered an error: ${msg}`, actions: [] },
      { status: 200 }
    );
  }
}
