import type { Question } from '../types/game'

export const QUESTIONS: Question[] = [
  // ── RONDE 1: De wereld verandert ─────────────────────────────────
  {
    id: 'V1', round: 1, type: 'quiz',
    question: 'Hoeveel procent van alle digitale reclame-inkomsten in Nederland verdwijnt naar internationale platforms als Google en Meta?',
    options: ['~60%', '~70%', '~80%', '~90%'],
    answerIndex: 2,
    explanation: '~80% van alle digitale reclame-euro\'s gaat naar internationale techplatforms. Dat is geld dat niet naar Nederlandse media, radio of uitgevers vloeit. De strijd om aandacht is ook een strijd om advertentiebudget.',
    source: '',
    media: {
      type: 'chart', chartType: 'donut',
      title: 'Digitale reclame-inkomsten NL',
      data: [
        { label: 'Google, Meta & overige platforms', value: 80 },
        { label: 'Nederlandse media', value: 20 },
      ],
      unit: '%',
    },
  },
  {
    id: 'V2', round: 1, type: 'quiz',
    question: 'Een radiostation zond zes maanden lang een dagelijkse show uit met een AI-presentator, zonder het te vertellen. Waar?',
    options: ['Duitsland', 'Australië', 'Japan', 'Verenigd Koninkrijk'],
    answerIndex: 1,
    explanation: 'Australië. Station CADA (Sydney), show \'Workdays with Thy\', nov 2024–apr 2025. De stem werd via ElevenLabs gekloond van een echte medewerker. Omdat de show zonder aankondiging werd uitgezonden en direct na het uitbreken van de mediastorm offline is gehaald, heeft moederbedrijf ARN alle sporen verwijderd.',
    source: 'Global News, april 2025 — https://globalnews.ca/news/11159415/cada-radio-station-ai-host-backlash/',
    media: {
      type: 'video',
      description: 'Nieuwsclip over de CADA \'Thy\'-onthulling',
      sourceUrl: 'https://globalnews.ca/news/11159415/cada-radio-station-ai-host-backlash/',
      searchTerm: 'CADA radio AI host Thy',
      extraImage: 'V2-thy',
      extraImageExt: 'jpg',
    },
  },
  {
    id: 'V3', round: 1, type: 'quiz',
    question: 'Welk deel van alle Spotify-royalty\'s gaat inmiddels naar onafhankelijke artiesten en labels?',
    options: ['~10%', '~25%', '~50%', '~75%'],
    answerIndex: 2,
    explanation: '~50% — ruim $5,5 mld van de $11 mld die Spotify in 2025 uitkeerde. De drempel om audio te maken is bijna nul. Schaarste zat vroeger in de zender; nu in aandacht, smaak en merk.',
    source: 'Spotify Loud & Clear 2026 — https://newsroom.spotify.com/2026-03-11/loud-and-clear-music-economics-highlights/',
    media: {
      type: 'chart', chartType: 'donut',
      title: 'Spotify-royalty\'s 2025 ($11 mld)',
      data: [{ label: 'Indie-artiesten & labels', value: 50 }, { label: 'Majors & overig', value: 50 }],
      unit: '%',
    },
  },
  {
    id: 'V4', round: 1, type: 'quiz',
    question: 'Ook lineaire TV staat erg onder druk. Waar ligt de strategische relevantie van dit medium?',
    options: [
      'Live TV (sport, nieuws, actualiteiten)',
      'Het is een dagelijkse gewoonte, bijv. bij series zoals GTST',
      'Kijker hoeft niet na te denken over wat het wil kijken',
      'Die is er niet',
    ],
    answerIndex: 0,
    explanation: 'Alle drie zijn tot op zekere hoogte waar. Maar de toekomstige strategische waarde zit met name bij de urgentie van live TV — niemand wil sportverslagen of breaking news terugkijken.',
    source: '',
    media: {
      type: 'image',
      description: 'Live sport op lineaire TV: Champions League, Formule 1, Olympische Spelen',
      searchTerm: 'lineaire TV live sport Champions League',
    },
  },
  {
    id: 'V5', round: 1, type: 'quiz',
    question: 'Wat is wereldwijd inmiddels het grootste platform om podcasts te beluisteren?',
    options: ['Spotify', 'YouTube', 'Apple Podcasts', 'TikTok'],
    answerIndex: 1,
    explanation: 'YouTube — ruim 1 miljard maandelijkse podcast-kijkers sinds 2025. Podcast is geen audiomedium meer maar een videomedium: mensen kíjken naar Joe Rogan.',
    source: 'Variety / Edison Podcast Metrics 2025 — https://variety.com/2025/digital/news/youtube-2025-monthly-podcast-listeners-viewers-1236319232/',
    media: {
      type: 'chart', chartType: 'bar',
      title: 'Voorkeursplatform voor podcasts (VS)',
      data: [
        { label: 'YouTube', value: 31 },
        { label: 'Spotify', value: 27 },
        { label: 'Apple Podcasts', value: 15 },
        { label: 'Overig', value: 27 },
      ],
      unit: '%',
      maxValue: 100,
    },
  },

  // ── RONDE 2: Hoe doen anderen het? ───────────────────────────────
  {
    id: 'V6', round: 2, type: 'quiz',
    question: 'De grote Britse radiogroep Bauer (Kiss FM, Absolute Radio) bracht in 2024 zijn ruim 50 zenders samen onder één digitaal merkplatform. Wat is de strategische kern?',
    options: [
      'Kosten besparen op techniek',
      'Niet langer losse zenders, maar één merk-bestemming voor radio, podcast én muziek',
      'Stoppen met FM',
      'Fuseren met de BBC',
    ],
    answerIndex: 1,
    explanation: 'De zender wordt een kanaal binnen het merk. Het platform heet \'Rayo\'. In plaats van afhankelijk te zijn van externe platforms en aggregators, migreert Bauer luisteraars naar eigen, gecontroleerde digitale platformen voor betere loyaliteit en gerichte content.',
    source: 'Bauer Media, juni 2024 — https://www.bauermedia.co.uk/news/say-hello-to-rayo-2/',
    media: {
      type: 'image',
      description: 'Rayo-app: losse zenders → één merkplatform',
      searchTerm: 'Bauer Rayo app',
    },
  },
  {
    id: 'V7', round: 2, type: 'quiz',
    question: 'Bij The New York Times gaat inmiddels meer gebruikstijd naar één productcategorie dan naar het nieuws zelf. Welke?',
    options: ['Recensies (Wirecutter)', 'Games (Wordle, Connections)', 'Sport (The Athletic)', 'Koken'],
    answerIndex: 1,
    explanation: 'Games. Abonnees besteden meer tijd aan de spelletjes dan aan de digitale krant; in 2025 werden NYT-games 11,2 miljard keer gespeeld. Mensen komen binnen voor Wordle en blijven voor het nieuws.',
    source: 'AP/ABC News, jan 2026 — https://abcnews.go.com/Business/wireStory/new-york-times-2-player-game-evolving-business-129417985',
    media: {
      type: 'chart', chartType: 'bar',
      title: 'NYT Games in 2025',
      data: [
        { label: 'Potjes gespeeld (alle games)', value: 11.2, unit: ' mld' },
        { label: 'Waarvan Wordle', value: 4.2, unit: ' mld' },
      ],
      note: 'Abonnees besteden meer tijd aan Games dan aan het digitale nieuws (YipitData).',
    },
  },
  {
    id: 'V8', round: 2, type: 'quiz',
    question: 'Een Brits bedrijf dat eind 2020 begon met één geschiedenispodcast vult inmiddels de O2 Arena (20.000 man) met een live podcast-show. Hoe heet het netwerk?',
    options: ['Wondery', 'Goalhanger ("The Rest Is...")', 'BBC Studios', 'Spotify Studios'],
    answerIndex: 1,
    explanation: 'Goalhanger. 14 shows, 1,8 miljard views en streams in 2025, 50.000 betalende leden (jan 2026). Leden betalen gemiddeld £6 per maand of £60 per jaar, met een grofweg 50/50-verdeling tussen maandelijkse en jaarlijkse abonnementen. Geen radiozender, geen omroep — een contentbedrijf gebouwd op audio.',
    source: 'Press Gazette — https://pressgazette.co.uk/podcasts/podcasts-youtube-goalhanger/ ; Podnews, jan 2026 — https://podnews.net/press-release/goalhanger-250k',
    media: {
      type: 'image',
      description: 'Het Goalhanger-netwerk: van één geschiedenispodcast naar 14 shows',
      searchTerm: 'Goalhanger podcast network shows',
      extraImage: 'V8-o2',
      extraImageExt: 'webp',
    },
  },
  {
    id: 'V9', round: 2, type: 'quiz',
    question: 'Hoe verdient de grootste YouTuber ter wereld, MrBeast (28), z\'n geld?',
    options: [
      'Met advertenties op z\'n YouTube-kanaal',
      'Met de verkoop van chocolade (Feastables)',
      'Met een reality show voor Amazon Prime',
      'B én C — chocolade plus een Amazon-deal',
    ],
    answerIndex: 3,
    explanation: 'Zijn YouTube-video\'s zijn een verliespost: $80M verlies op media (bij $246M omzet). De winst zit in het merk en de producten erachter: $20M winst op Feastables (bij $250M omzet) en een exclusieve deal van $100 miljoen met Amazon MGM Studios voor de realityserie Beast Games op Prime Video.',
    source: 'Fortune, 2025 — https://fortune.com/2025/03/11/youtube-biggest-star-mrbeast-makes-more-money-chocolate-videos/',
    media: {
      type: 'video',
      description: 'MrBeast over zijn businessmodel',
      sourceUrl: 'https://www.youtube.com/watch?v=jaRfBM7ESfc',
      searchTerm: 'MrBeast Feastables business model',
    },
  },
  {
    id: 'V10', round: 2, type: 'quiz',
    question: 'Taylor Swift\'s Eras Tour werd de eerste tour in de geschiedenis die een bepaalde grens doorbrak. Welke?',
    options: ['$1 miljard', '$2 miljard', '$3 miljard', '$5 miljard'],
    answerIndex: 1,
    explanation: '$2 miljard ($2,077 mld). Voor steeds meer artiesten is de tour de business geworden; muziekverkoop en -streaming is bijna de marketing voor het optreden.',
    source: 'Variety, dec 2024 — https://variety.com/2024/music/news/taylor-swift-2-billion-eras-tour-gross-1236243254/',
    media: {
      type: 'chart', chartType: 'bar',
      title: 'Hoogste tour-omzet ooit',
      data: [
        { label: 'Eras Tour (Swift)', value: 2.08 },
        { label: 'Music of the Spheres (Coldplay)', value: 1.5 },
        { label: 'Farewell Yellow Brick Road (Elton John)', value: 0.94 },
      ],
      unit: ' mld $',
    },
  },

  // ── RONDE 3: De Q-ronde ──────────────────────────────────────────
  {
    id: 'V11', round: 3, type: 'quiz',
    question: 'Qmusic is de bereikleider van Nederland. Wat is het wekelijks bereik (2026, afgerond)?',
    options: ['2,4 mln', '3,3 mln', '4,4 mln', '6,0 mln'],
    answerIndex: 2,
    explanation: '~4,4 mln wekelijks bereik — het grootste van alle Nederlandse zenders. Let op: op marktaandeel (luistertijd) is NPO Radio 2 marktleider.',
    source: 'NMO Luisteronderzoek week 19-2026 — https://radiowereld.nl/medianieuws/2026/05/nmo-luisteronderzoek-week-19-2026-npo-radio-2-is-marktleider/',
    media: {
      type: 'chart', chartType: 'bar',
      title: 'Qmusic in het NMO-luisteronderzoek (2026)',
      data: [
        { label: 'Wekelijks bereik — nr. 1 van NL', value: 4.4, unit: ' mln' },
        { label: 'Marktaandeel — nr. 2 (na NPO Radio 2)', value: 11, unit: '%' },
      ],
      note: 'Grootste bereik, maar NPO Radio 2 wint op luistertijd.',
    },
  },
  {
    id: 'V12', round: 3, type: 'quiz',
    question: 'Vergelijk de Instagram-volgers van Marieke Elsinga met die van Qmusic NL zelf. Wat klopt?',
    options: [
      'Qmusic heeft meer volgers dan Marieke',
      'Ze zitten ongeveer op hetzelfde niveau',
      'Marieke heeft bijna twee keer zoveel als Qmusic',
      'Marieke heeft meer dan drie keer zoveel als Qmusic',
    ],
    answerIndex: 2,
    explanation: 'Marieke: 634K volgers, Qmusic NL: 334K. Het merk zit in de presentator, niet in de zender. Als Marieke vertrekt, vertrekt haar publiek mee. Tegelijk: Q heeft 4,4 miljoen wekelijkse luisteraars maar slechts 334K Instagram-volgers — de digitale conversie is mager.',
    source: 'Instagram @mariekeelsinga / @qmusicnl, juni 2026',
    media: {
      type: 'video',
      description: 'Instagram-volgers Marieke Elsinga vs Qmusic NL',
    },
  },
  {
    id: 'V13', round: 3, type: 'quiz',
    question: 'De Persgroep (het huidige DPG Media) kocht Noordzee FM in 2005 en hernoemde het tot Qmusic. Wat betaalden ze?',
    options: ['Niets', '€1', '€100.000', '€1 miljoen'],
    answerIndex: 1,
    explanation: '€1 — Talpa (John de Mol) moest de frequentie afstoten om Radio 538 te mogen kopen van de mededingingsautoriteit. De frequentie was de waarde, niet het merk.',
    source: 'Spreekbuis — https://www.spreekbuis.nl/qmusic-bestaat-15-jaar/',
    media: {
      type: 'image',
      ext: 'jpg',
      description: 'Qmusic 15 jaar — van Noordzee FM naar bereikleider',
      searchTerm: 'Qmusic Noordzee FM DPG Media geschiedenis',
    },
  },
  {
    id: 'V14', round: 3, type: 'quiz',
    question: 'Van de totale luistertijd bij 13-34-jarigen gaat nog maar een deel naar live radio. Hoeveel?',
    options: ['71%', '58%', '44%', '29%'],
    answerIndex: 2,
    explanation: '44%. Bij 50-plussers is dat nog 82% — bijna een factor 2 verschil. De radioluisteraar van nu vergrijst; de jonge luisteraar komt niet vanzelf terug.',
    source: 'NMO AudioMonitor 2024 — https://audify.nl/nieuws/live-radio-heeft-het-grootste-aandeel-in-de-totale-luistertijd/',
    media: {
      type: 'chart', chartType: 'bar',
      title: 'Aandeel live radio in luistertijd',
      data: [{ label: '13-34 jaar', value: 44 }, { label: '50+ jaar', value: 82 }],
      unit: '%',
      maxValue: 100,
    },
  },
  {
    id: 'V15', round: 3, type: 'poll',
    question: 'Wat is over tien jaar de grootste bedreiging voor het Qmusic en Joe businessmodel?',
    options: [
      'Spotify pikt de muziekluisteraar in',
      'AI-presentatoren vervangen duur talent',
      'Adverteerders verschuiven budget naar social media',
      'De FM-frequentie verdwijnt',
    ],
    answerIndex: null,
    explanation: 'Geen fout antwoord. Strategisch meest onderbouwd: C (advertentie-inkomsten zijn de levensader, en social biedt betere targeting en data). Maar let op B: na de CADA-vraag (V2) is dat ineens minder hypothetisch.',
    source: '',
    media: { type: 'poll', description: 'Live stemverdeling uit de quiz zelf — geen externe asset.' },
  },

  // ── RONDE 4: De Joe-ronde ────────────────────────────────────────
  {
    id: 'V16', round: 4, type: 'quiz',
    question: 'Wat was het marktaandeel van Joe bij de lancering in september 2023?',
    options: ['1%', '2,5%', '4%', '5%'],
    answerIndex: 2,
    explanation: 'Joe startte met een marktaandeel van 2,5% op de doelgroep 13+ en 4,1% in de doelgroep 35-59 jaar — een veelbelovende start voor een nieuw station.',
    source: 'Marketing Tribune, sept 2023 — https://www.marketingtribune.nl/media/nieuws/2023/09/luistercijfers-veel-belovende-start-joe-radio-10-fans-blijven-hangen/index.xml',
    media: {
      type: 'image',
      description: 'Joe marktaandeel bij lancering september 2023',
    },
  },
  {
    id: 'V17', round: 4, type: 'quiz',
    question: 'Hoeveel luisteraars (13+) luisterden wekelijks naar radio in 2025?',
    options: ['60%', '75%', '88%', '92%'],
    answerIndex: 2,
    explanation: 'Radio bereikt iedere week gemiddeld maar liefst 13,4 miljoen unieke Nederlanders 13+ jaar (88,4%). Per dag gemiddeld 8,9 miljoen unieke luisteraars (58,8%). Radio is nog lang niet dood.',
    source: 'Audify Audiojaarrapport 2025',
    media: {
      type: 'chart', chartType: 'bar',
      title: 'Radiobereik Nederland 2025',
      data: [
        { label: 'Wekelijks bereik 13+', value: 88.4, unit: '%' },
        { label: 'Dagelijks bereik 13+', value: 58.8, unit: '%' },
      ],
      maxValue: 100,
    },
  },
  {
    id: 'V18', round: 4, type: 'quiz',
    question: 'Wat gebeurt er met de investeringen in de audioreclamemarkt?',
    options: ['Groeiend', 'Blijft gelijk', 'Daalt'],
    answerIndex: 0,
    explanation: 'Investeringen in audioreclame zijn met 29,2% gestegen in de periode 2021-2025. Zowel spot, lineair digitaal als podcasts zijn gestegen. Spotreclame kreeg 85,7% van de netto investeringen; 4% ging naar podcasting — en podcasting groeide relatief het hardst: +190% afgelopen jaar.',
    source: 'Audify Audiojaarrapport 2025 — https://radiowereld.nl/medianieuws/2026/02/audioreclame-groeit-voor-vijfde-jaar-op-rij-en-bereikt-nieuw-record/',
    media: {
      type: 'chart', chartType: 'bar',
      title: 'Audioreclamemarkt 2021–2025',
      data: [
        { label: 'Totaalgroei audioreclame 2021-2025', value: 29.2, unit: '%' },
        { label: 'Groei podcasting 2024→2025', value: 190, unit: '%' },
      ],
    },
  },
  {
    id: 'V19', round: 4, type: 'quiz',
    question: 'Wat is radio\'s sterkste verdediging tegen on-demand audio?',
    options: [
      'De ochtendshow — habit forming in de ochtendpiek',
      'Live en lokaal, op het moment zelf',
      'Een groter muziekaanbod',
      'Persoonlijke aanbevelingen',
    ],
    answerIndex: 0,
    explanation: 'Word je onderdeel van iemands ochtendritueel, dan ben je moeilijk te vervangen. Daarom investeert Joe juist in de ochtend (Coen & Sander). B (live & lokaal) is een echt argument — maar habit is sterker, want dagelijks en automatisch. C en D zijn juist het terrein waar streaming wint.',
    source: 'Joe — ochtendshow Coen & Sander; Radiowereld, mei 2026 — https://radiowereld.nl/medianieuws/2026/05/joe-deejays-coen-en-sander-dagen-luisteraars-uit-zonder-telefoon/',
    media: {
      type: 'audio',
      description: 'Fragment of openingsleader van Coen & Sander (Joe-ochtend)',
      searchTerm: 'Coen en Sander Joe ochtendshow',
      extraImage: 'V19-coensander',
      extraImageExt: 'jpg',
    },
  },
  {
    id: 'V20', round: 4, type: 'poll',
    question: 'Als Joe en Qmusic over 10 jaar succesvol zijn, wat zijn ze dan waarschijnlijk?',
    options: [
      'Nog steeds radio — maar volledig digitaal',
      'Contentmerken met radio als één van de kanalen',
      'Opgegaan in een groter audioplatform',
      'Kleiner, maar sterker niche-product',
    ],
    answerIndex: null,
    explanation: 'Geen goed/fout. Dit is precies de vraag waar we de rest van de ochtend op ingaan.',
    source: '',
    media: { type: 'poll', description: 'Live stemverdeling uit de quiz zelf — geen externe asset.' },
  },
]

