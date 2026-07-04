import { routePartykitRequest, Server } from 'partyserver'
import type { Connection, WSMessage } from 'partyserver'
import type { GameState, ClientMessage, ServerMessage } from '../src/types/game'
import {
  QUESTIONS,
  POINTS_PER_CORRECT,
  POLL_PARTICIPATION_POINTS,
  ROUND_END_INDICES,
} from '../src/data/questions'

const INITIAL_STATE: GameState = {
  phase: 'lobby',
  currentQuestion: 0,
  currentRound: 1,
  teams: [],
  answers: [],
}

// Sleutel waaronder de state in Durable Object storage bewaard wordt,
// zodat een DO-evictie de teams/scores niet meer wist.
const STORAGE_KEY = 'gameState'

interface Env {
  main: DurableObjectNamespace
}

export class QuizServer extends Server {
  private state: GameState = { ...INITIAL_STATE, teams: [] }

  async onStart() {
    const saved = await this.ctx.storage.get<GameState>(STORAGE_KEY)
    if (saved) this.state = saved
  }

  onConnect(conn: Connection) {
    conn.send(JSON.stringify({ type: 'STATE_UPDATE', state: this.state } satisfies ServerMessage))
  }

  onMessage(_conn: Connection, raw: WSMessage) {
    if (typeof raw !== 'string') return
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
        const updatedAnswers = this.state.answers.filter(a => a.teamId !== msg.teamId)
        this.state = {
          ...this.state,
          answers: [...updatedAnswers, { teamId: msg.teamId, answer: msg.answer }],
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

      case 'JUMP_TO_QUESTION': {
        if (!msg.isHost) return
        const idx = msg.questionIndex
        if (idx < 0 || idx >= QUESTIONS.length) return
        this.state = {
          ...this.state,
          phase: 'question',
          currentQuestion: idx,
          currentRound: QUESTIONS[idx].round,
          answers: [],
        }
        break
      }

      case 'PREV_QUESTION': {
        if (!msg.isHost) return
        if (this.state.phase !== 'question' && this.state.phase !== 'reveal') return
        const prevIdx = this.state.currentQuestion - 1
        if (prevIdx < 0) return
        const prevRound = QUESTIONS[prevIdx].round
        this.state = {
          ...this.state,
          phase: 'question',
          currentQuestion: prevIdx,
          currentRound: prevRound,
          answers: [],
        }
        break
      }

      case 'REVEAL': {
        if (!msg.isHost) return
        if (this.state.phase !== 'question') return
        if (this.state.currentQuestion >= QUESTIONS.length) return
        const question = QUESTIONS[this.state.currentQuestion]
        const updatedTeams = this.state.teams.map(team => {
          const teamAnswer = this.state.answers.find(a => a.teamId === team.id)
          if (!teamAnswer) return team
          if (question.type === 'poll') {
            // Poll: everyone who votes gets participation points
            return { ...team, score: team.score + POLL_PARTICIPATION_POINTS }
          }
          const answerIndex = question.options.indexOf(teamAnswer.answer)
          const isCorrect = question.answerIndex !== null && answerIndex === question.answerIndex
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

      case 'GO_TO_LOBBY': {
        if (!msg.isHost) return
        // Terug naar startscherm, maar teams en scores blijven behouden.
        this.state = {
          ...this.state,
          phase: 'lobby',
          currentQuestion: 0,
          currentRound: 1,
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

    this.broadcastState()
  }

  private broadcastState() {
    const msg: ServerMessage = { type: 'STATE_UPDATE', state: this.state }
    this.broadcast(JSON.stringify(msg))
    void this.ctx.storage.put(STORAGE_KEY, this.state)
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return (
      (await routePartykitRequest(request, env as never)) ??
      new Response('Not found', { status: 404 })
    )
  }
}
