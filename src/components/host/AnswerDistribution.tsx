import type { Answer, Question } from '../../types/game'
import './AnswerDistribution.css'

const LABELS = ['A', 'B', 'C', 'D']

type Props = {
  question: Question
  answers: Answer[]
  revealed: boolean
}

export function AnswerDistribution({ question, answers, revealed }: Props) {
  const counts = question.options.map((_, i) =>
    answers.filter(a => a.answer === question.options[i]).length
  )
  const max = Math.max(...counts, 1)

  return (
    <div className="distribution">
      {question.options.map((option, i) => {
        const count = counts[i]
        const pct = (count / max) * 100
        const isCorrect = revealed && i === question.correctIndex
        const isIncorrect = revealed && i !== question.correctIndex && question.correctIndex !== -1
        return (
          <div key={i} className="dist-row">
            <span className={`dist-label ${isCorrect ? 'correct' : ''}`}>
              {isCorrect ? `${LABELS[i]} ✓` : LABELS[i]}
            </span>
            <div className="dist-bar-track">
              <div
                className={`dist-bar-fill ${isCorrect ? 'correct' : isIncorrect ? 'incorrect' : ''}`}
                style={{ width: count === 0 ? '0%' : `${pct}%` }}
              >
                {count > 0 && <span className="dist-count">{count}</span>}
              </div>
            </div>
            <span className={`dist-option-text ${isCorrect ? 'correct' : ''}`}>{option}</span>
          </div>
        )
      })}
    </div>
  )
}
