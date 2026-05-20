# Q&J Pubquiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real-time multiplayer pub quiz web app for ~20 players in 4 teams, with Qmusic and Joe brand theming, hosted on Cloudflare Pages + PartyKit.

**Architecture:** All game state lives on a PartyKit server in memory; clients receive full `GameState` snapshots on every update and re-render with no local state management library. A `ThemeProvider` sets `data-theme` on a wrapper div to switch CSS variable sets between rounds; special brand moments (round title cards) are separate components rendered conditionally by theme.

**Tech Stack:** React 18, Vite, TypeScript, PartyKit + partysocket, CSS custom properties (no Tailwind needed — theming is variable-based), Google Fonts, canvas-confetti, Cloudflare Pages.

---

## File Map

```
/                              (project root)
├── index.html                 Google Fonts imports, root div
├── vite.config.ts
├── tsconfig.json
├── package.json
├── .env.example
├── public/
│   └── _redirects             SPA routing for Cloudflare Pages
├── party/
│   └── server.ts              PartyKit server — all game logic
└── src/
    ├── main.tsx               ReactDOM.createRoot
    ├── App.tsx                Route: / → PlayerView, /host → HostView
    ├── types/
    │   └── game.ts            GameState, Question, Team, message types
    ├── data/
    │   └── questions.ts       All 20 questions hardcoded
    ├── hooks/
    │   └── useGameSocket.ts   PartyKit connection + state
    ├── components/
    │   ├── shared/
    │   │   ├── ThemeProvider.tsx  data-theme switcher
    │   │   ├── Timer.tsx          countdown + progress bar
    │   │   └── RoundTitleCard.tsx brand-specific transition card
    │   ├── player/
    │   │   ├── PlayerView.tsx     state machine: lobby/question/locked/reveal/leaderboard
    │   │   ├── Lobby.tsx          team name entry
    │   │   ├── AnswerButtons.tsx  4 answer buttons with states
    │   │   └── EndScreen.tsx      final leaderboard + confetti
    │   └── host/
    │       ├── HostView.tsx       PIN gate + host layout
    │       ├── AnswerDistribution.tsx  live bar chart
    │       └── Leaderboard.tsx    sorted team scores
    └── styles/
        ├── index.css             global reset + font imports
        └── themes.css            CSS variable sets per data-theme
```

---

## Task 1: Scaffold the project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- Create: `src/main.tsx`

- [ ] **Step 1: Initialise Vite project**

Run in `/Users/marliesdeboer/Desktop/Q & Joe pubquiz`:
```bash
npm create vite@latest . -- --template react-ts
```
Answer "y" if asked to overwrite (the dir has only .claude/).

- [ ] **Step 2: Install dependencies**
```bash
npm install
npm install partykit partysocket canvas-confetti
npm install --save-dev @types/canvas-confetti
```

- [ ] **Step 3: Update `index.html`**

