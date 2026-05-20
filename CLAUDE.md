# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite, localhost:5173)
npm run build      # Type-check + production build (tsc -b && vite build)
npm run lint       # ESLint
npm run preview    # Preview production build locally
```

PartyKit server (real-time backend):
```bash
npx partykit dev   # Run PartyKit server locally alongside Vite
```

## Architecture

This is a real-time pub quiz app with two runtime layers:

**Frontend** (`src/`) — React 19 + TypeScript + Vite. Styling via Tailwind v4 (CSS-native, configured via PostCSS with `@tailwindcss/postcss` — no `tailwind.config.js`). Custom CSS variables in `src/index.css` define the design tokens (colors, typography, dark mode).

**Real-time backend** (`party/server.ts`) — PartyKit server. Handles WebSocket connections for live quiz state (questions, scores, player sync). The frontend connects via `partysocket` using `VITE_PARTYKIT_HOST` from the environment.

## Environment

Copy `.env.example` to `.env.local` and set `VITE_PARTYKIT_HOST` to your PartyKit project URL before running against a real deployment.

## Deployment

`public/_redirects` is a Netlify/Cloudflare Pages SPA redirect rule — all routes serve `index.html`.
