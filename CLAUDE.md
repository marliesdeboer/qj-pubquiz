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

## Architecture

**State model:** All authoritative game state lives in the PartyKit server (`party/server.ts`) in memory. Clients hold no state — on every incoming message they receive a full `GameState` snapshot and re-render. There is no Redux/Zustand.

**Message flow:** Clients send typed `ClientMessage` objects over WebSocket; server mutates state and calls `this.room.broadcast()` with a `STATE_UPDATE` containing the full new `GameState`.

**Routing:** No router library. `window.location.pathname === '/host'` in `App.tsx` selects between `HostView` and `PlayerView`. Cloudflare Pages SPA routing is handled by `public/_redirects`.

**Theming:** `ThemeProvider` sets `data-theme="base"|"qmusic"|"joe"` on a wrapper div based on `currentRound`. All component styles use CSS custom properties from `src/styles/themes.css` — no inline theme logic in components except for `RoundTitleCard` (brand-specific animations) and `PlayerView.css` / `AnswerButtons.css` (theme-specific layout overrides via `[data-theme="x"] .class` selectors).

**Game phases:** `lobby → question → reveal → leaderboard → question (next round) → … → finished`
- `NEXT_QUESTION` (host): lobby→question; reveal@end-of-round→leaderboard; reveal@Q19→finished; reveal otherwise→question+1
- `NEXT_ROUND` (host): leaderboard→question (increments both `currentQuestion` and `currentRound`)
- `ROUND_END_INDICES = [4, 9, 14]` (0-indexed last questions of rounds 1–3)

**Round title card:** `App.tsx` watches `gameState.phase` and `gameState.currentRound` via refs to detect `lobby→question` (round 1 start) and `leaderboard→question` (new round) transitions, then overlays `RoundTitleCard` for 3 seconds.

**Host PIN:** Client-side only check (`qjhost2025`) in `HostView.tsx`. No server enforcement.

**Opinion questions:** Q15 (`correctIndex: 2`, shown as opinion but has a most-defensible answer) and Q20 (`correctIndex: -1`, pure opinion — server skips scoring). `isOpinion: true` is metadata only; the server uses `correctIndex === -1` as the actual signal.

**Team identity:** Each browser tab generates a stable `teamId` stored in `sessionStorage` (`qj-quiz-team-id`). Reconnecting clients rejoin with the same ID (idempotent `JOIN` handler).
