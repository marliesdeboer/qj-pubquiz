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
