import type { GameState } from '../../types/game'
import { getThemeForRound } from '../../data/questions'

type Props = {
  gameState: GameState | null
  children: React.ReactNode
}

export function ThemeProvider({ gameState, children }: Props) {
  const round = gameState?.currentRound ?? 1
  const theme = getThemeForRound(round)

  return (
    <div data-theme={theme} className="theme-root">
      <div className="sparkles" aria-hidden="true" />
      {children}
    </div>
  )
}
