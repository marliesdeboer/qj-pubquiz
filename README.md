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
