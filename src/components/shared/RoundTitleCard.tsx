import { useEffect } from 'react'
import { ROUND_TITLES, ROUND_SUBTITLES, getThemeForRound } from '../../data/questions'
import './RoundTitleCard.css'

type Props = {
  round: number
  onDone: () => void
  durationMs?: number
}

export function RoundTitleCard({ round, onDone, durationMs = 3500 }: Props) {
  useEffect(() => {
    const id = setTimeout(onDone, durationMs)
    return () => clearTimeout(id)
  }, [onDone, durationMs])

  const theme = getThemeForRound(round)
  const title = ROUND_TITLES[round] ?? ''
  const subtitle = ROUND_SUBTITLES[round] ?? ''

  return (
    <div className={`round-card ${theme}`} onClick={onDone}>
      <div className="rc-glow" aria-hidden="true" />
      {theme === 'neutral' && (
        <div className="rc-logo rc-logo-duo">
          <span className="rc-q">Q</span>
          <span className="rc-amp">&</span>
          <span className="rc-j">JOE</span>
        </div>
      )}
      {theme === 'qmusic' && <div className="rc-logo rc-logo-q">QMUSIC</div>}
      {theme === 'joe' && <div className="rc-logo rc-logo-joe">joe<span>.</span></div>}
      <div className="rc-round-label">Ronde {round}</div>
      <div className="rc-title">{title}</div>
      <div className="rc-subtitle">{subtitle}</div>
      <div className="rc-sparkle rc-sparkle-l" aria-hidden="true">✦</div>
      <div className="rc-sparkle rc-sparkle-r" aria-hidden="true">✦</div>
    </div>
  )
}
