import type { Team } from '../../types/game'
import './Leaderboard.css'

type Props = { teams: Team[] }

export function Leaderboard({ teams }: Props) {
  const sorted = [...teams].sort((a, b) => b.score - a.score)
  return (
    <div className="leaderboard">
      {sorted.map((team, i) => (
        <div key={team.id} className="lb-row">
          <span className="lb-rank">{i + 1}</span>
          <span className="lb-name">{team.name}</span>
          <span className="lb-score">{team.score}</span>
        </div>
      ))}
    </div>
  )
}
