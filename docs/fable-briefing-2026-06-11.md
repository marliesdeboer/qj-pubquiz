# Briefing voor Claude Fable — Herontwerp Q&J Pubquiz

> Kopieer (een aangepaste versie van) onderstaande tekst naar Fable. Geef Fable toegang tot deze repository — de briefing verwijst naar bestaande bestanden die de canonieke bron van waarheid zijn.

## 1. Context & doel

Dit is **geen feestje-quiz, maar een tool voor een leiderschapssessie** van Q-music en Joe (radiomerken van DPG Media). De quiz bestaat uit 20 vragen verdeeld over 4 rondes en volgt de opbouw:

> wereldtrends → internationale voorbeelden → Qmusic → Joe

Doel van de sessie: het management meenemen in de strategische verschuiving "van radio naar content". Elke vraag heeft een `explanation` met daarin een "so what"-conclusie/discussievraag — **die conclusie is het eigenlijke product van de quiz**. De quiz zelf is de aanleiding voor het gesprek dat erna volgt.

De volledige inhoud (vragen, opties, antwoorden, uitleg, bronnen, media-aanduidingen) staat in `qj-quiz-content.json` (root van de repo) — dit is de canonieke contentbron. `src/data/questions.ts` is de implementatie die client en server gebruiken en moet hiermee in sync blijven (zie `CLAUDE.md` voor de volledige architectuurbeschrijving).

**Sessiedatum:** 6 juli 2026 — binnen enkele weken vanaf nu (11 juni 2026). Hoge urgentie: lever in één keer een werkend, gepolijst resultaat op (geen tussentijdse stijlgids-review nodig — eventuele finetuning gebeurt daarna handmatig).

## 2. Scope & vrijheid

Bouw voort op de bestaande repository (React + TypeScript + Vite, PartyKit voor real-time state, Cloudflare Pages + partykit.dev hosting — zie `CLAUDE.md`). Behoud deze stack en het hosting-model.

Binnen die kaders heb je veel vrijheid:

- **Visueel/interactie-design**: volledig herontwerpen, zie sectie 3.
- **Content**: vragen/teksten mogen worden verbeterd of vervangen (zie sectie 4), zolang de structuur (4 rondes × 5 vragen, opbouw extern → Q → Joe, vraag 15 en 20 zijn polls zonder goed/fout) intact blijft.
- **Nieuwe ideeën**: voorstellen voor nieuwe rondetypes/features mogen, zolang het kernformat (host-scherm + spelers op eigen device, real-time via WebSocket, 20 vragen/4 rondes) overeind blijft.
- **Niet wijzigen**: de fundamentele state-architectuur (server-authoritative state in `party/server.ts`, clients zonder eigen state) en het feit dat spelers nooit media/uitleg/bronnen te zien krijgen (zie sectie 5).

## 3. Visuele herontwerp

### 3.1 Stijlrichting

Referentie voor sfeer en kwaliteitsniveau: **https://grandtourquiz.netlify.app/** — donkere/zwarte basis, grote uitgesproken display-typografie (Bebas Neue-achtig), glazen/transparante kaarten met subtiele randen, pil-vormige knoppen met zachte hover/scale-animatie, sparkle/cirkel-decoratie als signatuur. Til dit naar een professioneler, "chiquer" niveau dan de huidige implementatie (huidige stijl: volle felle achtergrondkleur per ronde, zie `src/styles/themes.css`).

### 3.2 Rondestructuur en branding (belangrijke correctie)

De huidige code (`getThemeForRound()` in `App.tsx` + `src/styles/themes.css`) wisselt qmusic/joe-thema's af per ronde (1&3 = qmusic, 2&4 = joe). **Dit klopt niet met de canonieke content.** Volgens `qj-quiz-content.json`:

- **Ronde 1** ("De wereld verandert") en **Ronde 2** ("Hoe doen anderen het?") zijn de "externe" rondes — neutraal/ingetogen thema.
- **Ronde 3** ("De Q-ronde") moet **onmiddellijk herkenbaar zijn als het échte Qmusic-merk**.
- **Ronde 4** ("De Joe-ronde") moet **onmiddellijk herkenbaar zijn als het échte Joe-merk**.

Volg deze rondestructuur (3 thema's: neutraal, Qmusic, Joe — niet 2 alternerende thema's).

**Belangrijk:** ook in ronde 1 en 2 moeten de merken Q en Joe — al is het subtiel — herkenbaar aanwezig zijn (bijv. via accentkleuren, typografische details, of decoratieve elementen), zodat de hele quiz als één geheel voelt en niet als losse onderdelen.

Voor ronde 3 en 4: zoek de actuele merkidentiteit van Qmusic en Joe op (kleuren, typografie, sfeer — publiek beschikbare bronnen: websites, apps, social media) en vertaal die naar de donkere/chique basisstijl uit 3.1. De merkkleur mag het signatuur-accent zijn; het hoeft niet per se de volledige achtergrond te vullen als dat de merkidentiteit beter recht doet — gebruik je beste oordeel als UI/UX-designteam.

