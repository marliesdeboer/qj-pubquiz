# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Vite dev server → http://localhost:5173
npm run build        # tsc -b && vite build (strict: noUnusedLocals, noUnusedParameters)
npm run lint         # ESLint

npx partykit dev     # PartyKit WebSocket server → localhost:1999 (run alongside npm dev)
npx partykit deploy  # Deploy server to partykit.dev cloud
```

Both servers must run simultaneously for local development. The Vite frontend connects to `VITE_PARTYKIT_HOST` (falls back to `localhost:1999`).

**URLs:** `http://localhost:5173` (speler) and `http://localhost:5173/host` (host, PIN: `qjhost2025`).

## Deployment

- Frontend: Cloudflare Pages — build command `npm run build`, output `dist`
- Backend: PartyKit — `npx partykit deploy` → `your-project.username.partykit.dev`
- Set `VITE_PARTYKIT_HOST=your-project.username.partykit.dev` in Cloudflare Pages environment variables

## Architecture

**State model:** All authoritative game state lives in the PartyKit server (`party/server.ts`) in memory. Clients hold no state — on every incoming message they receive a full `GameState` snapshot and re-render. There is no Redux/Zustand.

**Message flow:** Clients send typed `ClientMessage` objects over WebSocket; server mutates state and calls `this.room.broadcast()` with a `STATE_UPDATE` containing the full new `GameState`. Both `src/types/game.ts` and `party/server.ts` import from `src/data/questions.ts` — questions are the single source of truth shared by client and server.

**Routing:** No router library. `window.location.pathname === '/host'` in `App.tsx` selects between `HostView` and `PlayerView`. Cloudflare Pages SPA routing is handled by `public/_redirects`.

**Theming:** `ThemeProvider` sets `data-theme="base"|"qmusic"|"joe"` on a wrapper div based on `currentRound`. All component styles use CSS custom properties from `src/styles/themes.css`. Theme-specific layout overrides live in the component CSS files via `[data-theme="x"] .class` selectors — not inline in components — except `RoundTitleCard` which has brand-specific animations per class.

**Round → theme mapping** (in `getThemeForRound()`): rounds 1 & 3 → `qmusic`, rounds 2 & 4 → `joe`. The `base` theme is defined but unused — all rounds use Q or Joe styling. Lobby phase uses round 1's theme (qmusic/red).

**Visual design system (as of June 2026) — identical structure, only colors differ:**
- `qmusic` (rounds 1 & 3): Q-red `#E8201E` bg, diagonal stripe texture (`repeating-linear-gradient -45deg`, 6% dark), corner ✦ sparkles via `::before`/`::after` on the theme wrapper (fixed, `clamp(1.2rem,3.5vw,2rem)`, 55% opacity) + bottom-right via `.player-answers-area::after`, ghost circle behind answer buttons via `.player-answers-area::before`, ghost outline pill buttons (selected = white with red text), Bebas Neue display / Barlow body
- `joe` (rounds 2 & 4): Joe-blue `#1F5FBF` bg, same diagonal stripe + sparkles + ghost circle, selected = white with blue text, hot-pink `#E8365D` accent, Nunito display + body

**Font stack:** Bebas Neue · Barlow Condensed · Barlow · Montserrat · Nunito · DM Sans — all loaded in `index.html` via Google Fonts. `--font-display` and `--font-body` CSS variables are set per theme in `themes.css`.

**Game phases:** `lobby → question → reveal → leaderboard → question (next round) → … → finished`
- `NEXT_QUESTION` (host): lobby→question; reveal@end-of-round→leaderboard; reveal@Q19→finished; reveal otherwise→question+1
- `NEXT_ROUND` (host): leaderboard→question (increments both `currentQuestion` and `currentRound`)
- `ROUND_END_INDICES = [4, 9, 14]` (0-indexed last questions of rounds 1–3)

**Round title card:** `App.tsx` watches `gameState.phase` and `gameState.currentRound` via refs to detect `lobby→question` (round 1 start) and `leaderboard→question` (new round) transitions, then overlays `RoundTitleCard` for 3 seconds.

**Host PIN:** Client-side only check (`qjhost2025`) in `HostView.tsx`. No server enforcement.

**Team identity:** Each browser tab generates a stable `teamId` stored in `sessionStorage` (`qj-quiz-team-id`). Reconnecting clients rejoin with the same ID (idempotent `JOIN` handler).

**Answer behavior:** Players can change their answer freely until the host triggers reveal. `SUBMIT_ANSWER` on the server overwrites any existing answer for that team. On reveal, a GOED/FOUT overlay appears on the player's answer area (`player-reveal-overlay` in `PlayerView.css`); the explanation text is host-only and never shown to players.

## Question data model

`qj-quiz-content.json` in the repo root is the canonical content source (human-readable JSON with full metadata, structure rationale, and scoring notes). `src/data/questions.ts` is the implementation used by both client and server — keep them in sync when editing questions.

Questions are defined in `src/data/questions.ts` and typed in `src/types/game.ts`. Each question has:

- `id` — stable string key `'V1'`–`'V20'`; used as React key and in media file paths
- `type` — `'quiz'` or `'poll'`
- `question` — question text (Dutch)
- `options` — 2 or 4 answer strings; UI renders A/B/C/D labels
- `answerIndex` — 0-based correct answer index; **`null` for polls** (no correct answer)
- `explanation` — reveal text shown after closing the question
- `source` — citation shown below media on the host view
- `media` — see below

**Quiz vs poll scoring (server-side):**
- `type: 'quiz'` → `POINTS_PER_CORRECT` (100) for the correct answer
- `type: 'poll'` → `POLL_PARTICIPATION_POINTS` (10) for everyone who votes; no correct marking ever shown
- V15 and V20 are the two polls (end of rounds 3 and 4)

## Media

Each question has a `media` field typed as `MediaContent` (discriminated union on `type`):

- **`chart`** — rendered in-app by `ChartView` (`src/components/shared/ChartView.tsx`) from `media.data`. No external calls. Supports `bar` and `donut` chart types. When `data` items have mixed `unit` fields or a `note` is present, `ChartView` renders stat cards instead of a shared-axis bar chart.
- **`video` / `image` / `audio`** — served from `/public/media/<id>.<ext>` (e.g. `V3.mp4`). Files must be downloaded manually before the session. A "▶ Toon media" button appears in `HostView` after reveal; if the file is missing the button silently disappears (via `onError`). See `public/media/media-manifest.json` for the list of expected files and search terms.
- **`poll`** — no asset; the live answer distribution from `AnswerDistribution` is the media.

Media is host-only — the player view never shows media or source.
