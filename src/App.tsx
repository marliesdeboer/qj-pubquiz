import { useState, useEffect, useRef } from 'react'
import { useGameSocket } from './hooks/useGameSocket'
import { ThemeProvider } from './components/shared/ThemeProvider'
import { PlayerView } from './components/player/PlayerView'
import { HostView } from './components/host/HostView'
import { RoundTitleCard } from './components/shared/RoundTitleCard'

const isHost = window.location.pathname === '/host'

export default function App() {
  const { gameState, send, teamId } = useGameSocket()
  const [showRoundCard, setShowRoundCard] = useState(false)
  const prevRound = useRef<number>(1)
  const prevPhase = useRef<string | null>(null)

  // Show round title card when transitioning to a new round's first question
  useEffect(() => {
    if (!gameState) return
    const { phase, currentRound } = gameState

    if (
      phase === 'question' &&
      prevPhase.current === 'leaderboard' &&
      currentRound !== prevRound.current
    ) {
      setShowRoundCard(true)
    }
    // Also show card at game start for round 1
    if (phase === 'question' && prevPhase.current === 'lobby' && currentRound === 1) {
      setShowRoundCard(true)
    }

    prevRound.current = currentRound
    prevPhase.current = phase
  }, [gameState?.phase, gameState?.currentRound])

  return (
    <ThemeProvider gameState={gameState}>
      {showRoundCard && gameState && (
        <RoundTitleCard
          round={gameState.currentRound}
          onDone={() => setShowRoundCard(false)}
        />
      )}
      {isHost
        ? <HostView gameState={gameState} send={send} />
        : <PlayerView
            gameState={gameState ?? { phase: 'lobby', currentQuestion: 0, currentRound: 1, teams: [], answers: [] }}
            teamId={teamId}
            send={send}
          />
      }
    </ThemeProvider>
  )
}
