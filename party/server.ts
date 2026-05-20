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
    let msg: ClientMessage
    try {
      msg = JSON.parse(raw) as ClientMessage
    } catch {
      return
    }

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
        const teamExists = this.state.teams.some(t => t.id === msg.teamId)
        if (!teamExists) return
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
        if (this.state.currentQuestion >= QUESTIONS.length) return
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
        if (nextQuestion >= QUESTIONS.length) return
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
