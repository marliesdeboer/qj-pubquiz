import { useState } from 'react'
import type { GameState, ClientMessage } from '../../types/game'
import './Lobby.css'

const ACCESS_CODE = (import.meta.env.VITE_ACCESS_CODE as string | undefined) ?? 'qjquiz'

type Props = {
  gameState: GameState
  teamId: string
  send: (msg: ClientMessage) => void
}

export function Lobby({ gameState, teamId, send }: Props) {
  const [accessCode, setAccessCode] = useState('')
  const [accessError, setAccessError] = useState(false)
  const [accessGranted, setAccessGranted] = useState(
    () => sessionStorage.getItem('qj-access-granted') === ACCESS_CODE
  )
  const [name, setName] = useState('')
  const [joined, setJoined] = useState(
    () => gameState.teams.some(t => t.id === teamId)
  )

  function handleAccess() {
    if (accessCode.trim().toLowerCase() === ACCESS_CODE.toLowerCase()) {
      sessionStorage.setItem('qj-access-granted', ACCESS_CODE)
      setAccessGranted(true)
      setAccessError(false)
    } else {
      setAccessError(true)
    }
  }

  function handleJoin() {
    const trimmed = name.trim()
    if (!trimmed) return
    send({ type: 'JOIN', teamId, teamName: trimmed })
    setJoined(true)
  }

  return (
    <div className="lobby">
      <div className="lobby-kicker">Leiderschapssessie · Van radio naar content</div>
      <div className="lobby-title">
        <span className="tq">Q</span> & <span className="tj">Joe</span> Quiz
      </div>

      {!accessGranted ? (
        <>
          <div className="lobby-sub">Voer de toegangscode in om mee te doen</div>
          <div className="lobby-form">
            <input
              className={`lobby-input${accessError ? ' lobby-input-error' : ''}`}
              placeholder="Toegangscode..."
              value={accessCode}
              onChange={e => { setAccessCode(e.target.value); setAccessError(false) }}
              onKeyDown={e => e.key === 'Enter' && handleAccess()}
              autoFocus
            />
            {accessError && <div className="lobby-error">Onjuiste code, probeer opnieuw.</div>}
            <button className="lobby-btn" onClick={handleAccess} disabled={!accessCode.trim()}>
              Verder →
            </button>
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
