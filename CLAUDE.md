# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

`qj-pubquiz` is a real-time pub quiz app, currently at an early scaffold stage:

- `src/App.tsx` / `src/App.css` still contain the default Vite + React starter content (counter demo, Vite/React links, hero image) — not yet the actual quiz UI.
- `party/server.ts` is an empty file (0 bytes) — the PartyKit backend has not been implemented yet, and there is no `partykit.json` config.
- `partykit` and `partysocket` are already installed as dependencies but not yet wired up.

Expect to build most application logic from scratch rather than extend existing quiz behavior.

## Commands

```bash
npm install         # Install dependencies
npm run dev         # Start dev server (Vite, localhost:5173)
npm run build       # Type-check + production build (tsc -b && vite build)
npm run lint        # ESLint
npm run preview     # Preview production build locally
```

PartyKit server (real-time backend):
```bash
npx partykit dev   # Run PartyKit server locally alongside Vite
```
There is no `partykit.json` yet — `partykit dev`/`deploy` will need a config (or a `--main party/server.ts` flag) once the server is implemented.

## Architecture

This app has two runtime layers:

**Frontend** (`src/`) — React 19 + TypeScript + Vite 8.
- Entry chain: `index.html` → `src/main.tsx` → `src/App.tsx`.
- Styling: Tailwind v4, CSS-native via PostCSS (`@tailwindcss/postcss`, configured in `postcss.config.js`) — there is no `tailwind.config.js`. Design tokens (colors, fonts, letter-spacing, shadows, dark mode via `prefers-color-scheme`) are defined as CSS custom properties in `src/index.css`. Component/page-level styles use Tailwind v4's nested CSS syntax in `src/App.css`.
- `src/assets/` holds images/SVGs imported directly by components (e.g. `hero.png`). `public/` holds static files served as-is (`favicon.svg`, `icons.svg` sprite, `_redirects`).

**Real-time backend** (`party/server.ts`) — PartyKit server, currently empty. Intended to handle WebSocket connections for live quiz state (questions, scores, player sync). The frontend will connect via `partysocket`, using `VITE_PARTYKIT_HOST` from the environment.

## TypeScript / lint conventions

- Strict TS config (`tsconfig.app.json` for `src/`, `tsconfig.node.json` for `vite.config.ts`): `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `erasableSyntaxOnly`, and `verbatimModuleSyntax` — use `import type { Foo } from '...'` for type-only imports.
- `moduleResolution: bundler`, target `es2023`, ES modules only (`"type": "module"` in `package.json`).
- ESLint flat config (`eslint.config.js`): `@eslint/js` recommended, `typescript-eslint` recommended, `eslint-plugin-react-hooks` (flat recommended), `eslint-plugin-react-refresh` (Vite preset). `dist/` is ignored.

## Environment

Copy `.env.example` to `.env.local` and set `VITE_PARTYKIT_HOST` to your PartyKit project URL (e.g. `your-project.your-username.partykit.dev`) before running against a real deployment. `.env.local` and other `*.local` files are gitignored.

## Deployment

`public/_redirects` is a Netlify/Cloudflare Pages SPA redirect rule — all routes serve `index.html`.
