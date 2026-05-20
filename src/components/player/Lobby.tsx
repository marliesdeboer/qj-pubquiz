import { useState } from 'react'
import type { GameState, ClientMessage } from '../../types/game'
import './Lobby.css'

type Props = {
  gameState: GameState
  teamId: string
  send: (msg: ClientMessage) => void
}

export function Lobby({ gameState, teamId, send }: Props) {
  const [name, setName] = useState('')
  const [joined, setJoined] = useState(
    () => gameState.teams.some(t => t.id === teamId)
  )

  function handleJoin() {
    const trimmed = name.trim()
    if (!trimmed) return
    send({ type: 'JOIN', teamId, teamName: trimmed })
    setJoined(true)
  }

  return (
    <div className="lobby">
      <div className="lobby-title">Q&J QUIZ</div>
      <div className="lobby-sub">Voer je teamnaam in om mee te doen</div>

      {!joined ? (
        <div className="lobby-form">
          <input
            className="lobby-input"
            placeholder="Teamnaam..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
            maxLength={24}
            autoFocus
          />
          <button className="lobby-btn" onClick={handleJoin} disabled={!name.trim()}>
            Doe mee →
          </button>
        </div>
      ) : (
        <div className="lobby-waiting">
          ✓ Je bent aangemeld! Wacht op de host om te starten.
        </div>
      )}

      {gameState.teams.length > 0 && (
        <div className="lobby-teams">
          <div className="lobby-teams-label">
            Teams aangemeld ({gameState.teams.length})
          </div>
          {gameState.teams.map(t => (
            <span key={t.id} className="lobby-team-pill">{t.name}</span>
          ))}
        </div>
      )}
    </div>
  )
}
