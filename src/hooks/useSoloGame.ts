import { useState, useCallback } from 'react'
import type { GameState, ClientMessage } from '../types/game'
import { QUESTIONS, ROUND_END_INDICES } from '../data/questions'

const INITIAL_STATE: GameState = {
  phase: 'lobby',
  currentQuestion: 0,
  currentRound: 1,
  teams: [],
  answers: [],
}

export function useSoloGame() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE)

  const send = useCallback((msg: ClientMessage) => {
    setGameState(prev => {
      switch (msg.type) {
        case 'NEXT_QUESTION': {
          if (prev.phase === 'lobby') {
            return { ...prev, phase: 'question', answers: [] }
          }
          if (prev.phase === 'reveal') {
            const idx = prev.currentQuestion
            if (idx === 19) return { ...prev, phase: 'finished' }
            if (ROUND_END_INDICES.includes(idx)) return { ...prev, phase: 'leaderboard' }
            return { ...prev, phase: 'question', currentQuestion: idx + 1, answers: [] }
          }
          return prev
        }
        case 'REVEAL': {
          if (prev.phase !== 'question') return prev
          return { ...prev, phase: 'reveal' }
        }
        case 'PREV_QUESTION': {
          if (prev.phase !== 'question' && prev.phase !== 'reveal') return prev
          const prevIdx = prev.currentQuestion - 1
          if (prevIdx < 0) return prev
          return {
            ...prev,
            phase: 'question',
            currentQuestion: prevIdx,
            currentRound: QUESTIONS[prevIdx].round,
            answers: [],
          }
        }
        case 'JUMP_TO_QUESTION': {
          const idx = msg.questionIndex
          if (idx < 0 || idx >= QUESTIONS.length) return prev
          return {
            ...prev,
            phase: 'question',
            currentQuestion: idx,
            currentRound: QUESTIONS[idx].round,
            answers: [],
          }
        }
        case 'NEXT_ROUND': {
          if (prev.phase !== 'leaderboard') return prev
          const nextQuestion = prev.currentQuestion + 1
          if (nextQuestion >= QUESTIONS.length) return prev
          return {
            ...prev,
            phase: 'question',
            currentQuestion: nextQuestion,
            currentRound: prev.currentRound + 1,
            answers: [],
          }
        }
        case 'RESET': {
          return { ...INITIAL_STATE }
        }
        default:
          return prev
      }
    })
  }, [])

  return { gameState, send, teamId: 'solo', connected: true }
}
