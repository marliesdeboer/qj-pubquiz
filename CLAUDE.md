# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Vite dev server → http://localhost:5173
npm run build        # tsc -b && vite build (strict: noUnusedLocals, noUnusedParameters)
npm run lint         # ESLint
npm run preview      # Serve the built dist/ locally (no PartyKit — useful for static checks)

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

**Theming:** `ThemeProvider` sets `data-theme="neutral"|"qmusic"|"joe"` plus class `theme-root` on a wrapper div based on `currentRound`. All component styles use CSS custom properties from `src/styles/themes.css`; the neutral vars double as `:root` defaults so anything outside the wrapper (e.g. `body`) still resolves. Theme-specific decoration (brand glow `--color-bg-glow`, top brand line `--topline`, ✦ sparkles via the `.sparkles` child) lives on the wrapper in `src/styles/index.css`.

**Round → theme mapping** (in `getThemeForRound()`): rounds 1 & 2 → `neutral` (the "external" rounds), round 3 → `qmusic`, round 4 → `joe` — matching the canonical round structure in `qj-quiz-content.json`. Lobby phase uses `neutral`.

**Visual design system (redesign of 11 June 2026) — dark premium base, brand color as signature accent:**
- `neutral` (rounds 1 & 2): near-black `#0B0C10`, subtle Q-red/Joe-blue corner glows + red→blue top line so both brands stay subtly present; Bebas Neue display / Barlow body
- `qmusic` (round 3): dark `#120708` with strong Q-red `#E8201E`/`#FF3B38` glow and accents, red filled controls, Anton display
- `joe` (round 4): dark navy `#070D1E` with Joe-blue `#2B72D4`/`#6DA3EB` glow and warm pink `#FF4D73` second accent, Nunito display + body, no uppercase (`--display-transform`)
- Shared: glass surfaces (`--color-surface` + 1px border + backdrop-blur), pill buttons with hover/active scale, staggered `phase-in`/`pop-in` entrance animations, `prefers-reduced-motion` respected

**Font stack:** Bebas Neue · Anton · Barlow Condensed · Barlow · Nunito — loaded in `index.html` via Google Fonts. `--font-display`, `--font-body`, `--font-display-spacing` and `--display-transform` are set per theme in `themes.css`.

**Game phases:** `lobby → question → reveal → leaderboard → question (next round) → … → finished`
- `NEXT_QUESTION` (host): lobby→question; reveal@end-of-round→leaderboard; reveal@Q19→finished; reveal otherwise→question+1
- `PREV_QUESTION` (host): question/reveal→previous question (resets answers, does not undo scores)
- `JUMP_TO_QUESTION` (host): jumps to any question index directly (resets answers, does not undo scores)
- `NEXT_ROUND` (host): leaderboard→question (increments both `currentQuestion` and `currentRound`)
- `ROUND_END_INDICES = [4, 9, 14]` (0-indexed last questions of rounds 1–3)

**Round title card:** `App.tsx` watches `gameState.phase` and `gameState.currentRound` via refs to detect `lobby→question` (round 1 start) and `leaderboard→question` (new round) transitions, then overlays `RoundTitleCard`. On player screens it auto-dismisses after 3.5 s. On the host screen it stays open and shows a "▶ Start muziek" button that triggers the round energizer (see below). Titles/subtitles come from `ROUND_TITLES`/`ROUND_SUBTITLES` in `src/data/questions.ts`.

**Round energizer music:** Each round opens with a short audio clip served from `/public/media/music_r<N>.mp3`. Config lives in `ROUND_MUSIC` (bottom of `src/data/questions.ts`) — one entry per round with `file`, `durationSec`, and `label`. Playback uses the browser `Audio` API; the host sees a "▶ Start muziek" button on the title card, players auto-dismiss after 3.5 s as before. After `durationSec` seconds the audio stops and the card closes. The host can also click anywhere on the card to skip. **To replace a clip:** drop a new MP3 in `public/media/` and update `file`/`durationSec` in `ROUND_MUSIC`.

