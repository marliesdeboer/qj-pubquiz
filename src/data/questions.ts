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
