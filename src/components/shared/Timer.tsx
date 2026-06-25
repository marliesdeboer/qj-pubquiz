import { useState, useEffect } from 'react'
import './Timer.css'

type Props = {
  duration: number     // seconds
  running: boolean
  onExpire?: () => void
}

export function Timer({ duration, running, onExpire }: Props) {
  const [remaining, setRemaining] = useState(duration)

  useEffect(() => {
    setRemaining(duration)
  }, [duration])

  useEffect(() => {
    if (!running) return
    if (remaining <= 0) {
      onExpire?.()
      return
    }
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(id)
          onExpire?.()
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running, duration])

  const pct = (remaining / duration) * 100
  const urgent = remaining <= 5

  return (
    <div className="timer-root">
      <span className={`timer-number ${urgent ? 'urgent' : ''}`}>{remaining}</span>
      <div className="timer-bar-track">
        <div
          className={`timer-bar-fill ${urgent ? 'urgent' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
