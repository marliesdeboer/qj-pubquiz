import { useState } from 'react'
import type { GameState, ClientMessage } from '../../types/game'
import { QUESTIONS, getTimerForRound } from '../../data/questions'
import { Timer } from '../shared/Timer'
import { AnswerButtons } from './AnswerButtons'
import { Lobby } from './Lobby'
import { EndScreen } from './EndScreen'
import './PlayerView.css'

type Props = {
  gameState: GameState
  teamId: string
  send: (msg: ClientMessage) => void
}

export function PlayerView({ gameState, teamId, send }: Props) {
  const { phase, currentQuestion, currentRound, teams, answers } = gameState
  const myTeam = teams.find(t => t.id === teamId)
  const myAnswer = answers.find(a => a.teamId === teamId)
  const question = QUESTIONS[currentQuestion]
  const timerDuration = getTimerForRound(currentRound)

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Reset selection when question changes
  const [lastSeenQuestion, setLastSeenQuestion] = useState(currentQuestion)
  if (currentQuestion !== lastSeenQuestion) {
    setSelectedIndex(null)
    setLastSeenQuestion(currentQuestion)
  }

  function handleSelect(index: number) {
    if (selectedIndex !== null) return
    setSelectedIndex(index)
    send({
      type: 'SUBMIT_ANSWER',
      teamId,
      answer: question.options[index],
    })
  }

  if (phase === 'lobby') {
    return <Lobby gameState={gameState} teamId={teamId} send={send} />
  }

  if (phase === 'finished') {
    return <EndScreen teams={teams} teamId={teamId} />
  }

  if (phase === 'leaderboard') {
    const sorted = [...teams].sort((a, b) => b.score - a.score)
    return (
      <div className="player-leaderboard">
        <div className="player-lb-title">{`STAND NA RONDE ${currentRound - 1}`}</div>
        <div className="player-lb-list">
          {sorted.map((team, i) => (
            <div key={team.id} className={`player-lb-row ${team.id === teamId ? 'player-lb-me' : ''}`}>
              <span className="player-lb-rank">{i + 1}</span>
              <span className="player-lb-name">{team.name}{team.id === teamId ? ' (jij)' : ''}</span>
              <span className="player-lb-score">{team.score} pts</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const isLocked = myAnswer !== undefined || phase === 'reveal'
  const correctIndex = phase === 'reveal' ? question.correctIndex : null
  const brandLabel = currentRound === 3 ? 'QMUSIC' : currentRound === 4 ? 'joe.' : 'Q&J QUIZ'

  return (
    <div className="player-view">
      <div className="player-question-area">
        <div className="player-header">
          <span className="player-brand">{brandLabel}</span>
          <span className="player-team-name">{myTeam?.name ?? ''}</span>
        </div>
        <div className="player-q-meta">
          <span className="player-q-label">Vraag {currentQuestion + 1} van 20</span>
          {phase === 'question' && (
            <Timer
              key={currentQuestion}
              duration={timerDuration}
              running={phase === 'question' && !isLocked}
            />
          )}
        </div>
        <div className="player-question-text">{question.text}</div>
      </div>

      <div className="player-answers-area">
        {phase === 'question' && isLocked ? (
          <div className="player-locked">
            <div className="player-locked-icon">⏳</div>
            <div>Antwoord verstuurd!</div>
            <div style={{ fontSize: '0.75rem' }}>Wacht op de host...</div>
          </div>
        ) : (
          <>
            <AnswerButtons
              options={question.options}
              selectedIndex={selectedIndex}
              correctIndex={correctIndex}
              phase={phase === 'reveal' ? 'reveal' : 'question'}
              onSelect={handleSelect}
            />
            {phase === 'reveal' && (
              <>
                <div className="player-explanation">{question.explanation}</div>
                {myTeam && (
                  <div className="player-score">
                    <span>Teamscore</span>
                    <span className="player-score-pts">{myTeam.score} pts</span>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
