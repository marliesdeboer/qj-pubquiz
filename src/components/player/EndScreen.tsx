import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import type { Team } from '../../types/game'
import './EndScreen.css'

const RANK_EMOJI = ['🥇', '🥈', '🥉']

type Props = { teams: Team[]; teamId: string }

export function EndScreen({ teams, teamId }: Props) {
  useEffect(() => {
    const duration = 4000
    const end = Date.now() + duration
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#E8201E', '#2B72D4', '#E8365D'] })
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#E8201E', '#2B72D4', '#fff'] })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [])

  const sorted = [...teams].sort((a, b) => b.score - a.score)

  return (
    <div className="end-screen">
      <div className="end-title">EINDSTAND 🏆</div>
      <div className="end-subtitle">Tot straks in de sessie!</div>
      <div className="end-lb">
        {sorted.map((team, i) => (
          <div key={team.id} className={`end-lb-row ${team.id === teamId ? 'end-lb-me' : ''}`}>
            <span className="end-lb-rank">{RANK_EMOJI[i] ?? `${i + 1}`}</span>
            <span className="end-lb-name">{team.name}{team.id === teamId ? ' (jij)' : ''}</span>
            <span className="end-lb-score">{team.score} pts</span>
          </div>
        ))}
      </div>
    </div>
  )
}
