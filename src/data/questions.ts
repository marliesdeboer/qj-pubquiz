import type { Question } from '../types/game'

export const QUESTIONS: Question[] = [
  // ── RONDE 1: De wereld verandert ─────────────────────────────────
  {
    id: 'V1', round: 1, type: 'quiz',
    question: 'Van de totale luistertijd bij 13-34-jarigen gaat nog maar een deel naar live radio. Hoeveel?',
    options: ['71%', '58%', '44%', '29%'],
    answerIndex: 2,
    explanation: '44%. Bij 50-plussers is dat nog 82% — bijna een factor 2 verschil. De radioluisteraar van nu vergrijst; de jonge luisteraar komt niet vanzelf terug. Dit ene getal draagt de hele ochtend.',
    source: 'NMO AudioMonitor 2024 — https://audify.nl/nieuws/live-radio-heeft-het-grootste-aandeel-in-de-totale-luistertijd/',
    media: {
      type: 'chart', chartType: 'bar',
      title: 'Aandeel live radio in luistertijd',
      data: [{ label: '13-34 jaar', value: 44 }, { label: '50+ jaar', value: 82 }],
      unit: '%',
    },
  },
  {
    id: 'V2', round: 1, type: 'quiz',
    question: 'Waar of niet waar: in Nederland heeft Spotify nú al een groter dagelijks bereik dan alle radiozenders samen.',
    options: ['Niet waar', 'Waar'],
    answerIndex: 0,
    explanation: 'Niet waar — nog niet. Audio bereikt dagelijks bijna 11 miljoen Nederlanders, met live radio als grootste blok (66% van de luistertijd). Maar Spotify is met 56% gebruikers al de grootste muziekdienst van NL — en bij 13-34 is de verhouding al gekanteld. De vraag is niet óf, maar wanneer.',
    source: 'NMO AudioMonitor 2024 — https://www.marketingfacts.nl/berichten/nmo-audiomonitor-audio-bereikt-dagelijks-11-miljoen-nederlanders/',
    media: {
      type: 'chart', chartType: 'bar',
      title: 'Aandeel in totale luistertijd NL',
      data: [
        { label: 'Live radio', value: 66 },
        { label: 'Muziekdiensten', value: 24 },
        { label: 'YouTube', value: 3.5 },
        { label: 'Podcasts', value: 3 },
      ],
      unit: '%',
    },
  },
  {
    id: 'V3', round: 1, type: 'quiz',
    question: 'Een radiostation zond zes maanden lang een dagelijkse show uit met een AI-presentator — zonder het te vertellen. Waar?',
    options: ['Duitsland', 'Australië', 'Japan', 'Verenigd Koninkrijk'],
    answerIndex: 1,
    explanation: 'Australië. Station CADA (Sydney), show \'Workdays with Thy\', nov 2024–apr 2025. De stem werd via ElevenLabs gekloond van een echte medewerker. Echte fans, geen mens. En het mócht — er was geen regel die het verbood. Waar ligt de grens tussen efficiëntie en bedrog?',
    source: 'Global News, april 2025 — https://globalnews.ca/news/11159415/cada-radio-station-ai-host-backlash/',
    media: {
      type: 'video',
      description: 'Nieuwsclip over de CADA \'Thy\'-onthulling',
      sourceUrl: 'https://globalnews.ca/news/11159415/cada-radio-station-ai-host-backlash/',
      searchTerm: 'CADA radio AI host Thy',
    },
  },
  {
    id: 'V4', round: 1, type: 'quiz',
    question: 'Welk deel van alle Spotify-royalty\'s gaat inmiddels naar onafhankelijke artiesten en labels — muziek die buiten de grote platenmaatschappijen om wordt gemaakt?',
    options: ['~10%', '~25%', '~50%', '~75%'],
    answerIndex: 2,
    explanation: '~50% — ruim $5,5 mld van de $11 mld die Spotify in 2025 uitkeerde. De drempel om audio te máken is bijna nul. So what: als iedereen content kan maken en distribueren, wat is dan de waarde van een radioformat? Schaarste zat vroeger in de zender; nu in aandacht, smaak en merk.',
    source: 'Spotify Loud & Clear 2026 — https://newsroom.spotify.com/2026-03-11/loud-and-clear-music-economics-highlights/',
    media: {
      type: 'chart', chartType: 'donut',
      title: 'Spotify-royalty\'s 2025 ($11 mld)',
      data: [{ label: 'Indie-artiesten & labels', value: 50 }, { label: 'Majors & overig', value: 50 }],
      unit: '%',
    },
  },
  {
    id: 'V5', round: 1, type: 'quiz',
    question: 'Wat is wereldwijd inmiddels het grootste platform om podcasts te beluisteren?',
    options: ['Spotify', 'YouTube', 'Apple Podcasts', 'TikTok'],
    answerIndex: 1,
    explanation: 'YouTube — ruim 1 miljard maandelijkse podcast-kijkers sinds 2025. Podcast is geen audiomedium meer maar een vídeomedium: mensen kíjken naar Joe Rogan. Als audio beeld wordt, waar staan wij dan met een microfoon?',
    source: 'Variety / Edison Podcast Metrics 2025 — https://variety.com/2025/digital/news/youtube-2025-monthly-podcast-listeners-viewers-1236319232/',
    media: {
      type: 'chart', chartType: 'bar',
      title: 'Voorkeursplatform voor podcasts (VS)',
      data: [{ label: 'YouTube', value: 31 }, { label: 'Spotify', value: 27 }, { label: 'Apple', value: 15 }],
      unit: '%',
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
    explanation: 'De zender wordt een kanaal binnen het merk — precies de beweging die Q&J overweegt. Het platform heet \'Rayo\' en draait inmiddels ook in BMW-dashboards. Als al je zenders samenkomen in één app, wat is dan nog de rol van de losse zender, en wat wordt het overkoepelende merk?',
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
    explanation: 'Games. Abonnees besteden meer tijd aan de spelletjes dan aan de digitale krant; in 2025 werden NYT-games 11,2 miljard keer gespeeld. Mensen komen binnen voor Wordle en blijven voor het nieuws. Vervang \'krant\' door \'radio\' en je hebt jullie eigen vraag.',
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
    explanation: 'Goalhanger. 14 shows, 1,8 miljard views en streams in 2025, 250.000 betalende leden (jan 2026). Geen radiozender, geen omroep — een contentbedrijf gebouwd op audio, dat de traditionele omroep op eigen terrein verslaat. Dit gebeurt nú.',
    source: 'Press Gazette — https://pressgazette.co.uk/podcasts/podcasts-youtube-goalhanger/ ; Podnews, jan 2026 — https://podnews.net/press-release/goalhanger-250k',
    media: {
      type: 'image',
      description: 'Het Goalhanger-netwerk: van één geschiedenispodcast naar 14 shows',
      searchTerm: 'Goalhanger podcast network shows',
    },
  },
  {
    id: 'V9', round: 2, type: 'quiz',
    question: 'De grootste YouTuber ter wereld (MrBeast) maakte in 2024 verlies op zijn video\'s, maar winst op zijn chocolademerk Feastables. Hoe verhielden die zich?',
    options: [
      '$10M verlies video / $5M winst chocolade',
      '$80M verlies video / $20M winst chocolade',
      'Beide winst',
      'Beide verlies',
    ],
    answerIndex: 1,
    explanation: '$80M verlies op media (bij $246M omzet), $20M winst op Feastables (bij $250M omzet). Zijn video\'s — het hart van zijn roem — zijn een verliespost; de winst zit in het mérk en het product erachter. So what: als \'s werelds beste content geen geld verdient maar wél een merk verkoopt — wat is dan de waarde van jóuw content? Is de show het product, of de etalage?',
    source: 'Fortune, 2025 — https://fortune.com/2025/03/11/youtube-biggest-star-mrbeast-makes-more-money-chocolate-videos/',
    media: {
      type: 'chart', chartType: 'bar',
      title: 'Beast Industries 2024: resultaat per tak',
      data: [{ label: 'Media (video)', value: -80, unit: ' mln $' }, { label: 'Feastables (chocolade)', value: 20, unit: ' mln $' }],
      note: 'De chocolade financiert de content — niet andersom.',
    },
  },
  {
    id: 'V10', round: 2, type: 'quiz',
    question: 'Taylor Swift\'s Eras Tour werd de eerste tour in de geschiedenis die een bepaalde grens doorbrak. Welke?',
    options: ['$1 miljard', '$2 miljard', '$3 miljard', '$5 miljard'],
    answerIndex: 1,
    explanation: '$2 miljard ($2,077 mld) — ruim dubbel het vorige record aller tijden (Elton John, $939 mln). Voor steeds meer artiesten ís de tour de business geworden; de opname is bijna de marketing voor het optreden. So what: wat is ónze \'tour\'? Het moment waarvoor mensen de deur uit komen, betalen en samen iets beleven — bezitten wij dat al (Foute Party, events) of laten we het liggen?',
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
    explanation: '~4,4 mln wekelijks bereik — het grootste van alle Nederlandse zenders. Maar let op: op marktaandeel (luistertijd) is NPO Radio 2 marktleider. Strategische vraag: hoe verzilver je het grootste bereik van NL als de luistertijd ergens anders zit — en de 25-34-doelgroep richting Spotify schuift?',
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
    question: 'De Foute Party groeide van een radioformat uit tot \'The Big One\' in het Philips Stadion (20 juni 2026). Waarom is dat strategisch interessant?',
    options: [
      'Het levert extra reclame-inkomsten',
      'Het is goedkoper dan radio maken',
      'Het bewijst dat een radiomerk een contentbedrijf wordt: één merk, meerdere kanalen en inkomstenstromen',
      'Het trekt jonge luisteraars terug naar FM',
    ],
    answerIndex: 2,
    explanation: '20 jaar oud, begonnen in de kantine, nu een stadionformaat. Het merk leeft buiten het medium — precies wat \'van radio naar content\' in de praktijk betekent. Dit is jullie eigen Goalhanger-moment.',
    source: 'Qmusic Foute Party — https://qmusicfouteparty.nl/ ; Broadcast Magazine — https://www.broadcastmagazine.nl/televisie-audio/audio/qmusic-organiseert-grootste-foute-party-ooit-in-philips-stadion/',
    media: {
      type: 'video',
      description: 'Foute Party aftermovie — sfeerbeeld menigte/stadion',
      sourceUrl: 'https://qmusicfouteparty.nl/',
      searchTerm: 'Qmusic Foute Party aftermovie',
    },
  },
  {
    id: 'V13', round: 3, type: 'quiz',
    question: 'Welk deel van de audioreclamemarkt is inmiddels digitaal (digitale radio + branded content + podcast)?',
    options: ['~5%', '~15% en hard groeiend', '~35%', '>50%'],
    answerIndex: 1,
    explanation: '~15% van een recordmarkt van €270,6 mln (2025); podcastreclame groeide in 2025 met bijna 190%. De markt verschuift langzaam maar onomkeerbaar van spot naar digitaal.',
    source: 'Audify Audiojaarrapport 2025 — https://radiowereld.nl/medianieuws/2026/02/audioreclame-groeit-voor-vijfde-jaar-op-rij-en-bereikt-nieuw-record/',
    media: {
      type: 'chart', chartType: 'bar',
      title: 'Audioreclamemarkt 2025 (€270,6 mln)',
      data: [
        { label: 'Digitaal aandeel', value: 15, unit: '%' },
        { label: 'Groei podcastreclame', value: 190, unit: '%' },
      ],
      note: 'Spotreclame is nog ~85% van de markt — maar vrijwel alle groei zit digitaal.',
    },
  },
  {
    id: 'V14', round: 3, type: 'quiz',
    question: 'Waar of niet waar: radio wordt in Nederland nog steeds vooral via FM beluisterd.',
    options: ['Waar', 'Niet waar — online heeft FM ingehaald'],
    answerIndex: 1,
    explanation: 'Niet waar. Online streaming heeft ruim 30% van het radioluisteren, FM zit er inmiddels onder (~29%), DAB+ op ~19%. De digitale verschuiving gebeurt dus al bínnen radio zelf. De stille kwetsbaarheid: het FM-kavel waarvoor tot 2035 is betaald, is een krimpend kanaal — het bereik van morgen komt via platforms die we niet bezitten.',
    source: 'NMO / Radiowereld, okt 2025 — https://radiowereld.nl/medianieuws/2025/10/fm-dab-online-zo-wordt-er-per-radiostation-geluisterd/ (verhoudingen fluctueren per maand)',
    media: {
      type: 'chart', chartType: 'bar',
      title: 'Hoe Nederland naar de radio luistert',
      data: [
        { label: 'Online', value: 31 },
        { label: 'FM', value: 29 },
        { label: 'DAB+', value: 19 },
      ],
      unit: '%',
    },
  },
  {
    id: 'V15', round: 3, type: 'poll',
    question: 'Wat is op vijf jaar de grootste bedreiging voor het Qmusic-businessmodel?',
    options: [
      'Spotify pikt de muziekluisteraar in',
      'AI-presentatoren vervangen duur talent',
      'Adverteerders verschuiven budget naar social media',
      'De FM-frequentie verdwijnt',
    ],
    answerIndex: null,
    explanation: 'Geen fout antwoord — kijk naar de stemverdeling. Strategisch meest onderbouwd: C (advertentie-inkomsten zijn de levensader, en social biedt betere targeting en data). Maar let op B: na de CADA-vraag (V3) is dat ineens minder hypothetisch. Host leest de verdeling voor en opent het gesprek.',
    source: '',
    media: { type: 'poll', description: 'Live stemverdeling uit de quiz zelf — geen externe asset.' },
  },

  // ── RONDE 4: De Joe-ronde ────────────────────────────────────────
  {
    id: 'V16', round: 4, type: 'quiz',
    question: 'Joe draait bewust bijna alleen muziek van vóór het jaar 2000. Wat is daarvan de strategische logica?',
    options: [
      'Het is goedkoper qua rechten',
      'Directe herkenbaarheid — je hoort binnen seconden dat het Joe is',
      'Jongeren bereiken',
      'Onderscheiden van de Belgische Joe',
    ],
    answerIndex: 1,
    explanation: 'Herkenbaarheid is Joe\'s wapen — en tegelijk zijn val. Dezelfde keuze die het merk zo herkenbaar maakt, bindt het aan een publiek dat ouder wordt. (Bruggetje naar de volgende vraag.)',
    source: 'Radiowereld, april 2024 — https://radiowereld.nl/medianieuws/2024/04/hoofd-muziek-joe-wij-draaien-bewust-geen-nieuwe-muziek/',
    media: {
      type: 'image',
      description: 'Joe on-air bumper of playlist-screenshot (Queen, ABBA, Prince…)',
      searchTerm: 'Joe radio Nederland jingle',
    },
  },
  {
    id: 'V17', round: 4, type: 'quiz',
    question: 'Joe\'s doelgroep (35-55) luistert langer per dag dan de 20-34-groep. Wat is het strategische risico van die doelgroep?',
    options: [
      'Minder koopkracht',
      'Moeilijk te bereiken via social',
      'Aantrekkelijk voor adverteerders, maar demografisch krimpend',
      'Luistert vaker via FM',
    ],
    answerIndex: 2,
    explanation: 'De 35-55 van nu is de laatste generatie die radio als primair medium meekreeg. DPG betaalde in 2023 €47,3 mln voor twee FM-kavels tot 2035 (Qmusic + Joe) — een lange weddenschap op precies deze vergrijzende luistergewoonte.',
    source: 'RDI/Rijksoverheid, juli 2023 — https://www.rdi.nl/actueel/nieuws/2023/07/07/negen-commerciele-radiostations-gaan-na-veiling-tot-2035-landelijk-uitzenden ; RadioVisie — https://radiovisie.eu/nederland-resultaat-van-de-veiling-fm-pakketten/',
    media: {
      type: 'chart', chartType: 'bar',
      title: 'Aandeel live radio in luistertijd naar leeftijd',
      data: [{ label: '50+ jaar', value: 82 }, { label: '13-34 jaar', value: 44 }],
      unit: '%',
    },
  },
  {
    id: 'V18', round: 4, type: 'quiz',
    question: 'Joe organiseert live events. Wat is de strategische reden?',
    options: [
      'Extra inkomstenstroom',
      'Merkversterking buiten het medium',
      'Dataverzameling',
      'Alle drie',
    ],
    answerIndex: 3,
    explanation: 'Het schoolvoorbeeld van contentbedrijf-logica — één merk, meerdere touchpoints, meerdere inkomstenstromen. De vraag is of het structureel groot genoeg wordt.',
    source: 'Joe / DPG Media — merkstrategie',
    media: {
      type: 'video',
      description: 'Joe live: Paul de Leeuw zingt zijn nummer 1-hit met JOE-luisteraars',
      sourceUrl: 'https://www.youtube.com/watch?v=Wt7DrMIYc6s',
      searchTerm: 'Paul de Leeuw JOE luisteraars nummer 1',
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
    explanation: 'Geen goed/fout. Host leest de verdeling voor en zegt: \'Dít is precies de vraag waar we de rest van de ochtend op ingaan.\' Dit is de brug naar de sessiediscussie.',
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