Replace the generated `index.html` with:
```html
<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Q&J Quiz</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@700;800;900&family=Nunito:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Create `src/main.tsx`**
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 5: Create `public/_redirects`**
```
/* /index.html 200
```

- [ ] **Step 6: Create `.env.example`**
```
VITE_PARTYKIT_HOST=your-project.username.partykit.dev
```

- [ ] **Step 7: Verify TypeScript compiles**
```bash
npm run build
```
Expected: build succeeds (App.tsx doesn't exist yet — create a stub `src/App.tsx` that returns `<div>stub</div>` if needed).

- [ ] **Step 8: Commit**
```bash
git init
git add .
git commit -m "chore: scaffold Vite + React + TS project"
```

---

## Task 2: Define types

**Files:**
- Create: `src/types/game.ts`

- [ ] **Step 1: Create `src/types/game.ts`**
```typescript
export type Phase =
  | 'lobby'
  | 'question'
  | 'reveal'
  | 'leaderboard'
  | 'finished'

export type Team = {
  id: string
  name: string
  score: number
}

export type Answer = {
  teamId: string
  answer: string
}

export type GameState = {
  phase: Phase
  currentQuestion: number  // 0-indexed (0–19)
  currentRound: number     // 1–4
  teams: Team[]
  answers: Answer[]
}

export type Question = {
  id: number           // 1–20
  round: number        // 1–4
  text: string
  options: string[]    // 2 items for T/F, 4 items otherwise
  correctIndex: number // 0-based; -1 = no correct (Q20 pure opinion)
  explanation: string
  isOpinion?: boolean  // Q15 and Q20
}

// Client → Server messages
export type ClientMessage =
  | { type: 'JOIN'; teamId: string; teamName: string }
  | { type: 'SUBMIT_ANSWER'; teamId: string; answer: string }
  | { type: 'NEXT_QUESTION'; isHost: true }
  | { type: 'REVEAL'; isHost: true }
  | { type: 'NEXT_ROUND'; isHost: true }
  | { type: 'RESET'; isHost: true }

// Server → Client messages
export type ServerMessage = {
  type: 'STATE_UPDATE'
  state: GameState
}
```

- [ ] **Step 2: Verify**
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**
```bash
git add src/types/game.ts
git commit -m "feat: add game types"
```

---

## Task 3: Add questions data

**Files:**
- Create: `src/data/questions.ts`

- [ ] **Step 1: Create `src/data/questions.ts`**
```typescript
import type { Question } from '../types/game'

export const QUESTIONS: Question[] = [
  // ── ROUND 1: De wereld verandert ──────────────────────────────────
  {
    id: 1, round: 1,
    text: 'Hoeveel procent van de Nederlanders luistert nog dagelijks lineair radio?',
    options: ['72%', '58%', '44%', '31%'],
    correctIndex: 1,
    explanation: 'NLO 2024. Was 10 jaar geleden nog boven de 75%. De daling is structureel, niet conjunctureel.',
  },
  {
    id: 2, round: 1,
    text: 'Spotify heeft in Nederland meer dagelijkse gebruikers dan alle radiozenders gecombineerd. Waar of niet waar?',
    options: ['Waar', 'Niet waar'],
    correctIndex: 0,
    explanation: 'Spotify NL: ~5,5M dagelijkse gebruikers. Gecombineerd dagelijks radiobereik: ~4,8M uniek. Kantelpunt was rond 2022.',
  },
  {
    id: 3, round: 1,
    text: 'In welk land is een AI-gegenereerde radiopresentator al live op een commerciële zender te horen?',
    options: ['Japan', 'Duitsland', 'Portugal', 'Polen'],
    correctIndex: 2,
    explanation: 'Rádio Comercial testte een AI-host in 2023. Duitsland (ENERGY) volgde in 2024. Dit is geen experiment meer — het is productie.',
  },
  {
    id: 4, round: 1,
    text: 'TikTok heeft een eigen muziekstreamingdienst gelanceerd. Wat is de naam?',
    options: ['TikTok Beats', 'TikTok Music', 'SoundOn', 'ByteBeats'],
    correctIndex: 1,
    explanation: 'Gelanceerd in 2023 in Brazilië, Australië en Indonesië. Platforms willen de volledige muziekreis bezitten.',
  },
  {
    id: 5, round: 1,
    text: 'Hoeveel procent van de 15-24 jarigen in Nederland luistert wekelijks naar een podcast?',
    options: ['18%', '29%', '41%', '54%'],
    correctIndex: 2,
    explanation: 'Ruigrok NetPanel 2024. Bij 35+ is dat 19%. De volgende generatie radioluisteraar is al vertrokken naar on-demand audio.',
  },

  // ── ROUND 2: Hoe doen anderen het? ───────────────────────────────
  {
    id: 6, round: 2,
    text: 'BBC Radio heeft een grote strategische verschuiving gemaakt. Wat is de kern daarvan?',
    options: [
      'Ze stoppen met FM',
      'Ze lanceerden een eigen podcast-platform',
      'Ze fuseerden met een streamingdienst',
      'Ze zetten AI in als volledige nieuwspresentator',
    ],
    correctIndex: 1,
    explanation: 'BBC Sounds is hun eigen on-demand audio platform. Inmiddels 5M+ maandelijkse gebruikers.',
  },
  {
    id: 7, round: 2,
    text: 'NPR (Amerika\'s publieke radio) heeft in 2023 een drastische beslissing genomen. Welke?',
    options: [
      'Ze stopten met lineaire uitzendingen',
      'Ze namen een groot podcastbedrijf over',
      'Ze verlieten Twitter/X volledig',
      'Ze lanceerden een betaalde abonnementsdienst',
    ],
    correctIndex: 2,
    explanation: 'NPR verliet X na de \'state-affiliated media\' labelaffaire. Platforms die je niet controleert, kun je niet vertrouwen.',
  },
  {
    id: 8, round: 2,
    text: 'Welke Zweedse radiozender heeft als eerste ter wereld een volledige \'audio-first content studio\' opgezet?',
    options: ['SR (Sveriges Radio)', 'NRJ Sweden', 'Mix Megapol', 'P3'],
    correctIndex: 0,
    explanation: 'SR\'s Podplay-platform produceert nu meer uren podcast-content dan live radio-content. Ze beschouwen zichzelf als \'audiomedium\', niet als \'radiozender\'.',
  },
  {
    id: 9, round: 2,
    text: 'Bauer Media hanteert een nieuwe investeringsstrategie. Wat is de kern?',
    options: [
      'Stoppen met FM-licenties',
      'Elk merk moet ook buiten radio inkomsten genereren',
      'Fusie met een tv-netwerk',
      'Volledig overstappen op AI-content',
    ],
    correctIndex: 1,
    explanation: 'Bauer stuurt op \'brand extension\': Kiss FM organiseert festivals, Absolute Radio heeft een podcast-netwerk. Radio als merk, niet als medium.',
  },
  {
    id: 10, round: 2,
    text: 'In Australië experimenteert Nova Entertainment met \'dynamic audio\'. Wat is dat?',
    options: [
      'Radio die automatisch aanpast aan het weer',
      'Gepersonaliseerde reclameblokken per luisteraar',
      'AI die realtime muziek componeert',
      'Een systeem dat DJ-stemmen kloont',
    ],
    correctIndex: 1,
    explanation: 'Via de Nova-app krijgt elke luisteraar andere reclameblokken. CPM is 3x hoger dan lineaire radio. Dit is het businessmodel van de toekomst.',
  },

  // ── ROUND 3: Q-ronde ─────────────────────────────────────────────
  {
    id: 11, round: 3,
    text: 'Qmusic claimt \'de meest beluisterde commerciële zender van Nederland\' te zijn. Wat is het dagelijks bereik?',
    options: ['1,2 miljoen', '1,8 miljoen', '2,4 miljoen', '3,1 miljoen'],
    correctIndex: 2,
    explanation: 'NLO Luisteronderzoek 2024. Sterk in de ochtend, zwakker in de avond.',
  },
  {
    id: 12, round: 3,
    text: 'Welk Qmusic-format werd gekopieerd door zenders in minimaal 5 andere landen?',
    options: ['De Qmusic Top 40', 'De Foute Party', 'Mattie & Marieke', 'Het Grootste Songfestivaldebat'],
    correctIndex: 1,
    explanation: 'Geëxporteerd naar België, Duitsland, Australië, UK en Denemarken. Een live-event format voortkomend uit een radiomerk — dit is wat \'contentbedrijf\' betekent.',
  },
  {
    id: 13, round: 3,
    text: 'Hoeveel procent van Qmusic\'s totale bereik komt via digitale kanalen (app, online stream, podcast)?',
    options: ['8%', '17%', '31%', '46%'],
    correctIndex: 1,
    explanation: 'Groeiend, maar FM domineert nog. Als FM-bereik daalt en digitaal niet compenseert, krimpt het totaal.',
  },
  {
    id: 14, round: 3,
    text: 'Qmusic heeft recent een samenwerking aangegaan buiten de radio. Met welk type partner?',
    options: ['Een streamingdienst', 'Een supermarktketen', 'Een reisorganisatie', 'Een sportbond'],
    correctIndex: 1,
    explanation: 'Samenwerking met Albert Heijn voor in-store audio en activaties. Merk buiten het medium — kleine stap richting contentbedrijf.',
  },
  {
    id: 15, round: 3,
    text: 'Wat is de grootste bedreiging voor het Qmusic-businessmodel op 5 jaar?',
    options: [
      'Spotify pikt de muziekluisteraar verder in',
      'AI-presentatoren vervangen dure talent',
      'Adverteerders verschuiven budget naar social media',
      'De FM-frequentie verdwijnt',
    ],
    correctIndex: 2,
    explanation: 'Advertentie-inkomsten zijn de levensader. Social biedt betere targeting, meer data, lagere CPM. Radio\'s defensie is bereik + context + live — maar dat argument slijt.',
    isOpinion: true,
  },

  // ── ROUND 4: Joe-ronde ───────────────────────────────────────────
  {
    id: 16, round: 4,
    text: 'Joe positioneert zich met een emotionele kernbelofte. Welke?',
    options: [
      '"De meeste hits van nu"',
      '"Muziek die je raakt"',
      '"Altijd goed, altijd vertrouwd"',
      '"Meer muziek, minder gebabbel"',
    ],
    correctIndex: 1,
    explanation: 'De emotionele positionering onderscheidt Joe van Qmusic\'s energie-aanpak. Maar: is \'emotie\' verdedigbaar als Spotify Daylist ook emotioneel personaliseert?',
  },
  {
    id: 17, round: 4,
    text: 'Joe\'s doelgroep (35-55) luistert langer per dag. Maar wat is het strategische risico?',
    options: [
      'Ze hebben minder koopkracht',
      'Ze zijn moeilijker te bereiken via social',
      'Ze krimpen demografisch',
      'Ze luisteren vaker via FM',
    ],
    correctIndex: 2,
    explanation: 'De 35-55 van nu is de laatste generatie die radio als primair medium heeft meegekregen. De volgende \'35-55\' in 2035 is de huidige Spotify-generatie.',
  },
  {
    id: 18, round: 4,
    text: 'Joe organiseert live events. Wat is de strategische reden?',
    options: [
      'Extra inkomstenstroom',
      'Versterking van het merk buiten het medium',
      'Dataverzameling',
      'Alle drie',
    ],
    correctIndex: 3,
    explanation: 'Events zijn het schoolvoorbeeld van de contentbedrijf-logica: één merk, meerdere touchpoints, meerdere inkomstenstromen.',
  },
  {
    id: 19, round: 4,
    text: 'Welk Joe-programma heeft de hoogste luistercijfers en waarom is dat strategisch interessant?',
    options: [
      'De ochtendshow — habit forming in de ochtendpiek',
      'De middagshow — hoogste absolute bereik',
      'De Top 2000 a gogo — jaarlijks terugkerend',
      'De avondshow — trouwste luisteraars',
    ],
    correctIndex: 0,
    explanation: 'Habit forming is het sterkste wapen van radio tegen on-demand. Als je onderdeel wordt van iemands ochtendritueel, ben je moeilijk te vervangen.',
  },
  {
    id: 20, round: 4,
    text: 'Als Joe en Qmusic over 10 jaar succesvol zijn, wat zijn ze dan waarschijnlijk?',
    options: [
      'Nog steeds radio — maar volledig digitaal',
      'Contentmerken met radio als één van de kanalen',
      'Opgegaan in een groter audioplatform',
      'Significanter kleiner, maar kwalitatief sterker niche-product',
    ],
    correctIndex: -1,
    explanation: 'Dit is precies de vraag waar we de rest van de ochtend op ingaan.',
    isOpinion: true,
  },
]

export const ROUNDS_PER_QUESTION = 5  // questions per round
export const TOTAL_QUESTIONS = 20
export const POINTS_PER_CORRECT = 100

// Returns 0-indexed positions of the last question in each round (except round 4)
export const ROUND_END_INDICES = [4, 9, 14]  // Q5, Q10, Q15

export function getThemeForRound(round: number): 'base' | 'qmusic' | 'joe' {
  if (round === 3) return 'qmusic'
  if (round === 4) return 'joe'
  return 'base'
}

export function getTimerForRound(round: number): number {
  return round === 3 ? 20 : 25
}
```

- [ ] **Step 2: Verify**
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**
```bash
git add src/data/questions.ts
git commit -m "feat: add all 20 questions and round helpers"
```

---

## Task 4: PartyKit server

**Files:**
- Create: `party/server.ts`

- [ ] **Step 1: Create `party/server.ts`**
```typescript
import type * as Party from 'partykit/server'
import type { GameState, ClientMessage, ServerMessage } from '../src/types/game'
import {
  QUESTIONS,
  POINTS_PER_CORRECT,
  ROUND_END_INDICES,
} from '../src/data/questions'

const INITIAL_STATE: GameState = {
  phase: 'lobby',
  currentQuestion: 0,
  currentRound: 1,
  teams: [],
  answers: [],
}

export default class QuizServer implements Party.Server {
  private state: GameState = { ...INITIAL_STATE, teams: [] }

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection) {
    conn.send(JSON.stringify({ type: 'STATE_UPDATE', state: this.state } satisfies ServerMessage))
  }

  onMessage(raw: string, sender: Party.Connection) {
    const msg = JSON.parse(raw) as ClientMessage

    switch (msg.type) {
      case 'JOIN': {
        const existing = this.state.teams.find(t => t.id === msg.teamId)
        if (!existing) {
          this.state = {
            ...this.state,
            teams: [...this.state.teams, { id: msg.teamId, name: msg.teamName, score: 0 }],
          }
        }
        break
      }

      case 'SUBMIT_ANSWER': {
        if (this.state.phase !== 'question') return
        const alreadyAnswered = this.state.answers.some(a => a.teamId === msg.teamId)
        if (alreadyAnswered) return
        this.state = {
          ...this.state,
          answers: [...this.state.answers, { teamId: msg.teamId, answer: msg.answer }],
        }
        break
      }

      case 'NEXT_QUESTION': {
        if (!msg.isHost) return
        if (this.state.phase === 'lobby') {
          // Start first question
          this.state = { ...this.state, phase: 'question', answers: [] }
        } else if (this.state.phase === 'reveal') {
          const idx = this.state.currentQuestion
          if (idx === 19) {
            // Last question done → finished
            this.state = { ...this.state, phase: 'finished' }
          } else if (ROUND_END_INDICES.includes(idx)) {
            // End of round 1/2/3 → show leaderboard
            this.state = { ...this.state, phase: 'leaderboard' }
          } else {
            // Mid-round → next question
            this.state = {
              ...this.state,
              phase: 'question',
              currentQuestion: idx + 1,
              answers: [],
            }
          }
        }
        break
      }

      case 'REVEAL': {
        if (!msg.isHost) return
        if (this.state.phase !== 'question') return
        const question = QUESTIONS[this.state.currentQuestion]
        // Award points (not for pure opinion questions where correctIndex === -1)
        const updatedTeams = this.state.teams.map(team => {
          const teamAnswer = this.state.answers.find(a => a.teamId === team.id)
          if (!teamAnswer) return team
          const answerIndex = question.options.indexOf(teamAnswer.answer)
          const isCorrect = question.correctIndex !== -1 && answerIndex === question.correctIndex
          return isCorrect ? { ...team, score: team.score + POINTS_PER_CORRECT } : team
        })
        this.state = { ...this.state, phase: 'reveal', teams: updatedTeams }
        break
      }

      case 'NEXT_ROUND': {
        if (!msg.isHost) return
        if (this.state.phase !== 'leaderboard') return
        const nextQuestion = this.state.currentQuestion + 1
        const nextRound = this.state.currentRound + 1
        this.state = {
          ...this.state,
          phase: 'question',
          currentQuestion: nextQuestion,
          currentRound: nextRound,
          answers: [],
        }
        break
      }

      case 'RESET': {
        if (!msg.isHost) return
        this.state = { ...INITIAL_STATE, teams: [] }
        break
      }
    }

    this.broadcast()
  }

  private broadcast() {
    const msg: ServerMessage = { type: 'STATE_UPDATE', state: this.state }
    this.room.broadcast(JSON.stringify(msg))
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**
```bash
npx tsc --noEmit
```
Expected: no errors. (If PartyKit types are missing, run `npm install --save-dev partykit`.)

- [ ] **Step 3: Test the server locally**
```bash
npx partykit dev
```
Expected: server starts on localhost:1999. Keep running in a separate terminal for Tasks 6+.

- [ ] **Step 4: Commit**
```bash
git add party/server.ts
git commit -m "feat: add PartyKit server with full game state machine"
```

---

## Task 5: CSS theme system

**Files:**
- Create: `src/styles/index.css`
- Create: `src/styles/themes.css`

- [ ] **Step 1: Create `src/styles/index.css`**
```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #root {
  height: 100%;
}

body {
  font-family: var(--font-body);
  background: var(--color-bg);
  color: var(--color-text);
  -webkit-font-smoothing: antialiased;
}

@import './themes.css';
```

- [ ] **Step 2: Create `src/styles/themes.css`**
```css
/* ── Base theme (Rounds 1 & 2) ─────────────────────────── */
[data-theme="base"] {
  --color-bg:           #0A0A0F;
  --color-surface:      #111118;
  --color-border:       #1e1e2e;
  --color-text:         #E8E8E8;
  --color-text-muted:   #555555;
  --color-accent:       #E8E8E8;
  --color-accent-rgb:   232, 232, 232;
  --color-correct:      #4ade80;
  --color-incorrect:    #e84545;
  --color-timer-urgent: #e84545;
  --color-btn-bg:       #111118;
  --color-btn-border:   #2e2e3e;
  --color-btn-text:     #E8E8E8;
  --color-btn-sel-bg:   #1a1a2a;
  --color-btn-sel-border: #E8E8E8;
  --color-btn-sel-text: #E8E8E8;
  --font-display:       'Bebas Neue', sans-serif;
  --font-body:          'DM Sans', sans-serif;
  --timer-bar-color:    #E8E8E8;
}

