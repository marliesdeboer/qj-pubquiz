import { useState, useEffect, useCallback, useRef } from 'react'
import usePartySocket from 'partysocket/react'
import type { GameState, ClientMessage, ServerMessage } from '../types/game'

function getOrCreateTeamId(): string {
  const key = 'qj-team-id'
  const existing = sessionStorage.getItem(key)
  if (existing) return existing
  const id = Math.random().toString(36).slice(2, 10)
  sessionStorage.setItem(key, id)
  return id
}

export function useGameSocket() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [connected, setConnected] = useState(false)
  const teamId = useRef(getOrCreateTeamId()).current

  const socket = usePartySocket({
    host: import.meta.env.VITE_PARTYKIT_HOST ?? 'localhost:1999',
    room: 'qj-quiz-2025',
  })

  useEffect(() => {
    const onOpen = () => setConnected(true)
    const onClose = () => setConnected(false)
    const onMessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data as string) as ServerMessage
      if (msg.type === 'STATE_UPDATE') setGameState(msg.state)
    }
    socket.addEventListener('open', onOpen)
    socket.addEventListener('close', onClose)
    socket.addEventListener('message', onMessage)
    return () => {
      socket.removeEventListener('open', onOpen)
      socket.removeEventListener('close', onClose)
      socket.removeEventListener('message', onMessage)
    }
  }, [socket])

  const send = useCallback((msg: ClientMessage) => {
    socket.send(JSON.stringify(msg))
  }, [socket])

  return { gameState, send, teamId, connected }
}
