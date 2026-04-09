import { useState } from 'react'

export function Quiz({ questions, onBack }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const score = submitted
    ? questions.filter((q, i) => answers[i] === q.answer).length
    : 0

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-6">Practice Questions</h2>
      <div className="space-y-6">
        {questions.map((q, qi) => (
          <div key={qi} className="bg-surface-2 rounded-lg p-5">
            <p className="text-white font-medium mb-3">{qi + 1}. {q.q}</p>
            <div className="space-y-2">
              {q.choices.map((c, ci) => {
                let cls = 'border-border hover:border-azure/50'
                if (submitted) {
                  if (ci === q.answer) cls = 'border-success bg-success/10'
                  else if (answers[qi] === ci && ci !== q.answer) cls = 'border-danger bg-danger/10'
                } else if (answers[qi] === ci) {
                  cls = 'border-azure bg-azure/10'
                }
                return (
                  <button key={ci} disabled={submitted}
                    onClick={() => setAnswers(a => ({ ...a, [qi]: ci }))}
                    className={`w-full text-left px-4 py-2.5 rounded border ${cls} text-sm transition-colors cursor-pointer disabled:cursor-default`}>
                    {c}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        {!submitted ? (
          <button onClick={() => setSubmitted(true)}
            disabled={Object.keys(answers).length < questions.length}
            className="px-6 py-2.5 bg-azure hover:bg-azure-dark disabled:opacity-40 text-white rounded-lg cursor-pointer disabled:cursor-not-allowed transition-colors">
            Submit Answers
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold text-white">
              {score}/{questions.length} correct
            </span>
            <button onClick={() => { setAnswers({}); setSubmitted(false) }}
              className="px-4 py-2 bg-surface-3 hover:bg-border text-white rounded cursor-pointer">
              Retry
            </button>
            <button onClick={onBack}
              className="px-4 py-2 text-azure hover:underline cursor-pointer">
              Back to Demo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
