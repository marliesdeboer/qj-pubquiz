import type { Answer, Question } from '../../types/game'
import './AnswerDistribution.css'

const LABELS = ['A', 'B', 'C', 'D']

type Props = {
  question: Question
  answers: Answer[]
  revealed: boolean
}

export function AnswerDistribution({ question, answers, revealed }: Props) {
  const isPoll = question.type === 'poll'
  const counts = question.options.map((_, i) =>
    answers.filter(a => a.answer === question.options[i]).length
  )
  const max = Math.max(...counts, 1)
  const total = answers.length

  return (
    <div className={`distribution ${revealed ? 'revealed' : ''}`}>
      {question.options.map((option, i) => {
        const count = counts[i]
        const pct = (count / max) * 100
        const share = total > 0 ? Math.round((count / total) * 100) : 0
        const isCorrect = !isPoll && revealed && i === question.answerIndex
        const isIncorrect = !isPoll && revealed && question.answerIndex !== null && i !== question.answerIndex
        const isPollTop = isPoll && revealed && count === max && count > 0
        return (
          <div
            key={i}
            className={`dist-row ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''} ${isPollTop ? 'poll-top' : ''}`}
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <span className="dist-letter">{isCorrect ? '✓' : LABELS[i]}</span>
            <div className="dist-main">
              <div className="dist-head">
                <span className="dist-option-text">{option}</span>
                {revealed && total > 0 && <span className="dist-count">{share}%</span>}
              </div>
              {/* Verdeling pas tonen bij reveal — antwoorden zijn tot dan wijzigbaar */}
              <div className="dist-bar-track">
                <div className="dist-bar-fill" style={{ width: revealed && count > 0 ? `${pct}%` : '0%' }} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
