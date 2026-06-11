import './AnswerButtons.css'

const LABELS = ['A', 'B', 'C', 'D']

type ButtonState = 'idle' | 'selected' | 'correct' | 'incorrect' | 'locked'

type Props = {
  options: string[]
  selectedIndex: number | null
  correctIndex: number | null  // null until revealed
  phase: 'question' | 'reveal'
  onSelect: (index: number) => void
}

export function AnswerButtons({ options, selectedIndex, correctIndex, phase, onSelect }: Props) {
  function getState(i: number): ButtonState {
    if (phase === 'question') {
      if (selectedIndex === null) return 'idle'
      return selectedIndex === i ? 'selected' : 'locked'
    }
    // reveal phase
    if (correctIndex !== null && i === correctIndex) return 'correct'
    if (i === selectedIndex && correctIndex !== null) return 'incorrect'
    return 'locked'
  }

  return (
    <div className="answer-buttons">
      {options.map((option, i) => {
        const state = getState(i)
        return (
          <button
            key={i}
            className={`answer-btn ${state}`}
            disabled={phase === 'reveal'}
            onClick={() => onSelect(i)}
          >
            <span className="answer-opt">{LABELS[i]}</span>
            {option}
          </button>
        )
      })}
    </div>
  )
}