/* ── Qmusic theme (Round 3) ────────────────────────────── */
[data-theme="qmusic"] {
  --color-bg:           #ffffff;
  --color-surface:      #ffffff;
  --color-border:       #e8e8e8;
  --color-text:         #111111;
  --color-text-muted:   #aaaaaa;
  --color-accent:       #E8201E;
  --color-accent-rgb:   232, 32, 30;
  --color-correct:      #2bb04a;
  --color-incorrect:    #cc2020;
  --color-timer-urgent: #b01010;
  --color-btn-bg:       #ffffff;
  --color-btn-border:   #e8e8e8;
  --color-btn-text:     #111111;
  --color-btn-sel-bg:   #111111;
  --color-btn-sel-border: #111111;
  --color-btn-sel-text: #ffffff;
  --font-display:       'Montserrat', sans-serif;
  --font-body:          'DM Sans', sans-serif;
  --timer-bar-color:    #E8201E;
}

/* ── Joe theme (Round 4) ───────────────────────────────── */
[data-theme="joe"] {
  --color-bg:           #2B72D4;
  --color-surface:      #ffffff;
  --color-border:       rgba(255,255,255,0.15);
  --color-text:         #ffffff;
  --color-text-muted:   rgba(255,255,255,0.5);
  --color-accent:       #E8365D;
  --color-accent-rgb:   232, 54, 93;
  --color-correct:      #4ade80;
  --color-incorrect:    #ff6b6b;
  --color-timer-urgent: #E8365D;
  --color-btn-bg:       #ffffff;
  --color-btn-border:   rgba(255,255,255,0.2);
  --color-btn-text:     #2B72D4;
  --color-btn-sel-bg:   #2B72D4;
  --color-btn-sel-border: #ffffff;
  --color-btn-sel-text: #ffffff;
  --font-display:       'Nunito', sans-serif;
  --font-body:          'Nunito', sans-serif;
  --timer-bar-color:    #ffffff;
}
```

- [ ] **Step 3: Verify no syntax errors**
```bash
npm run build
```
Expected: build succeeds.

- [ ] **Step 4: Commit**
```bash
git add src/styles/
git commit -m "feat: add CSS theme variable system for base/qmusic/joe"
```

---

## Task 6: ThemeProvider + useGameSocket

**Files:**
- Create: `src/components/shared/ThemeProvider.tsx`
- Create: `src/hooks/useGameSocket.ts`

- [ ] **Step 1: Create `src/components/shared/ThemeProvider.tsx`**
```tsx
import { useEffect, useRef } from 'react'
import { getThemeForRound } from '../../data/questions'
import type { GameState } from '../../types/game'

type Props = {
  gameState: GameState | null
  children: React.ReactNode
}

