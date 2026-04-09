import { useState } from 'react'
import { Quiz } from '../components/Quiz'

export function DemoPage({ demo, onBack }) {
  const [phase, setPhase] = useState('demo')
  const { Component } = demo

  return (
    <div className="min-h-screen">
      <header className="border-b border-border px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="text-azure hover:underline cursor-pointer">&larr; Back</button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-white">{demo.title}</h1>
          <div className="flex gap-2 mt-1">
            {demo.acronyms.map(a => (
              <span key={a} className="text-xs font-mono px-2 py-0.5 rounded bg-azure/20 text-azure">{a}</span>
            ))}
          </div>
        </div>
        <div className="flex gap-1 text-sm">
          <button onClick={() => setPhase('demo')}
            className={`px-3 py-1.5 rounded cursor-pointer ${phase === 'demo' ? 'bg-azure text-white' : 'bg-surface-3 text-text-dim hover:text-white'}`}>
            See
          </button>
          <button onClick={() => setPhase('quiz')}
            className={`px-3 py-1.5 rounded cursor-pointer ${phase === 'quiz' ? 'bg-azure text-white' : 'bg-surface-3 text-text-dim hover:text-white'}`}>
            Test
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {phase === 'demo' && (
          <div>
            <Component />
            <div className="mt-8 text-center">
              <button onClick={() => setPhase('quiz')}
                className="px-6 py-2.5 bg-azure hover:bg-azure-dark text-white rounded-lg cursor-pointer transition-colors">
                Test Yourself &rarr;
              </button>
            </div>
          </div>
        )}

        {phase === 'quiz' && (
          <Quiz questions={demo.questions} onBack={() => setPhase('demo')} />
        )}
      </main>
    </div>
  )
}
