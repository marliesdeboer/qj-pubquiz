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

## Autonomous / overnight sessions

These rules apply regardless of permission mode (including "bypass permissions"):

- Never push to `main`/`master`. Always work on a feature branch.
- Never force-push, never run destructive git commands (`reset --hard`, `clean -f`, `branch -D`).
- Do not create or merge pull requests unless explicitly asked.
- Do not delete files or directories outside of files you created during the session, unless explicitly asked.
- Do not add, remove, or upgrade dependencies unless the task requires it.
- Run `npm run build` and `npm run lint` before considering a task done; fix failures before stopping.
- If a task is ambiguous or you're blocked on a decision, leave a clear note (commit message / summary) instead of guessing destructively.
