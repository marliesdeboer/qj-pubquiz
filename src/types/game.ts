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

export type ChartDataPoint = {
  label: string
  value: number
  unit?: string
}

export type MediaContent =
  | { type: 'chart'; chartType: 'bar' | 'donut'; title: string; data: ChartDataPoint[]; unit?: string; note?: string }
  | { type: 'video'; description: string; sourceUrl: string; searchTerm: string }
  | { type: 'image'; description: string; searchTerm: string }
  | { type: 'audio'; description: string; searchTerm: string }
  | { type: 'poll'; description: string }

export type Question = {
  id: string           // 'V1'–'V20'
  round: number        // 1–4
  type: 'quiz' | 'poll'
  question: string
  options: string[]
  answerIndex: number | null  // null = poll (geen juist antwoord)
  explanation: string
  source: string
  media: MediaContent
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