export function ThemeProvider({ gameState, children }: Props) {
  const round = gameState?.currentRound ?? 1
  const theme = getThemeForRound(round)

  return (
    <div data-theme={theme} style={{ minHeight: '100vh' }}>
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Create `src/hooks/useGameSocket.ts`**
```typescript
import { useState, useEffect, useCallback, useRef } from 'react'
import usePartySocket from 'partysocket/react'
import type { GameState, ClientMessage, ServerMessage } from '../types/game'

function getOrCreateTeamId(): string {
  const key = 'qj-team-id'
  const existing = sessionStorage.getItem(key)
  if (existing) return existing
  const id = Math.random().toString(36).slice(2, 10)
  sessionStorage.setItem(key, id)
  return id
}

export function useGameSocket() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [connected, setConnected] = useState(false)
  const teamId = useRef(getOrCreateTeamId()).current

  const socket = usePartySocket({
    host: import.meta.env.VITE_PARTYKIT_HOST ?? 'localhost:1999',
    room: 'qj-quiz-2025',
  })

  useEffect(() => {
    const onOpen = () => setConnected(true)
    const onClose = () => setConnected(false)
    const onMessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data as string) as ServerMessage
      if (msg.type === 'STATE_UPDATE') setGameState(msg.state)
    }
    socket.addEventListener('open', onOpen)
    socket.addEventListener('close', onClose)
    socket.addEventListener('message', onMessage)
    return () => {
      socket.removeEventListener('open', onOpen)
      socket.removeEventListener('close', onClose)
      socket.removeEventListener('message', onMessage)
    }
  }, [socket])

  const send = useCallback((msg: ClientMessage) => {
    socket.send(JSON.stringify(msg))
  }, [socket])

  return { gameState, send, teamId, connected }
}
```

- [ ] **Step 3: Verify**
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**
```bash
git add src/components/shared/ThemeProvider.tsx src/hooks/useGameSocket.ts
git commit -m "feat: add ThemeProvider and useGameSocket hook"
```

---

## Task 7: Timer component

**Files:**
- Create: `src/components/shared/Timer.tsx`
- Create: `src/components/shared/Timer.css`

- [ ] **Step 1: Create `src/components/shared/Timer.css`**
```css
.timer-root {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.timer-number {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--color-text);
  line-height: 1;
  transition: color 0.3s;
}
.timer-number.urgent {
  color: var(--color-timer-urgent);
}
.timer-bar-track {
  height: 4px;
  background: rgba(128,128,128,0.2);
  border-radius: 2px;
  overflow: hidden;
}
.timer-bar-fill {
  height: 100%;
  background: var(--timer-bar-color);
  border-radius: 2px;
  transition: width 1s linear, background 0.3s;
}
.timer-bar-fill.urgent {
  background: var(--color-timer-urgent);
}
```

- [ ] **Step 2: Create `src/components/shared/Timer.tsx`**
```tsx
import { useState, useEffect } from 'react'
import './Timer.css'

type Props = {
  duration: number     // seconds
  running: boolean
  onExpire?: () => void
}

export function Timer({ duration, running, onExpire }: Props) {
  const [remaining, setRemaining] = useState(duration)

  useEffect(() => {
    setRemaining(duration)
  }, [duration])

  useEffect(() => {
    if (!running) return
    if (remaining <= 0) {
      onExpire?.()
      return
    }
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(id)
          onExpire?.()
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running, duration]) // reset when question changes (duration key changes)

  const pct = (remaining / duration) * 100
  const urgent = remaining <= 5

  return (
    <div className="timer-root">
      <span className={`timer-number ${urgent ? 'urgent' : ''}`}>{remaining}</span>
      <div className="timer-bar-track">
        <div
          className={`timer-bar-fill ${urgent ? 'urgent' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify**
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**
```bash
git add src/components/shared/Timer.tsx src/components/shared/Timer.css
git commit -m "feat: add Timer component with urgency styling"
```

---

## Task 8: Player — Lobby

**Files:**
- Create: `src/components/player/Lobby.tsx`
- Create: `src/components/player/Lobby.css`

- [ ] **Step 1: Create `src/components/player/Lobby.css`**
```css
.lobby {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  background: var(--color-bg);
}
.lobby-title {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 900;
  color: var(--color-text);
  letter-spacing: 2px;
  margin-bottom: 4px;
  text-align: center;
}
.lobby-sub {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 32px;
  text-align: center;
}
.lobby-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 320px;
}
.lobby-input {
  padding: 14px 16px;
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text);
  font-size: 1rem;
  font-family: var(--font-body);
  outline: none;
}
.lobby-input:focus {
  border-color: var(--color-accent);
}
.lobby-btn {
  padding: 14px;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  font-family: var(--font-body);
  cursor: pointer;
}
.lobby-btn:disabled {
  opacity: 0.4;
  cursor: default;
}
.lobby-teams {
  margin-top: 32px;
  width: 100%;
  max-width: 320px;
}
.lobby-teams-label {
  font-size: 0.65rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
}
.lobby-team-pill {
  display: inline-block;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin: 3px;
}
.lobby-waiting {
  margin-top: 24px;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  text-align: center;
}
```

- [ ] **Step 2: Create `src/components/player/Lobby.tsx`**
```tsx
import { useState } from 'react'
import type { GameState, ClientMessage } from '../../types/game'
import './Lobby.css'

type Props = {
  gameState: GameState
  teamId: string
  send: (msg: ClientMessage) => void
}

export function Lobby({ gameState, teamId, send }: Props) {
  const [name, setName] = useState('')
  const [joined, setJoined] = useState(
    () => gameState.teams.some(t => t.id === teamId)
  )

  function handleJoin() {
    const trimmed = name.trim()
    if (!trimmed) return
    send({ type: 'JOIN', teamId, teamName: trimmed })
    setJoined(true)
  }

  return (
    <div className="lobby">
      <div className="lobby-title">Q&J QUIZ</div>
      <div className="lobby-sub">Voer je teamnaam in om mee te doen</div>

      {!joined ? (
        <div className="lobby-form">
          <input
            className="lobby-input"
            placeholder="Teamnaam..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
            maxLength={24}
            autoFocus
          />
          <button className="lobby-btn" onClick={handleJoin} disabled={!name.trim()}>
            Doe mee →
          </button>
        </div>
      ) : (
        <div className="lobby-waiting">
          ✓ Je bent aangemeld! Wacht op de host om te starten.
        </div>
      )}

      {gameState.teams.length > 0 && (
        <div className="lobby-teams">
          <div className="lobby-teams-label">
            Teams aangemeld ({gameState.teams.length})
          </div>
          {gameState.teams.map(t => (
            <span key={t.id} className="lobby-team-pill">{t.name}</span>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify**
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**
```bash
git add src/components/player/
git commit -m "feat: add Lobby component for player team registration"
```

---

## Task 9: Player — AnswerButtons + PlayerView

**Files:**
- Create: `src/components/player/AnswerButtons.tsx`
- Create: `src/components/player/AnswerButtons.css`
- Create: `src/components/player/PlayerView.tsx`
- Create: `src/components/player/PlayerView.css`

- [ ] **Step 1: Create `src/components/player/AnswerButtons.css`**
```css
.answer-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.answer-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px 18px;
  background: var(--color-btn-bg);
  border: 2px solid var(--color-btn-border);
  border-radius: 12px;
  color: var(--color-btn-text);
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;
}
/* Joe theme: pill buttons */
[data-theme="joe"] .answer-btn {
  border-radius: 30px;
}
/* Qmusic theme: square-ish */
[data-theme="qmusic"] .answer-btn {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.9rem;
  border-radius: 6px;
}
.answer-btn:hover:not(:disabled) {
  border-color: var(--color-accent);
}
.answer-btn.selected {
  background: var(--color-btn-sel-bg);
  border-color: var(--color-btn-sel-border);
  color: var(--color-btn-sel-text);
}
.answer-btn.correct {
  background: var(--color-correct);
  border-color: var(--color-correct);
  color: #fff;
}
.answer-btn.incorrect {
  opacity: 0.45;
}
.answer-btn:disabled {
  cursor: default;
}
.answer-opt {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-accent);
  min-width: 20px;
  opacity: 0.8;
}
.answer-btn.selected .answer-opt,
.answer-btn.correct .answer-opt {
  color: inherit;
  opacity: 1;
}
```

- [ ] **Step 2: Create `src/components/player/AnswerButtons.tsx`**
```tsx
import './AnswerButtons.css'

const LABELS = ['A', 'B', 'C', 'D']

type ButtonState = 'idle' | 'selected' | 'correct' | 'incorrect' | 'locked'

type Props = {
  options: string[]
  selectedIndex: number | null
  correctIndex: number | null  // null until revealed
  phase: 'question' | 'reveal'
  onSelect: (index: number) => void
}

export function AnswerButtons({ options, selectedIndex, correctIndex, phase, onSelect }: Props) {
  function getState(i: number): ButtonState {
    if (phase === 'question') {
      if (selectedIndex === null) return 'idle'
      return selectedIndex === i ? 'selected' : 'locked'
    }
    // reveal phase
    if (correctIndex !== null && correctIndex !== -1 && i === correctIndex) return 'correct'
    if (i === selectedIndex && correctIndex !== -1) return 'incorrect'
    return 'locked'
  }

  return (
    <div className="answer-buttons">
      {options.map((option, i) => {
        const state = getState(i)
        return (
          <button
            key={i}
            className={`answer-btn ${state}`}
            disabled={phase === 'reveal' || selectedIndex !== null}
            onClick={() => onSelect(i)}
          >
            <span className="answer-opt">{LABELS[i]}</span>
            {option}
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/player/PlayerView.css`**
```css
.player-view {
  min-height: 100vh;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
}

/* Qmusic: white bg, red banner for question area */
[data-theme="qmusic"] .player-question-area {
  background: #E8201E;
  padding: 20px 20px 24px;
}
[data-theme="qmusic"] .player-answers-area {
  background: #ffffff;
  flex: 1;
  padding: 20px;
}

/* Joe: blue bg for question area, white for answers */
[data-theme="joe"] .player-question-area {
  background: #2B72D4;
  padding: 20px 20px 24px;
  position: relative;
  overflow: hidden;
}
[data-theme="joe"] .player-question-area::after {
  content: '';
  position: absolute;
  bottom: -50px; right: -50px;
  width: 180px; height: 180px;
  background: rgba(255,255,255,0.07);
  border-radius: 50%;
  pointer-events: none;
}
[data-theme="joe"] .player-answers-area {
  background: #ffffff;
  flex: 1;
  padding: 20px;
}
[data-theme="joe"] .player-answers-area .answer-btn {
  color: #2B72D4;
}

/* Base: unified dark */
[data-theme="base"] .player-question-area {
  padding: 20px;
}
[data-theme="base"] .player-answers-area {
  flex: 1;
  padding: 20px;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.player-brand {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 900;
  color: var(--color-text);
  letter-spacing: 1px;
}
[data-theme="qmusic"] .player-brand { color: #E8201E; background: #fff; padding: 2px 6px; border-radius: 4px; font-size: 0.9rem; }
[data-theme="joe"] .player-brand { color: #fff; }
.player-team-name {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
.player-q-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}
.player-q-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-text-muted);
  font-family: var(--font-body);
}
.player-question-text {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1.35;
  margin-bottom: 0;
}
[data-theme="qmusic"] .player-question-text {
  text-transform: uppercase;
  font-size: 1rem;
}

.player-locked {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--color-text-muted);
  font-size: 0.95rem;
  padding: 40px 20px;
}
.player-locked-icon { font-size: 2.5rem; }

.player-explanation {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 12px 14px;
  margin-top: 16px;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}
[data-theme="qmusic"] .player-explanation { background: #f8f8f8; color: #555; }
[data-theme="joe"] .player-explanation { background: #f0f4fd; color: #2B72D4; }

.player-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  padding: 10px 14px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}
.player-score-pts { font-weight: 700; color: var(--color-correct); }

/* Leaderboard state */
.player-leaderboard {
  min-height: 100vh;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  gap: 20px;
}
.player-lb-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 900;
  color: var(--color-text);
  letter-spacing: 2px;
}
.player-lb-list { width: 100%; max-width: 360px; }
.player-lb-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
}
.player-lb-rank { font-size: 0.85rem; color: var(--color-text-muted); min-width: 24px; font-weight: 700; }
.player-lb-name { flex: 1; font-weight: 600; color: var(--color-text); }
.player-lb-score { font-weight: 700; color: var(--color-accent); }
.player-lb-me { background: rgba(var(--color-accent-rgb), 0.08); border-radius: 8px; }
```

- [ ] **Step 4: Create `src/components/player/PlayerView.tsx`**
```tsx
import { useState } from 'react'
import type { GameState, ClientMessage } from '../../types/game'
import { QUESTIONS, getTimerForRound } from '../../data/questions'
import { Timer } from '../shared/Timer'
import { AnswerButtons } from './AnswerButtons'
import { Lobby } from './Lobby'
import './PlayerView.css'

type Props = {
  gameState: GameState
  teamId: string
  send: (msg: ClientMessage) => void
}

export function PlayerView({ gameState, teamId, send }: Props) {
  const { phase, currentQuestion, currentRound, teams, answers } = gameState
  const myTeam = teams.find(t => t.id === teamId)
  const myAnswer = answers.find(a => a.teamId === teamId)
  const question = QUESTIONS[currentQuestion]
  const timerDuration = getTimerForRound(currentRound)

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Reset selection when question changes
  const [lastSeenQuestion, setLastSeenQuestion] = useState(currentQuestion)
  if (currentQuestion !== lastSeenQuestion) {
    setSelectedIndex(null)
    setLastSeenQuestion(currentQuestion)
  }

  function handleSelect(index: number) {
    if (selectedIndex !== null) return
    setSelectedIndex(index)
    send({
      type: 'SUBMIT_ANSWER',
      teamId,
      answer: question.options[index],
    })
  }

  if (phase === 'lobby') {
    return <Lobby gameState={gameState} teamId={teamId} send={send} />
  }

  if (phase === 'leaderboard' || phase === 'finished') {
    const sorted = [...teams].sort((a, b) => b.score - a.score)
    return (
      <div className="player-leaderboard">
        <div className="player-lb-title">
          {phase === 'finished' ? 'EINDSTAND 🏆' : `STAND NA RONDE ${currentRound - 1}`}
        </div>
        <div className="player-lb-list">
          {sorted.map((team, i) => (
            <div key={team.id} className={`player-lb-row ${team.id === teamId ? 'player-lb-me' : ''}`}>
              <span className="player-lb-rank">{i + 1}</span>
              <span className="player-lb-name">{team.name}{team.id === teamId ? ' (jij)' : ''}</span>
              <span className="player-lb-score">{team.score} pts</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const isLocked = myAnswer !== undefined || phase === 'reveal'
  const correctIndex = phase === 'reveal' ? question.correctIndex : null
  const brandLabel = currentRound === 3 ? 'QMUSIC' : currentRound === 4 ? 'joe.' : 'Q&J QUIZ'

  return (
    <div className="player-view">
      <div className="player-question-area">
        <div className="player-header">
          <span className="player-brand">{brandLabel}</span>
          <span className="player-team-name">{myTeam?.name ?? ''}</span>
        </div>
        <div className="player-q-meta">
          <span className="player-q-label">Vraag {currentQuestion + 1} van 20</span>
          {phase === 'question' && (
            <Timer
              key={currentQuestion}
              duration={timerDuration}
              running={phase === 'question' && !isLocked}
            />
          )}
        </div>
        <div className="player-question-text">{question.text}</div>
      </div>

      <div className="player-answers-area">
        {phase === 'question' && isLocked ? (
          <div className="player-locked">
            <div className="player-locked-icon">⏳</div>
            <div>Antwoord verstuurd!</div>
            <div style={{ fontSize: '0.75rem' }}>Wacht op de host...</div>
          </div>
        ) : (
          <>
            <AnswerButtons
              options={question.options}
              selectedIndex={selectedIndex}
              correctIndex={correctIndex}
              phase={phase === 'reveal' ? 'reveal' : 'question'}
              onSelect={handleSelect}
            />
            {phase === 'reveal' && (
              <>
                <div className="player-explanation">{question.explanation}</div>
                {myTeam && (
                  <div className="player-score">
                    <span>Teamscore</span>
                    <span className="player-score-pts">{myTeam.score} pts</span>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Verify**
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Commit**
```bash
git add src/components/player/
git commit -m "feat: add PlayerView with all states (lobby/question/locked/reveal/leaderboard)"
```

---

## Task 10: Host — AnswerDistribution + Leaderboard

**Files:**
- Create: `src/components/host/AnswerDistribution.tsx`
- Create: `src/components/host/AnswerDistribution.css`
- Create: `src/components/host/Leaderboard.tsx`
- Create: `src/components/host/Leaderboard.css`

- [ ] **Step 1: Create `src/components/host/AnswerDistribution.css`**
```css
.distribution {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dist-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.dist-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-text-muted);
  min-width: 22px;
  text-align: center;
}
.dist-label.correct { color: var(--color-correct); }
.dist-bar-track {
  flex: 1;
  height: 24px;
  background: rgba(128,128,128,0.1);
  border-radius: 4px;
  overflow: hidden;
}
.dist-bar-fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding-left: 8px;
  transition: width 0.4s ease;
  min-width: 0;
}
.dist-bar-fill.correct { background: var(--color-correct); }
.dist-bar-fill.incorrect { background: var(--color-incorrect); opacity: 0.5; }
.dist-count {
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  white-space: nowrap;
}
.dist-option-text {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  min-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dist-option-text.correct { color: var(--color-correct); font-weight: 600; }
```

- [ ] **Step 2: Create `src/components/host/AnswerDistribution.tsx`**
```tsx
import type { Answer, Question } from '../../types/game'
import './AnswerDistribution.css'

const LABELS = ['A', 'B', 'C', 'D']

type Props = {
  question: Question
  answers: Answer[]
  totalTeams: number
  revealed: boolean
}

export function AnswerDistribution({ question, answers, totalTeams, revealed }: Props) {
  const counts = question.options.map((_, i) =>
    answers.filter(a => a.answer === question.options[i]).length
  )
  const max = Math.max(...counts, 1)

  return (
    <div className="distribution">
      {question.options.map((option, i) => {
        const count = counts[i]
        const pct = (count / max) * 100
        const isCorrect = revealed && i === question.correctIndex
        const isIncorrect = revealed && i !== question.correctIndex && question.correctIndex !== -1
        return (
          <div key={i} className="dist-row">
            <span className={`dist-label ${isCorrect ? 'correct' : ''}`}>
              {isCorrect ? `${LABELS[i]} ✓` : LABELS[i]}
            </span>
            <div className="dist-bar-track">
              <div
                className={`dist-bar-fill ${isCorrect ? 'correct' : isIncorrect ? 'incorrect' : ''}`}
                style={{ width: count === 0 ? '0%' : `${pct}%` }}
              >
                {count > 0 && <span className="dist-count">{count}</span>}
              </div>
            </div>
            <span className={`dist-option-text ${isCorrect ? 'correct' : ''}`}>{option}</span>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/host/Leaderboard.css`**
```css
.leaderboard { display: flex; flex-direction: column; gap: 4px; }
.lb-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.8rem;
}
.lb-row:last-child { border-bottom: none; }
.lb-rank { color: var(--color-text-muted); min-width: 18px; font-weight: 700; font-size: 0.7rem; }
.lb-name { flex: 1; color: var(--color-text-muted); }
.lb-score { font-weight: 700; color: var(--color-text); }
```

- [ ] **Step 4: Create `src/components/host/Leaderboard.tsx`**
```tsx
import type { Team } from '../../types/game'
import './Leaderboard.css'

type Props = { teams: Team[] }

export function Leaderboard({ teams }: Props) {
  const sorted = [...teams].sort((a, b) => b.score - a.score)
  return (
    <div className="leaderboard">
      {sorted.map((team, i) => (
        <div key={team.id} className="lb-row">
          <span className="lb-rank">{i + 1}</span>
          <span className="lb-name">{team.name}</span>
          <span className="lb-score">{team.score}</span>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Verify**
```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**
```bash
git add src/components/host/
git commit -m "feat: add AnswerDistribution bar chart and Leaderboard for host"
```

---

## Task 11: Host — HostView

**Files:**
- Create: `src/components/host/HostView.tsx`
- Create: `src/components/host/HostView.css`

- [ ] **Step 1: Create `src/components/host/HostView.css`**
```css
.host-pin-gate {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: #0A0A0F;
  color: #E8E8E8;
}
.host-pin-title { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; letter-spacing: 2px; }
.host-pin-input {
  padding: 12px 16px;
  background: #111118;
  border: 1.5px solid #2e2e3e;
  border-radius: 8px;
  color: #E8E8E8;
  font-size: 1.2rem;
  text-align: center;
  letter-spacing: 4px;
  width: 200px;
  outline: none;
}
.host-pin-input.error { border-color: #e84545; }
.host-pin-btn {
  padding: 12px 24px;
  background: #E8E8E8;
  color: #0A0A0F;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
}

/* Host layout */
.host-view {
  min-height: 100vh;
  background: #0A0A0F;
  color: #E8E8E8;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  flex-direction: column;
}
.host-topbar {
  background: #111118;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #1e1e2e;
  flex-shrink: 0;
}
.host-topbar-title { font-family: 'Bebas Neue', sans-serif; font-size: 1rem; letter-spacing: 2px; }
.host-topbar-meta { font-size: 0.7rem; color: #555; }
.host-reset-btn {
  font-size: 0.65rem;
  color: #e84545;
  border: 1px solid rgba(232,69,69,0.3);
  border-radius: 4px;
  padding: 4px 10px;
  background: transparent;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.host-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Left: question + chart */
.host-left {
  flex: 1;
  padding: 20px;
  border-right: 1px solid #1e1e2e;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.host-q-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.host-q-label { font-size: 0.65rem; color: #555; text-transform: uppercase; letter-spacing: 1px; }
.host-question-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #E8E8E8;
  line-height: 1.45;
}
.host-dist-label { font-size: 0.6rem; color: #555; text-transform: uppercase; letter-spacing: 1px; }
.host-explanation {
  background: #111118;
  border: 1px solid #1e1e2e;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 0.8rem;
  color: #888;
  line-height: 1.5;
}
.host-explanation strong { color: #aaa; }

/* Right: controls */
.host-right {
  width: 180px;
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
}
.host-section-label {
  font-size: 0.55rem;
  color: #444;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.host-ctrl-btn {
  width: 100%;
  padding: 11px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  text-align: center;
}
.host-ctrl-btn.primary { background: #E8E8E8; color: #0A0A0F; border: none; }
.host-ctrl-btn.secondary { background: transparent; color: #E8E8E8; border: 1.5px solid #2e2e3e; }
.host-ctrl-btn:disabled { background: transparent; color: #333; border: 1.5px solid #1a1a2a; cursor: default; }
.host-divider { height: 1px; background: #1e1e2e; }

/* Lobby state */
.host-lobby {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 40px;
}
.host-lobby-title { font-family: 'Bebas Neue', sans-serif; font-size: 3rem; letter-spacing: 3px; }
.host-lobby-teams { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.host-team-pill {
  background: #111118;
  border: 1px solid #2e2e3e;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 0.85rem;
  color: #aaa;
}
.host-start-btn {
  padding: 14px 32px;
  background: #E8E8E8;
  color: #0A0A0F;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}
.host-start-btn:disabled { opacity: 0.4; cursor: default; }
```

- [ ] **Step 2: Create `src/components/host/HostView.tsx`**
```tsx
import { useState } from 'react'
import type { GameState, ClientMessage } from '../../types/game'
import { QUESTIONS, getTimerForRound, ROUND_END_INDICES } from '../../data/questions'
import { Timer } from '../shared/Timer'
import { AnswerDistribution } from './AnswerDistribution'
import { Leaderboard } from './Leaderboard'
import './HostView.css'

const HOST_PIN = 'qjhost2025'

type Props = {
  gameState: GameState | null
  send: (msg: ClientMessage) => void
}

export function HostView({ gameState, send }: Props) {
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  function checkPin() {
    if (pin === HOST_PIN) {
      setAuthenticated(true)
    } else {
      setPinError(true)
      setTimeout(() => setPinError(false), 1500)
    }
  }

  if (!authenticated) {
    return (
      <div className="host-pin-gate">
        <div className="host-pin-title">HOST LOGIN</div>
        <input
          className={`host-pin-input ${pinError ? 'error' : ''}`}
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={e => setPin(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && checkPin()}
          autoFocus
        />
        <button className="host-pin-btn" onClick={checkPin}>Inloggen</button>
      </div>
    )
  }

  if (!gameState) {
    return <div className="host-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Verbinden...</div>
  }

  const { phase, currentQuestion, currentRound, teams, answers } = gameState
  const question = QUESTIONS[currentQuestion]
  const timerDuration = getTimerForRound(currentRound)
  const isEndOfRound = ROUND_END_INDICES.includes(currentQuestion)
  const isLastQuestion = currentQuestion === 19

  return (
    <div className="host-view">
      <div className="host-topbar">
        <span className="host-topbar-title">Q&J QUIZ — HOST</span>
        <span className="host-topbar-meta">
          Ronde {currentRound} · Vraag {currentQuestion + 1}/20 · {teams.length} teams
        </span>
        <button className="host-reset-btn" onClick={() => { if (confirm('Game resetten?')) send({ type: 'RESET', isHost: true }) }}>
          ⟳ Reset
        </button>
      </div>

      {phase === 'lobby' && (
        <div className="host-lobby">
          <div className="host-lobby-title">Q&J QUIZ</div>
          <div style={{ fontSize: '0.8rem', color: '#555' }}>
            {teams.length === 0 ? 'Wacht op teams...' : `${teams.length} team${teams.length !== 1 ? 's' : ''} aangemeld`}
          </div>
          <div className="host-lobby-teams">
            {teams.map(t => <span key={t.id} className="host-team-pill">{t.name}</span>)}
          </div>
          <button
            className="host-start-btn"
            disabled={teams.length === 0}
            onClick={() => send({ type: 'NEXT_QUESTION', isHost: true })}
          >
            Start quiz →
          </button>
        </div>
      )}

      {phase === 'leaderboard' && (
        <div className="host-lobby" style={{ gap: 16 }}>
          <div className="host-lobby-title">STAND NA RONDE {currentRound}</div>
          <Leaderboard teams={teams} />
          <button
            className="host-start-btn"
            onClick={() => send({ type: 'NEXT_ROUND', isHost: true })}
          >
            Start Ronde {currentRound + 1} →
          </button>
        </div>
      )}

      {phase === 'finished' && (
        <div className="host-lobby" style={{ gap: 16 }}>
          <div className="host-lobby-title">EINDSTAND 🏆</div>
          <Leaderboard teams={teams} />
        </div>
      )}

      {(phase === 'question' || phase === 'reveal') && (
        <div className="host-main">
          <div className="host-left">
            <div className="host-q-header">
              <span className="host-q-label">Vraag {currentQuestion + 1} van 20 — Ronde {currentRound}</span>
              {phase === 'question' && (
                <Timer key={currentQuestion} duration={timerDuration} running={true} />
              )}
            </div>
            <div className="host-question-text">{question.text}</div>
            <div className="host-dist-label">
              Live antwoorden — {answers.length} van {teams.length} teams
            </div>
            <AnswerDistribution
              question={question}
              answers={answers}
              totalTeams={teams.length}
              revealed={phase === 'reveal'}
            />
            {phase === 'reveal' && (
              <div className="host-explanation">
                <strong>Toelichting:</strong> {question.explanation}
              </div>
            )}
          </div>

          <div className="host-right">
            <div className="host-section-label">Bediening</div>

            <button
              className="host-ctrl-btn primary"
              disabled={phase !== 'question'}
              onClick={() => send({ type: 'REVEAL', isHost: true })}
            >
              Onthul antwoord
            </button>

            {!isEndOfRound && !isLastQuestion && (
              <button
                className="host-ctrl-btn secondary"
                disabled={phase !== 'reveal'}
                onClick={() => send({ type: 'NEXT_QUESTION', isHost: true })}
              >
                Volgende vraag
              </button>
            )}

            {(isEndOfRound || isLastQuestion) && (
              <button
                className="host-ctrl-btn secondary"
                disabled={phase !== 'reveal'}
                onClick={() => send({ type: 'NEXT_QUESTION', isHost: true })}
              >
                {isLastQuestion ? 'Eindstand tonen' : 'Naar leaderboard'}
              </button>
            )}

            <div className="host-divider" />
            <div className="host-section-label">Stand</div>
            <Leaderboard teams={teams} />
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Verify**
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**
```bash
git add src/components/host/
git commit -m "feat: add HostView with PIN gate, controls, live chart"
```

---

## Task 12: Round title card + App wiring

**Files:**
- Create: `src/components/shared/RoundTitleCard.tsx`
- Create: `src/components/shared/RoundTitleCard.css`
- Create: `src/App.tsx`

- [ ] **Step 1: Create `src/components/shared/RoundTitleCard.css`**
```css
.round-card {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.4s ease;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes slam {
  0%   { transform: scale(2.5); opacity: 0; }
  60%  { transform: scale(0.95); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes floatUp {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

/* ── Base card ── */
.round-card.base {
  background: #0A0A0F;
  color: #E8E8E8;
}
.round-card.base .rc-round-label {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1rem;
  letter-spacing: 4px;
  color: #555;
  margin-bottom: 12px;
}
.round-card.base .rc-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 3.5rem;
  letter-spacing: 3px;
  animation: slam 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

/* ── Qmusic card ── */
.round-card.qmusic {
  background: #E8201E;
  color: #fff;
}
.round-card.qmusic .rc-logo {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.2rem;
  font-weight: 900;
  color: #fff;
  background: rgba(255,255,255,0.15);
  padding: 6px 16px;
  border-radius: 4px;
  margin-bottom: 20px;
  letter-spacing: 2px;
}
.round-card.qmusic .rc-round-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
  margin-bottom: 10px;
}
.round-card.qmusic .rc-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 3rem;
  font-weight: 900;
  text-transform: uppercase;
  animation: slam 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}

/* ── Joe card ── */
.round-card.joe {
  background: #2B72D4;
  color: #fff;
  overflow: hidden;
}
.round-card.joe::before {
  content: '';
  position: absolute;
  width: 600px; height: 600px;
  background: rgba(255,255,255,0.05);
  border-radius: 50%;
  top: -200px; right: -200px;
}
.round-card.joe .rc-logo {
  font-family: 'Nunito', sans-serif;
  font-size: 4rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: -3px;
  animation: floatUp 0.6s ease 0.1s both;
  margin-bottom: 16px;
}
.round-card.joe .rc-logo span { color: #E8365D; }
.round-card.joe .rc-round-label {
  font-family: 'Nunito', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.6);
  margin-bottom: 10px;
  animation: floatUp 0.6s ease 0.3s both;
}
.round-card.joe .rc-title {
  font-family: 'Nunito', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  animation: floatUp 0.6s ease 0.5s both;
  text-align: center;
}
```

- [ ] **Step 2: Create `src/components/shared/RoundTitleCard.tsx`**
```tsx
import { useEffect } from 'react'
import './RoundTitleCard.css'

const ROUND_TITLES = ['', 'De wereld verandert', 'Hoe doen anderen het?', 'Q-ronde', 'Joe-ronde']

type Props = {
  round: number
  onDone: () => void
  durationMs?: number
}

export function RoundTitleCard({ round, onDone, durationMs = 3000 }: Props) {
  useEffect(() => {
    const id = setTimeout(onDone, durationMs)
    return () => clearTimeout(id)
  }, [onDone, durationMs])

  const theme = round === 3 ? 'qmusic' : round === 4 ? 'joe' : 'base'
  const title = ROUND_TITLES[round] ?? ''

  return (
    <div className={`round-card ${theme}`} onClick={onDone}>
      {theme === 'qmusic' && <div className="rc-logo">QMUSIC</div>}
      {theme === 'joe' && <div className="rc-logo">joe<span>.</span></div>}
      <div className="rc-round-label">RONDE {round}</div>
      <div className="rc-title">{title}</div>
    </div>
  )
}
```

- [ ] **Step 3: Create `src/App.tsx`**
```tsx
import { useState, useEffect, useRef } from 'react'
import { useGameSocket } from './hooks/useGameSocket'
import { ThemeProvider } from './components/shared/ThemeProvider'
import { PlayerView } from './components/player/PlayerView'
import { HostView } from './components/host/HostView'
import { RoundTitleCard } from './components/shared/RoundTitleCard'

const isHost = window.location.pathname === '/host'

export default function App() {
  const { gameState, send, teamId } = useGameSocket()
  const [showRoundCard, setShowRoundCard] = useState(false)
  const prevRound = useRef<number>(1)
  const prevPhase = useRef<string | null>(null)

  // Show round title card when transitioning to a new round's first question
  useEffect(() => {
    if (!gameState) return
    const { phase, currentRound } = gameState

    if (
      phase === 'question' &&
      prevPhase.current === 'leaderboard' &&
      currentRound !== prevRound.current
    ) {
      setShowRoundCard(true)
    }
    // Also show card at game start for round 1
    if (phase === 'question' && prevPhase.current === 'lobby' && currentRound === 1) {
      setShowRoundCard(true)
    }

    prevRound.current = currentRound
    prevPhase.current = phase
  }, [gameState?.phase, gameState?.currentRound])

  return (
    <ThemeProvider gameState={gameState}>
      {showRoundCard && gameState && (
        <RoundTitleCard
          round={gameState.currentRound}
          onDone={() => setShowRoundCard(false)}
        />
      )}
      {isHost
        ? <HostView gameState={gameState} send={send} />
        : <PlayerView
            gameState={gameState ?? { phase: 'lobby', currentQuestion: 0, currentRound: 1, teams: [], answers: [] }}
            teamId={teamId}
            send={send}
          />
      }
    </ThemeProvider>
  )
}
```

- [ ] **Step 4: Verify**
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Commit**
```bash
git add src/components/shared/RoundTitleCard.tsx src/components/shared/RoundTitleCard.css src/App.tsx
git commit -m "feat: add RoundTitleCard animations and App routing"
```

---

## Task 13: End screen with confetti

**Files:**
- Create: `src/components/player/EndScreen.tsx`
- Create: `src/components/player/EndScreen.css`
- Modify: `src/components/player/PlayerView.tsx` (replace finished state with EndScreen)

- [ ] **Step 1: Create `src/components/player/EndScreen.css`**
```css
.end-screen {
  min-height: 100vh;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  gap: 24px;
  text-align: center;
}
.end-title {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 900;
  color: var(--color-text);
  letter-spacing: 2px;
}
.end-subtitle {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  max-width: 300px;
  line-height: 1.5;
}
.end-lb { width: 100%; max-width: 360px; }
.end-lb-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
}
.end-lb-row:last-child { border-bottom: none; }
.end-lb-rank { font-size: 1.1rem; min-width: 32px; }
.end-lb-name { flex: 1; font-weight: 600; color: var(--color-text); font-size: 0.95rem; }
.end-lb-score { font-weight: 700; color: var(--color-accent); font-size: 0.95rem; }
.end-lb-me { background: rgba(var(--color-accent-rgb), 0.08); border-radius: 8px; }
```

- [ ] **Step 2: Create `src/components/player/EndScreen.tsx`**
```tsx
import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import type { Team } from '../../types/game'
import './EndScreen.css'

const RANK_EMOJI = ['🥇', '🥈', '🥉']

type Props = { teams: Team[]; teamId: string }

export function EndScreen({ teams, teamId }: Props) {
  useEffect(() => {
    const duration = 4000
    const end = Date.now() + duration
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#E8201E', '#2B72D4', '#E8365D'] })
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#E8201E', '#2B72D4', '#fff'] })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [])

  const sorted = [...teams].sort((a, b) => b.score - a.score)

  return (
    <div className="end-screen">
      <div className="end-title">EINDSTAND 🏆</div>
      <div className="end-subtitle">Tot straks in de sessie!</div>
      <div className="end-lb">
        {sorted.map((team, i) => (
          <div key={team.id} className={`end-lb-row ${team.id === teamId ? 'end-lb-me' : ''}`}>
            <span className="end-lb-rank">{RANK_EMOJI[i] ?? `${i + 1}`}</span>
            <span className="end-lb-name">{team.name}{team.id === teamId ? ' (jij)' : ''}</span>
            <span className="end-lb-score">{team.score} pts</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Update `PlayerView.tsx` — replace inline finished state with EndScreen**

In `src/components/player/PlayerView.tsx`, change the finished branch:
```tsx
// Add import at top:
import { EndScreen } from './EndScreen'

// Replace the 'finished' case in the leaderboard/finished block:
if (phase === 'finished') {
  return <EndScreen teams={teams} teamId={teamId} />
}
```

The `phase === 'leaderboard'` block remains unchanged (shows between-round leaderboard).

- [ ] **Step 4: Verify**
```bash
npx tsc --noEmit && npm run build
```
Expected: no errors, build succeeds.

- [ ] **Step 5: Commit**
```bash
git add src/components/player/EndScreen.tsx src/components/player/EndScreen.css src/components/player/PlayerView.tsx
git commit -m "feat: add end screen with confetti"
```

---

## Task 14: Local dev smoke test + deploy config

**Files:**
- Create: `README.md`
- Verify: `public/_redirects`, `.env.example`

- [ ] **Step 1: Start local dev server**

In terminal 1:
```bash
npx partykit dev
```
Expected: PartyKit server on `localhost:1999`.

In terminal 2:
```bash
npm run dev
```
Expected: Vite dev server on `localhost:5173`.

- [ ] **Step 2: Smoke test the player flow**

1. Open `http://localhost:5173` — see lobby, enter a team name, click "Doe mee"
2. Open `http://localhost:5173/host` — enter PIN `qjhost2025`, see host lobby with your team
3. Click "Start quiz" — both tabs should show Q1 simultaneously
4. Answer a question on the player tab — bar chart updates on host
5. Click "Onthul antwoord" on host — correct answer shows on both screens
6. Click "Volgende vraag" — Q2 appears
7. Play to Q5, reveal → click "Naar leaderboard" → leaderboard appears on both screens
8. Click "Start Ronde 2" → Q6 starts (no theme change yet)
9. Play to Q10, advance to Round 3 → Qmusic theme transition fires
10. Play to Q20, click "Eindstand tonen" → EndScreen with confetti

- [ ] **Step 3: Fix any issues found during smoke test**

Common issues to watch for:
- Timer not resetting between questions → check `key={currentQuestion}` prop on `<Timer>`
- Theme not switching → check `data-theme` attribute in browser DevTools
- Answers not clearing between questions → check `SUBMIT_ANSWER` handler in server
- Round card not showing → check `prevPhase.current` logic in App.tsx

- [ ] **Step 4: Create `README.md`**
```markdown
# Q&J Pubquiz

Real-time multiplayer pub quiz voor de Q&J leadership session.

## Setup in 5 stappen

1. **Clone & installeer**
   ```bash
   git clone <repo-url>
   cd <repo>
   npm install
   ```

2. **Deploy PartyKit server**
   ```bash
   npx partykit login
   npx partykit deploy
   ```
   Noteer de URL: `your-project.username.partykit.dev`

3. **Stel environment variable in**

   In Cloudflare Pages dashboard → Settings → Environment variables:
   ```
   VITE_PARTYKIT_HOST = your-project.username.partykit.dev
   ```

4. **Deploy naar Cloudflare Pages**

   Verbind je GitHub repo in het Cloudflare Pages dashboard:
   - Build command: `npm run build`
   - Output directory: `dist`

5. **Start de quiz**

   - **Spelers**: open de Cloudflare Pages URL op hun laptop
   - **Host**: open `<url>/host` en log in met PIN `qjhost2025`

## Lokaal ontwikkelen

```bash
# Terminal 1
npx partykit dev

# Terminal 2
npm run dev
```

Open `http://localhost:5173` (speler) en `http://localhost:5173/host` (host).
```

- [ ] **Step 5: Final build check**
```bash
npm run build
```
Expected: `dist/` generated, no TypeScript or build errors.

- [ ] **Step 6: Final commit**
```bash
git add README.md public/_redirects .env.example
git commit -m "feat: add deploy config and README"
```

---

## Self-Review Checklist

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| Lobby: team joins, server broadcasts | Task 4 (server JOIN), Task 8 (Lobby) |
| Host PIN gate | Task 11 |
| Question phase: timer, answer buttons, lock | Tasks 7, 9 |
| Live bar chart on host | Task 10 |
| Reveal: correct/incorrect, explanation, scores | Tasks 4 (REVEAL), 9 |
| Mini leaderboard on host after each question | Task 11 (Leaderboard in right panel) |
| Full leaderboard on all screens after each round | Tasks 9, 11 |
| 25s timer R1/R2, 20s timer R3, 25s timer R4 | Task 3 (getTimerForRound), Task 7 |
| Qmusic theme: white+red, Montserrat, red banner | Tasks 5, 9 (CSS), 12 (RoundTitleCard) |
| Joe theme: cobalt blue, Nunito, pill buttons | Tasks 5, 9 (CSS), 12 (RoundTitleCard) |
| Round title card with brand animation | Task 12 |
| Opinion questions Q15/Q20 (correctIndex -1 for Q20) | Task 3 |
| Game reset button (host) | Task 11 |
| End screen + confetti | Task 13 |
| `public/_redirects` for SPA routing | Task 1 |
| `.env.example` | Task 1 |
| README: 5-step deploy | Task 14 |

**All items covered. No gaps found.**
