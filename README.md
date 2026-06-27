# FootballHub AI

A premium, production-ready football platform built with Next.js 15, TypeScript, and Tailwind CSS. Live scores, teams, players, leagues, countries, favourites, and an AI football assistant — powered by [TheSportsDB API](https://www.thesportsdb.com).

## Features

- **Home** — Hero, featured teams/leagues, live & upcoming matches, trending players, statistics
- **Search** — Live search for teams, players, leagues with recent & popular searches
- **Teams / Players / Leagues** — Full detail pages with squads, honours, fixtures, tables
- **Matches** — Live, upcoming, and finished matches with match details
- **Countries** — Browse football by nation
- **Favourites** — Save teams, players, leagues (localStorage)
- **Profile** — Guest profile with stats and recently viewed
- **AI Assistant** — Floating chatbot for football Q&A and recommendations
- **Settings** — Dark/light mode, language, animations, clear cache

## Design

- Dark mode by default with glassmorphism UI
- Neon green & blue accents, smooth animations, skeleton loading
- Fully responsive (desktop, tablet, mobile)

## Prerequisites

- [Node.js](https://nodejs.org/) 18.18 or later
- npm (included with Node.js)

## Setup

```bash
cd footballhub-ai
npm install
```

Copy environment variables (API key is pre-configured with the free test key `3`):

```bash
cp .env.example .env.local
```

Get your own API key at [TheSportsDB](https://www.thesportsdb.com/api.php) and set:

```
NEXT_PUBLIC_SPORTSDB_API_KEY=your_key_here
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # UI, cards, layout, search, AI
├── contexts/      # Settings, favourites, toast, recently viewed
├── hooks/         # Debounce, infinite scroll, live clock
├── lib/           # API client, cache, constants, utils
└── types/         # TypeScript interfaces
```

## API

All data comes from TheSportsDB:

```
https://www.thesportsdb.com/api/v1/json/{API_KEY}/
```

Includes retry logic, in-memory + localStorage caching, and error handling.

## License

MIT — Data © [TheSportsDB](https://www.thesportsdb.com)
