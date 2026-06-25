import { useCallback, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import type { GameState, ClientMessage, MediaContent } from '../../types/game'
import { QUESTIONS, getTimerForRound, getThemeForRound, ROUND_END_INDICES, ROUND_TITLES } from '../../data/questions'
import { Timer } from '../shared/Timer'
import { ChartView } from '../shared/ChartView'
import { AnswerDistribution } from './AnswerDistribution'
import { Leaderboard } from './Leaderboard'
import './HostView.css'

type Props = {
  gameState: GameState | null
  send: (msg: ClientMessage) => void
  roundCardShowing?: boolean
}

function BrandMark({ round }: { round: number }) {
  const theme = getThemeForRound(round)
  if (theme === 'qmusic') return <span className="host-brand host-brand-q">QMUSIC</span>
  if (theme === 'joe') return <span className="host-brand host-brand-joe">joe<span>.</span></span>
  return (
    <span className="host-brand host-brand-duo">
      <span className="bq">Q</span><span className="bamp">&</span><span className="bj">JOE</span>
    </span>
  )
}

function MediaReveal({ questionId, media }: { questionId: string; media: MediaContent }) {
  const [mainFailed, setMainFailed] = useState(false)

  if (media.type === 'chart') {
    return (
      <ChartView
        chartType={media.chartType}
        title={media.title}
        data={media.data}
        unit={media.unit}
        note={media.note}
        maxValue={media.maxValue}
      />
    )
  }

  if (media.type === 'poll') {
    return null // de live stemverdeling ís de media
  }

  // video / image / audio — lokaal geserveerd vanuit /public/media/<id>.<ext>
  const ext = media.ext ?? (media.type === 'video' ? 'mp4' : media.type === 'image' ? 'png' : 'mp3')
  const src = `/media/${questionId}.${ext}`

  const extraImg = (media.type === 'video' || media.type === 'image') && media.extraImage
    ? <img className="host-media-el host-media-extra" src={`/media/${media.extraImage}.${media.extraImageExt ?? 'png'}`} alt="" />
    : null

  if (media.type === 'video') {
    return (
      <div className="host-media-multi">
        {mainFailed
          ? <div className="host-media-missing">
              <span className="host-media-missing-icon">⚠</span>
              Videobestand ontbreekt — zet <code>{questionId}.mp4</code> in <code>public/media/</code>
            </div>
          : <video className="host-media-el" src={src} controls onError={() => setMainFailed(true)} />
        }
        {extraImg}
      </div>
    )
  }
  if (media.type === 'image') {
    return (
      <div className="host-media-multi">
        {mainFailed
          ? <div className="host-media-missing">
              <span className="host-media-missing-icon">⚠</span>
              Afbeelding ontbreekt — zet <code>{questionId}.png</code> in <code>public/media/</code>
            </div>
          : <img className="host-media-el" src={src} alt={media.description} onError={() => setMainFailed(true)} />
        }
        {extraImg}
      </div>
    )
  }
  return (
    <div className="host-audio-wrap">
      <div className="host-audio-icon">♫</div>
      <div className="host-audio-desc">{media.description}</div>
      <audio className="host-media-audio" src={src} controls onError={() => setMainFailed(true)} />
    </div>
  )
}

export function HostView({ gameState, send, roundCardShowing = false }: Props) {
  const phase = gameState?.phase
  const finishedFired = useRef(false)
  useEffect(() => {
    if (phase === 'finished' && !finishedFired.current) {
      finishedFired.current = true
      const end = Date.now() + 4000
      const frame = () => {
        confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors: ['#E8201E', '#2B72D4', '#FF4D73', '#F2F0EB'] })
        confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#E8201E', '#2B72D4', '#FF4D73', '#F2F0EB'] })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
    }
    if (phase !== 'finished') finishedFired.current = false
  }, [phase])

  const primaryAction = useCallback(() => {
    if (!gameState) return
    const { phase, currentQuestion, teams } = gameState
    if (phase === 'lobby' && teams.length > 0) send({ type: 'NEXT_QUESTION', isHost: true })
    else if (phase === 'question') send({ type: 'REVEAL', isHost: true })
    else if (phase === 'reveal' && currentQuestion < 20) send({ type: 'NEXT_QUESTION', isHost: true })
    else if (phase === 'leaderboard') send({ type: 'NEXT_ROUND', isHost: true })
  }, [gameState, send])

  // Spatiebalk = primaire actie, zodat de quizmaster niet hoeft te muizen
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (roundCardShowing) return
      if (e.code === 'Space' && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault()
        primaryAction()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [primaryAction, roundCardShowing])

  if (!gameState) {
    return <div className="host-view host-center">Verbinden…</div>
  }

  const { currentQuestion, currentRound, teams, answers } = gameState
  const question = QUESTIONS[currentQuestion]
  const timerDuration = getTimerForRound(currentRound)
  const isEndOfRound = ROUND_END_INDICES.includes(currentQuestion)
  const isLastQuestion = currentQuestion === 19
  const isPoll = question.type === 'poll'
  const hasMediaPanel = question.media.type !== 'poll'

  const primaryLabel =
    phase === 'lobby' ? 'Start de quiz' :
    phase === 'question' ? (isPoll ? 'Sluit stemming' : 'Onthul antwoord') :
    phase === 'reveal' ? (isLastQuestion ? 'Eindstand' : isEndOfRound ? 'Tussenstand' : 'Volgende vraag') :
    phase === 'leaderboard' ? `Start ronde ${currentRound + 1}` : ''

  const rounds = [1, 2, 3, 4]

  return (
    <div className="host-view">
      <aside className="host-nav">
        {rounds.map(r => (
          <div key={r} className="host-nav-round">
            <div className="host-nav-round-label">R{r}</div>
            {QUESTIONS.filter(q => q.round === r).map((q) => {
              const idx = QUESTIONS.indexOf(q)
              const isCurrent = idx === currentQuestion
              const isPast = idx < currentQuestion
              return (
                <button
                  key={q.id}
                  className={`host-nav-btn ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''}`}
                  title={q.question}
                  onClick={() => {
                    if (isCurrent) return
                    send({ type: 'JUMP_TO_QUESTION', isHost: true, questionIndex: idx })
                  }}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
        ))}
      </aside>

      <header className="host-topbar">
        <BrandMark round={currentRound} />
        <span className="host-topbar-meta">
          {(phase === 'question' || phase === 'reveal') && (
            <>Ronde {currentRound} — {ROUND_TITLES[currentRound]} · Vraag {currentQuestion + 1}/20</>
          )}
          {phase === 'lobby' && <>Van radio naar content · 6 juli 2026</>}
          {phase === 'leaderboard' && <>Tussenstand</>}
          {phase === 'finished' && <>Eindstand</>}
        </span>
        <span className="host-topbar-teams">{teams.length} teams</span>
      </header>

      {phase === 'lobby' && (
        <main className="host-stage host-stage-center" key="lobby">
          <div className="host-kicker">Q & Joe · Leiderschapssessie</div>
          <h1 className="host-hero-title">Van radio<br />naar content</h1>
          <div className="host-lobby-status">
            {teams.length === 0
              ? 'Wacht op teams — open de spelerslink op je telefoon'
              : `${teams.length} team${teams.length !== 1 ? 's' : ''} staat${teams.length !== 1 ? 'an' : ''} klaar`}
          </div>
          <div className="host-lobby-teams">
            {teams.map((t, i) => (
              <span key={t.id} className="host-team-pill" style={{ animationDelay: `${i * 60}ms` }}>{t.name}</span>
            ))}
          </div>
        </main>
      )}

      {(phase === 'question' || phase === 'reveal') && (
        <main className={`host-stage host-stage-q ${phase === 'reveal' && hasMediaPanel ? 'with-media' : ''}`} key={`${currentQuestion}-${phase === 'reveal' ? 'r' : 'q'}`}>
          <div className="host-q-col">
            <div className="host-q-meta">
              <span className="host-q-label">
                Vraag {currentQuestion + 1}
                {isPoll && <span className="host-poll-badge">Poll — geen goed of fout</span>}
              </span>
              {phase === 'question' && (
                <Timer key={currentQuestion} duration={timerDuration} running={!roundCardShowing} />
              )}
            </div>
            <h1 className={`host-question-text ${phase === 'reveal' ? 'compact' : ''}`}>{question.question}</h1>

            <div className="host-dist-block">
              <div className="host-dist-label">
                {phase === 'question'
                  ? `${answers.length} van ${teams.length} teams heeft ${isPoll ? 'gestemd' : 'geantwoord'}`
                  : isPoll ? 'De stemming van de zaal' : 'Het antwoord'}
              </div>
              <AnswerDistribution
                question={question}
                answers={answers}
                revealed={phase === 'reveal'}
              />
            </div>

            {phase === 'reveal' && (
              <div className="host-sowhat">
                <div className="host-sowhat-label">So what</div>
                <p className="host-sowhat-text">{question.explanation}</p>
                {question.source && <div className="host-source">{question.source}</div>}
              </div>
            )}
          </div>

          {phase === 'reveal' && hasMediaPanel && (
            <aside className="host-media-col">
              <MediaReveal questionId={question.id} media={question.media} />
            </aside>
          )}
        </main>
      )}

      {phase === 'leaderboard' && (
        <main className="host-stage host-stage-center" key="leaderboard">
          <div className="host-kicker">Na ronde {currentRound}: {ROUND_TITLES[currentRound]}</div>
          <h1 className="host-hero-title host-hero-smaller">De stand</h1>
          <Leaderboard teams={teams} size="stage" />
        </main>
      )}

      {phase === 'finished' && (
        <main className="host-stage host-stage-center" key="finished">
          <div className="host-kicker">Q & Joe · Van radio naar content</div>
          <h1 className="host-hero-title host-hero-smaller">Eindstand</h1>
          <Leaderboard teams={teams} size="stage" podium />
          <div className="host-finished-note">Dit gesprek gaat nu pas écht beginnen.</div>
        </main>
      )}

      <footer className="host-controls">
        {primaryLabel && (
          <button
            className="host-ctrl-btn primary"
            disabled={phase === 'lobby' && teams.length === 0}
            onClick={primaryAction}
          >
            {primaryLabel}
            <kbd>spatie</kbd>
          </button>
        )}
        {(phase === 'question' || phase === 'reveal') && currentQuestion > 0 && (
          <button
            className="host-ctrl-btn ghost"
            title="Vorige vraag"
            onClick={() => { if (confirm('Terug naar vorige vraag? Antwoorden worden gewist.')) send({ type: 'PREV_QUESTION', isHost: true }) }}
          >
            ←
          </button>
        )}
        <button
          className="host-ctrl-btn ghost"
          onClick={() => { if (confirm('Hele quiz resetten? Alle scores gaan verloren.')) send({ type: 'RESET', isHost: true }) }}
        >
          ⟳
        </button>
      </footer>
    </div>
  )
}
