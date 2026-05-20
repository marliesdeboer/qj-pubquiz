# Q&J Pubquiz — Design Spec
*2026-05-20*

## Overview

Real-time multiplayer pub quiz for a Q&J leadership session. ~20 players in 4 teams, all on laptops in one room. 4 rounds, 20 questions. Hosted on Cloudflare Pages (frontend) + PartyKit cloud (realtime server).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Realtime | PartyKit (WebSocket, in-memory state) |
| Hosting | Cloudflare Pages |
| Styling | Tailwind CSS + custom CSS variables for theming |
| Fonts | Google Fonts (Bebas Neue, DM Sans, Montserrat, Nunito) |

---

## Architecture

### State management
All authoritative game state lives on the PartyKit server in memory. Clients hold no local state — on every incoming message they receive a full `GameState` snapshot and re-render. No Zustand, no Redux. Just `useState` + the socket hook.

### Theming
Hybrid approach: CSS custom properties handle colors, fonts, and spacing. A `ThemeProvider` component reads `currentRound` from game state and sets `data-theme="base" | "qmusic" | "joe"` on a wrapper div. Special brand moments (round title cards, logo animations) use dedicated components rendered only in that theme.

### Routing
- `/` — Player view
- `/host` — Host view (PIN-protected client-side: `qjhost2025`)

---

## Project Structure

```
src/
  main.tsx
  App.tsx                    # routing: / → Player, /host → Host
  data/
    questions.ts             # all 20 questions hardcoded
  components/
    host/
      HostView.tsx
      AnswerDistribution.tsx  # live bar chart
      Leaderboard.tsx
    player/
      PlayerView.tsx
      Lobby.tsx
      QuestionCard.tsx
      AnswerButtons.tsx
    shared/
      RoundTitleCard.tsx      # brand-specific transition card
      Timer.tsx
      ThemeProvider.tsx
  hooks/
    useGameSocket.ts          # PartyKit connection + message dispatch
  styles/
    themes.css                # CSS variable sets per data-theme
party/
  server.ts                   # PartyKit server
public/
  _redirects                  # SPA routing for Cloudflare Pages
.env.example
README.md
```

---

## Game State (TypeScript)

```typescript
type Phase = 'lobby' | 'question' | 'reveal' | 'leaderboard' | 'finished'

type Team = {
  id: string
  name: string
  score: number
}

type GameState = {
  phase: Phase
  currentQuestion: number   // 0-indexed, 0–19
  currentRound: number      // 1–4
  teams: Team[]
  answers: { teamId: string; answer: string }[]
}
```

State lives in memory for the session. On reconnect the server sends current state immediately so late joiners are instantly caught up.

---

## PartyKit Message Protocol

### Client → Server
```typescript
{ type: 'JOIN',            teamName: string }
{ type: 'SUBMIT_ANSWER',   answer: string;   isHost: false }
{ type: 'NEXT_QUESTION',   isHost: true }
{ type: 'REVEAL',          isHost: true }
{ type: 'NEXT_ROUND',      isHost: true }
{ type: 'RESET',           isHost: true }
```

### Server → All clients (broadcast)
```typescript
{ type: 'STATE_UPDATE', state: GameState }
```

The server checks `isHost: true` on privileged messages and ignores them from regular clients.

---

## Host View

**Access:** `/host`, PIN `qjhost2025` (client-side check)

**Layout:** two-panel
- Left: current question text, countdown timer, live answer distribution (bar chart updating in real-time as teams submit)
- Right: control buttons + mini leaderboard

**Controls:**
| Button | Active when |
|---|---|
| Volgende vraag | phase = `reveal` |
| Onthul antwoord | phase = `question` |
| Volgende ronde | phase = `leaderboard` |
| Reset game | always |

**After each question:** mini leaderboard flash on host screen (3s), then host manually advances.

**After each round:** full leaderboard on all screens.

---

## Player View

**Five states:**

1. **Lobby** — enter team name, see list of joined teams, wait for host
2. **Question active** — question text + 4 answer buttons + countdown timer. Clicking an answer locks it and sends `SUBMIT_ANSWER`
3. **Locked** — "Antwoord verstuurd! ⏳" until host reveals
4. **Reveal** — correct answer highlighted green, team's answer shown as correct/incorrect, current team score displayed, explanation text shown
5. **Leaderboard** — full leaderboard on all screens after each round (30s), then host triggers theme transition + next round

---

## Round Structure & Timers

| Round | Theme | Timer |
|---|---|---|
| 1 — De wereld verandert | Base (dark) | 25s |
| 2 — Hoe doen anderen het? | Base (dark) | 25s |
| 3 — Q-ronde | Qmusic | 20s |
| 4 — Joe-ronde | Joe | 25s |

---

## Theme Specs

### Base (Rounds 1 & 2)
- Background: `#0A0A0F`
- Accent: `#E8E8E8`
- Font display: Bebas Neue
- Font body: DM Sans
- Timer bar: white → red in final 5s

### Qmusic (Round 3)
- Background: `#ffffff` (white)
- Primary: `#E8201E` (Qmusic red)
- Question area: red banner header, white answer section
- Font: Montserrat 800/900 (uppercase)
- Buttons: white with grey border; selected = black fill
- Timer: red, turns darker red in final 5s
- Round title card: white screen, red Q logo animation, round title slams in

### Joe (Round 4)
- Background: `#2B72D4` (cobalt blue)
- Accent: `#E8365D` (pink/coral)
- Question area: blue hero with decorative circles, white answer section below
- Font: Nunito 800/900 (rounded)
- Buttons: white bg, blue text, pill-shaped (border-radius: 30px); selected = blue fill white text
- Timer: white, turns coral in final 5s
- Round title card: blue screen, Joe logo fades in, soft glow

### Theme transitions
Full-screen animated wipe (1.5s) when round changes, before the round title card appears.

---

## Opinion Questions (Q15 & Q20)

- Q15: show live distribution to everyone before revealing "most defensible" answer (C). Host reads split aloud.
- Q20: show live distribution only. No correct answer revealed. Host reads split aloud and bridges to strategy session.

---

## App Flow

1. **Lobby** — teams join, host sees list build up
2. **Host starts** → `NEXT_QUESTION` → all players see Q1 simultaneously
3. **Question phase** — timer counts down, teams click answer (locked immediately), host sees live bar chart
4. **Reveal** → `REVEAL` → correct answer shown on all screens + explanation + scores update
5. **Mini leaderboard** — 3s flash on host screen
6. **Repeat** for Q2–Q5
7. **End of round** → `NEXT_ROUND` → full leaderboard on all screens (30s) → theme transition animation → round title card
8. **Repeat** for rounds 2–4
9. **Q20** — opinion question, host reads distribution, bridges to session
10. **End screen** — final leaderboard + confetti + "Tot straks in de sessie!"

---

## Deployment

- **Frontend:** GitHub → Cloudflare Pages. Build: `npm run build`, output: `dist`
- **PartyKit:** `npx partykit deploy` (free tier)
- **SPA routing:** `public/_redirects` → `/* /index.html 200`
- **Env var:** `VITE_PARTYKIT_HOST` set in Cloudflare Pages dashboard

---

## Clarifications Resolved

- Timer R1 & R2: **25 seconds**
- Game reset: **yes**, button always visible in host view
- GitHub repo: **already created** by user