**Host view = stage screen:** the host view is shown on the big screen for the whole room. On reveal, media + the "so what" `explanation` + `source` are shown automatically and prominently (no media button). Controls are a discreet pill bar bottom-right; the spacebar triggers the primary action (start/reveal/next) — spacebar is blocked while the round title card is showing. The live answer distribution is intentionally hidden during the question phase (answers can still be changed) and animates in at reveal.

**Host question navigator:** a fixed side panel (`.host-nav`) on the left edge shows all 20 questions grouped by round, numbered 1–20 continuously. Current question is accent-highlighted; past questions are dimmed. Clicking any number sends `JUMP_TO_QUESTION`. The panel is always visible on the host screen.

**Host PIN:** Client-side only check (`qjhost2025`) in `HostView.tsx`, remembered in `sessionStorage` (`qj-host-auth`). No server enforcement.

**Player access code:** Client-side only check in `Lobby.tsx` — players must enter a code before they see the team name form. Default code: `qjquiz` (overridable via `VITE_ACCESS_CODE` env var at build time). Granted state stored in `sessionStorage` (`qj-access-granted`). Prevents accidental public access without blocking reconnects.

**Team identity:** Each browser tab generates a stable `teamId` stored in `sessionStorage` (`qj-team-id`). Reconnecting clients rejoin with the same ID (idempotent `JOIN` handler). `onConnect` immediately sends the current `GameState` to the new socket, so late-joiners and reconnects sync without a separate request. PartyKit room name: `'qj-quiz-2025'` (hardcoded in `useGameSocket.ts`).

**Answer behavior:** Players can change their answer freely until the host triggers reveal. `SUBMIT_ANSWER` on the server overwrites any existing answer for that team. On reveal, a correct/incorrect overlay appears on the player's answer area (`player-reveal-overlay` in `PlayerView.css`): correct shows "Goed! / +100 punten", incorrect shows only "Fout" (no sub-text). The explanation text is host-only and never shown to players.

**RESET:** Clears `teams` to `[]` in addition to resetting phase/scores, so connected players land back on the lobby but must re-enter their team name. `RESET` is host-only (no server enforcement, client-side PIN gate only).

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

- **`chart`** — rendered in-app by `ChartView` (`src/components/shared/ChartView.tsx`) from `media.data`. No external calls. Supports `bar` and `donut`. One accent color (`--chart-accent`, per theme) + greys; count-up numbers and growing bars animate on reveal; Dutch number formatting (`nl-NL`). When `data` items carry their own `unit` or a `note` is present, stat cards render instead of a shared-axis bar chart; `note` text is shown to the room, so keep it audience-worthy. Optional `maxValue` (number) fixes the bar scale to a known ceiling — use `maxValue: 100` for percentage charts so bars represent their true share of 100% rather than scaling to the highest data point.
- **`video` / `image` / `audio`** — served from `/public/media/<id>.<ext>`. Default extensions: video→`mp4`, image→`png`, audio→`mp3`. Override per-question with optional `ext` field (e.g. `ext: 'jpg'` for a JPEG image). Media auto-shows on reveal; if the main file is missing the host view shows an inline error card but still renders `extraImage` if present. Keep videos under 25 MB (Cloudflare Pages per-file limit). Optional `extraImage` (filename without extension, default ext `.png`) and `extraImageExt` (e.g. `'webp'` or `'jpg'`) add a second image displayed alongside via `.host-media-multi` (flex row, items share equal width) — useful for pairing a video with a portrait photo, or two related images. The `dist/` folder is gitignored build output — never manually place media there; always use `public/media/`.
- **`poll`** — no asset; the live answer distribution from `AnswerDistribution` is the media (most-voted option gets the accent highlight, never a green "correct" mark).

Media is host-only — the player view never shows media or source.
