import { useState } from 'react'
import type { GameState, ClientMessage } from '../../types/game'
import { QUESTIONS, getTimerForRound, ROUND_END_INDICES } from '../../data/questions'
import { Timer } from '../shared/Timer'
import { AnswerDistribution } from './AnswerDistribution'
import { Leaderboard } from './Leaderboard'
import './HostView.css'

const HOST_PIN = 'qjhost2025'

type Props = {
  gameState: GameState | null
  send: (msg: ClientMessage) => void
}

export function HostView({ gameState, send }: Props) {
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  function checkPin() {
    if (pin === HOST_PIN) {
      setAuthenticated(true)
    } else {
      setPinError(true)
      setTimeout(() => setPinError(false), 1500)
    }
  }

  if (!authenticated) {
    return (
      <div className="host-pin-gate">
        <div className="host-pin-title">HOST LOGIN</div>
        <input
          className={`host-pin-input ${pinError ? 'error' : ''}`}
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={e => setPin(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && checkPin()}
          autoFocus
        />
        <button className="host-pin-btn" onClick={checkPin}>Inloggen</button>
      </div>
    )
  }

  if (!gameState) {
    return <div className="host-view" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Verbinden...</div>
  }

  const { phase, currentQuestion, currentRound, teams, answers } = gameState
  const question = QUESTIONS[currentQuestion]
  const timerDuration = getTimerForRound(currentRound)
  const isEndOfRound = ROUND_END_INDICES.includes(currentQuestion)
  const isLastQuestion = currentQuestion === 19

  return (
    <div className="host-view">
      <div className="host-topbar">
        <span className="host-topbar-title">Q&J QUIZ — HOST</span>
        <span className="host-topbar-meta">
          Ronde {currentRound} · Vraag {currentQuestion + 1}/20 · {teams.length} teams
        </span>
        <button className="host-reset-btn" onClick={() => { if (confirm('Game resetten?')) send({ type: 'RESET', isHost: true }) }}>
          ⟳ Reset
        </button>
      </div>

      {phase === 'lobby' && (
        <div className="host-lobby">
          <div className="host-lobby-title">Q&J QUIZ</div>
          <div style={{ fontSize: '0.8rem', color: '#555' }}>
            {teams.length === 0 ? 'Wacht op teams...' : `${teams.length} team${teams.length !== 1 ? 's' : ''} aangemeld`}
          </div>
          <div className="host-lobby-teams">
            {teams.map(t => <span key={t.id} className="host-team-pill">{t.name}</span>)}
          </div>
          <button
            className="host-start-btn"
            disabled={teams.length === 0}
            onClick={() => send({ type: 'NEXT_QUESTION', isHost: true })}
          >
            Start quiz →
          </button>
        </div>
      )}

      {phase === 'leaderboard' && (
        <div className="host-lobby" style={{ gap: 16 }}>
          <div className="host-lobby-title">STAND NA RONDE {currentRound}</div>
          <Leaderboard teams={teams} />
          <button
            className="host-start-btn"
            onClick={() => send({ type: 'NEXT_ROUND', isHost: true })}
          >
            Start Ronde {currentRound + 1} →
          </button>
        </div>
      )}

      {phase === 'finished' && (
        <div className="host-lobby" style={{ gap: 16 }}>
          <div className="host-lobby-title">EINDSTAND 🏆</div>
          <Leaderboard teams={teams} />
        </div>
      )}

      {(phase === 'question' || phase === 'reveal') && (
        <div className="host-main">
          <div className="host-left">
            <div className="host-q-header">
              <span className="host-q-label">Vraag {currentQuestion + 1} van 20 — Ronde {currentRound}</span>
              {phase === 'question' && (
                <Timer key={currentQuestion} duration={timerDuration} running={true} />
              )}
            </div>
            <div className="host-question-text">{question.text}</div>
            <div className="host-dist-label">
              Live antwoorden — {answers.length} van {teams.length} teams
            </div>
            <AnswerDistribution
              question={question}
              answers={answers}
              totalTeams={teams.length}
              revealed={phase === 'reveal'}
            />
            {phase === 'reveal' && (
              <div className="host-explanation">
                <strong>Toelichting:</strong> {question.explanation}
              </div>
            )}
          </div>

          <div className="host-right">
            <div className="host-section-label">Bediening</div>

            <button
              className="host-ctrl-btn primary"
              disabled={phase !== 'question'}
              onClick={() => send({ type: 'REVEAL', isHost: true })}
            >
              Onthul antwoord
            </button>

            {!isEndOfRound && !isLastQuestion && (
              <button
                className="host-ctrl-btn secondary"
                disabled={phase !== 'reveal'}
                onClick={() => send({ type: 'NEXT_QUESTION', isHost: true })}
              >
                Volgende vraag
              </button>
            )}

            {(isEndOfRound || isLastQuestion) && (
              <button
                className="host-ctrl-btn secondary"
                disabled={phase !== 'reveal'}
                onClick={() => send({ type: 'NEXT_QUESTION', isHost: true })}
              >
                {isLastQuestion ? 'Eindstand tonen' : 'Naar leaderboard'}
              </button>
            )}

            <div className="host-divider" />
            <div className="host-section-label">Stand</div>
            <Leaderboard teams={teams} />
          </div>
        </div>
      )}
    </div>
  )
}
