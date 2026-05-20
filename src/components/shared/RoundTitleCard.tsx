import { useEffect } from 'react'
import './RoundTitleCard.css'

const ROUND_TITLES = ['', 'De wereld verandert', 'Hoe doen anderen het?', 'Q-ronde', 'Joe-ronde']

type Props = {
  round: number
  onDone: () => void
  durationMs?: number
}

export function RoundTitleCard({ round, onDone, durationMs = 3000 }: Props) {
  useEffect(() => {
    const id = setTimeout(onDone, durationMs)
    return () => clearTimeout(id)
  }, [onDone, durationMs])

  const theme = round === 3 ? 'qmusic' : round === 4 ? 'joe' : 'base'
  const title = ROUND_TITLES[round] ?? ''

  return (
    <div className={`round-card ${theme}`} onClick={onDone}>
      {theme === 'qmusic' && <div className="rc-logo">QMUSIC</div>}
      {theme === 'joe' && <div className="rc-logo">joe<span>.</span></div>}
      <div className="rc-round-label">RONDE {round}</div>
      <div className="rc-title">{title}</div>
    </div>
  )
}
