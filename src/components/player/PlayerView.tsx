import { useState } from 'react'
import type { GameState, ClientMessage } from '../../types/game'
import { QUESTIONS, getTimerForRound, getThemeForRound } from '../../data/questions'
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

function PlayerBrand({ round }: { round: number }) {
  const theme = getThemeForRound(round)
  if (theme === 'qmusic') return <span className="player-brand brand-q">QMUSIC</span>
  if (theme === 'joe') return <span className="player-brand brand-joe">joe<span>.</span></span>
  return (
    <span className="player-brand brand-duo">
      <span className="bq">Q</span><span className="bamp">&</span><span className="bj">JOE</span>
    </span>
  )
}

export function PlayerView({ gameState, teamId, send }: Props) {
  const { phase, currentQuestion, currentRound, teams, answers } = gameState
  const myTeam = teams.find(t => t.id === teamId)
  const question = QUESTIONS[currentQuestion]
  const timerDuration = getTimerForRound(currentRound)

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const [lastSeenQuestion, setLastSeenQuestion] = useState(currentQuestion)
  if (currentQuestion !== lastSeenQuestion) {
    setSelectedIndex(null)
    setLastSeenQuestion(currentQuestion)
  }

  function handleSelect(index: number) {
    if (phase === 'reveal') return
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
        <div className="player-lb-kicker">Tussenstand</div>
        <div className="player-lb-title">Na ronde {currentRound}</div>
        <div className="player-lb-list">
          {sorted.map((team, i) => (
            <div key={team.id} className={`player-lb-row ${team.id === teamId ? 'player-lb-me' : ''}`} style={{ animationDelay: `${i * 70}ms` }}>
              <span className="player-lb-rank">{i + 1}</span>
              <span className="player-lb-name">{team.name}{team.id === teamId ? ' (jij)' : ''}</span>
              <span className="player-lb-score">{team.score} pt</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const isPoll = question.type === 'poll'
  const answerIndex = phase === 'reveal' && !isPoll ? question.answerIndex : null
  const isCorrect = phase === 'reveal' && !isPoll && selectedIndex !== null && selectedIndex === question.answerIndex
  const hasVoted = answers.some(a => a.teamId === teamId)

  return (
    <div className="player-view" key={currentQuestion}>
      <div className="player-question-area">
        <div className="player-header">
          <PlayerBrand round={currentRound} />
          <span className="player-team-name">{myTeam?.name ?? ''}</span>
        </div>
        <div className="player-q-meta">
          <span className="player-q-label">
            Vraag {currentQuestion + 1}/20
            {isPoll && <span className="player-poll-badge">Poll</span>}
          </span>
          {phase === 'question' && (
            <Timer key={currentQuestion} duration={timerDuration} running={true} />
          )}
        </div>
        <div className="player-question-text">{question.question}</div>
      </div>

      <div className="player-answers-area">
        <AnswerButtons
          options={question.options}
          selectedIndex={selectedIndex}
          correctIndex={answerIndex}
          phase={phase === 'reveal' ? 'reveal' : 'question'}
          onSelect={handleSelect}
        />
        {phase === 'question' && hasVoted && (
          <div className="player-locked-hint">✓ Antwoord verstuurd — je kunt nog wisselen</div>
        )}
        {phase === 'reveal' && !isPoll && selectedIndex !== null && (
          <div className={`player-reveal-overlay ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="player-reveal-badge">{isCorrect ? 'Goed!' : 'Fout'}</div>
            {isCorrect && <div className="player-reveal-sub">+100 punten</div>}
            {myTeam && <div className="player-reveal-score">{myTeam.score} pt totaal</div>}
          </div>
        )}
        {phase === 'reveal' && isPoll && (
          <div className="player-poll-thanks">
            ✦ Stem geteld — de verdeling staat op het grote scherm
          </div>
        )}
      </div>
    </div>
  )
}