export const ROUNDS_PER_QUESTION = 5  // questions per round
export const TOTAL_QUESTIONS = 20
export const POINTS_PER_CORRECT = 100
export const POLL_PARTICIPATION_POINTS = 10

// Returns 0-indexed positions of the last question in each round (except round 4)
export const ROUND_END_INDICES = [4, 9, 14]  // V5, V10, V15

export type ThemeName = 'neutral' | 'qmusic' | 'joe'

// Rondes 1 & 2 zijn de "externe" rondes (neutraal donker thema);
// ronde 3 is het echte Qmusic-merk, ronde 4 het echte Joe-merk.
export function getThemeForRound(round: number): ThemeName {
  if (round === 3) return 'qmusic'
  if (round === 4) return 'joe'
  return 'neutral'
}

export const ROUND_TITLES = ['', 'De wereld verandert', 'Hoe doen anderen het?', 'De Q-ronde', 'De Joe-ronde']
export const ROUND_SUBTITLES = ['', 'Externe trends & data', 'Internationale voorbeelden', 'Qmusic', 'Joe']

export function getTimerForRound(round: number): number {
  if (round === 3) return 20
  if (round === 4) return 25
  return 30
}

export interface RoundMusicConfig {
  file: string
  durationSec: number
  label: string
}

export const ROUND_MUSIC: Record<number, RoundMusicConfig> = {
  1: { file: 'music_r1.mp3', durationSec: 8, label: 'Martin Garrix – Mad' },
  2: { file: 'music_r2.mp3', durationSec: 27, label: 'Patrick Hernandez – Born to be Alive' },
  3: { file: 'music_r3.mp3', durationSec: 6, label: 'Ed Sheeran – Sapphire' },
  4: { file: 'music_r4.mp3', durationSec: 6, label: "Elton John – I'm Still Standing" },
}
