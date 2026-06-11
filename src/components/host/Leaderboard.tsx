import type { Team } from '../../types/game'
import './Leaderboard.css'

type Props = {
  teams: Team[]
  size?: 'stage'
  podium?: boolean
}

export function Leaderboard({ teams, size, podium }: Props) {
  const sorted = [...teams].sort((a, b) => b.score - a.score)
  return (
    <div className={`leaderboard ${size === 'stage' ? 'stage' : ''}`}>
      {sorted.map((team, i) => (
        <div
          key={team.id}
          className={`lb-row ${podium && i < 3 ? `podium-${i + 1}` : ''}`}
          style={{ animationDelay: `${i * 90}ms` }}
        >
          <span className="lb-rank">{i + 1}</span>
          <span className="lb-name">{team.name}</span>
          <span className="lb-score">{team.score}<small> pt</small></span>
        </div>
      ))}
    </div>
  )
}