### 3.3 Micro-interacties & polish

Overal een gepolijst gevoel: subtiele hover/tap-states op knoppen, vloeiende fase-overgangen (lobby → vraag → reveal → leaderboard), en de bestaande `RoundTitleCard`-overgangen meenemen in de herstijling (incl. de subtiele Q/Joe-verwijzing uit 3.2).

## 4. Content & fact-check

**Volledige re-check (hard vereist):** controleer elk cijfer en elke bron-URL in `qj-quiz-content.json` (alle 20 vragen) opnieuw. Dit wordt getoond aan en bediscussieerd door het management — onjuiste of niet meer kloppende data is niet acceptabel.

- Waar data verouderd, niet meer vindbaar of onjuist blijkt: actualiseer of vervang door een vergelijkbaar feit dat aantoonbaar wel klopt, met bijgewerkte `source`.
- Let in het bijzonder op vragen die in de JSON al gemarkeerd zijn als indicatief/aan te vullen (bv. V11, V14 — `"note"`-velden met "INDICATIEF" of "vul aan").
- Vragen mogen herschreven worden als dat de "so what"-lijn van de sessie (zie sectie 1) beter onderbouwt.

**Sync verplicht:** werk zowel `qj-quiz-content.json` als `src/data/questions.ts` bij en houd ze inhoudelijk gelijk (per de afspraak in `CLAUDE.md`).

## 5. Host-view = podiumscherm, speler-view = kaal

De host-view wordt **op een groot scherm getoond voor de hele groep** — dit is geen bedieningspaneel voor de quizmaster alleen, maar het centrale podiumscherm. Consequenties:

- Moet van afstand goed leesbaar en visueel sterk zijn.
- Bij reveal: het juiste antwoord + de onderbouwende data/grafiek/video/voorbeeld worden **prominent en automatisch** getoond (niet langer een optionele "▶ Toon media"-knop die kan verdwijnen) — dit is het kernmoment van elke vraag.
- De "so what"-conclusie uit `explanation` mag zichtbaar worden voor de zaal (momenteel host-only uitlegtekst) — dit is het hele punt van de sessie.
- Dit reveal-moment is de primaire focus van de "wow-factor"-animatie.

**Speler-view blijft bewust kaal**: alleen de vraag en antwoordopties, geen media, geen uitleg, geen bronnen. Dit principe verandert niet.

## 6. Media

`public/media/media-manifest.json` bevat 6 ontbrekende bestanden (V3, V6, V8, V12, V16, V18, V19 — video/image/audio, status `"ontbreekt"`). Zoek en lever deze daadwerkelijk aan (of kies gelijkwaardige, beter passende media als de huidige suggestie niet goed werkt of niet vindbaar is) zodat de host-view ze kan tonen tijdens de reveal.

Charts (`media.type === "chart"`) blijven in-app gerenderd — geen externe assets nodig, zie sectie 7.

## 7. Datavisualisatie / charts

`src/components/shared/ChartView.tsx` rendert de chart-vragen nu functioneel maar basic. Herontwerp dit volledig naar **consultancy-deck kwaliteit (ThinkCell-niveau)**:

- Strakke typografie voor labels en waardes, ingetogen kleurgebruik (één accentkleur passend bij het rondethema + grijstinten — geen regenboogpalet)
- Nette assen/proporties, accurate weergave van de data uit `media.data`
- Subtiele reveal-animatie (bars die groeien, getallen die op-tellen)
- Optioneel een licht infographic-accent (icoon, korte annotatie/pijl bij het kernpunt) waar dat de boodschap versterkt — spaarzaam, niet decoratief
- Blijf de bestaande logica respecteren voor `note`/mixed-`unit` data (stat cards i.p.v. gedeelde-as bar chart, zie huidige implementatie)

## 8. Niet-onderhandelbaar (samenvatting)

- Stack: React + TypeScript + Vite + PartyKit, Cloudflare Pages + partykit.dev
- Server-authoritative state, clients zonder eigen state, volledige `GameState`-snapshot per broadcast
- 4 rondes × 5 vragen, opbouw extern → Q → Joe, vraag 15 & 20 = polls zonder goed/fout
- Speler-view: alleen vraag + opties, nooit media/uitleg/bronnen
- `qj-quiz-content.json` en `src/data/questions.ts` blijven gesynchroniseerd
- Alle getoonde data moet feitelijk kloppen en herleidbaar zijn naar een bron

## 9. Werkwijze

Pak in één keer door: visueel herontwerp, content-/factcheck, media-aanlevering en chart-herontwerp gecombineerd opleveren. Na oplevering wordt er handmatig gefinetuned (met Claude Code/Sonnet) op basis van het resultaat.
