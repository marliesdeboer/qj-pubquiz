import { useEffect, useRef, useState } from 'react'
import { ROUND_TITLES, ROUND_SUBTITLES, getThemeForRound, ROUND_MUSIC } from '../../data/questions'
import './RoundTitleCard.css'

type Props = {
  round: number
  onDone: () => void
  isHost?: boolean
}

export function RoundTitleCard({ round, onDone, isHost = false }: Props) {
  const music = ROUND_MUSIC[round]
  const [musicState, setMusicState] = useState<'idle' | 'playing'>('idle')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Non-host clients auto-close after 3.5s. Host waits for play button (or click to skip).
  useEffect(() => {
    if (isHost && music) return
    const id = setTimeout(onDone, 3500)
    return () => clearTimeout(id)
  }, [isHost, music, onDone])

  useEffect(() => {
    return () => {
      clearTimeout(stopTimerRef.current)
      audioRef.current?.pause()
    }
  }, [])

  function handlePlay(e: React.MouseEvent) {
    e.stopPropagation()
    if (musicState === 'playing' || !music) return

    const audio = new Audio(`/media/${music.file}`)
    audioRef.current = audio
    audio.play().catch(() => onDone())
    setMusicState('playing')

    stopTimerRef.current = setTimeout(() => {
      audio.pause()
      onDone()
    }, music.durationSec * 1000)
  }

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

      {isHost && music && (
        <div className="rc-music" onClick={e => e.stopPropagation()}>
          {musicState === 'idle' && (
            <button className="rc-play-btn" onClick={handlePlay}>
              ▶ Start muziek
            </button>
          )}
          {musicState === 'playing' && (
            <span className="rc-music-status rc-music-playing">♪ {music.label}</span>
          )}
        </div>
      )}

      <div className="rc-sparkle rc-sparkle-l" aria-hidden="true">✦</div>
      <div className="rc-sparkle rc-sparkle-r" aria-hidden="true">✦</div>
    </div>
  )
}
