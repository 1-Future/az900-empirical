import { useState } from 'react'

const scenarios = [
  {
    name: 'Basic Login',
    steps: [
      { text: 'User enters username + password', status: 'check' },
      { text: 'Entra ID validates credentials', status: 'check' },
      { text: 'Access granted', status: 'success' },
    ],
    mfa: false,
    ca: false,
  },
  {
    name: 'Login + MFA',
    steps: [
      { text: 'User enters username + password', status: 'check' },
      { text: 'Entra ID validates credentials', status: 'check' },
      { text: 'MFA challenge: Approve on phone', status: 'check' },
      { text: 'User approves authenticator prompt', status: 'check' },
      { text: 'Access granted (2 factors verified)', status: 'success' },
    ],
    mfa: true,
    ca: false,
  },
  {
    name: 'Conditional Access Block',
    steps: [
      { text: 'User enters username + password', status: 'check' },
      { text: 'Entra ID validates credentials', status: 'check' },
      { text: 'Conditional Access evaluates...', status: 'check' },
      { text: 'Policy: "Block access from unknown locations"', status: 'check' },
      { text: 'User location: Unknown country', status: 'danger' },
      { text: 'ACCESS DENIED by Conditional Access', status: 'blocked' },
    ],
    mfa: false,
    ca: true,
  },
  {
    name: 'SSO Flow',
    steps: [
      { text: 'User signs into App A via Entra ID', status: 'check' },
      { text: 'Token issued for App A', status: 'check' },
      { text: 'User opens App B (same tenant)', status: 'check' },
      { text: 'Entra ID recognizes existing session', status: 'check' },
      { text: 'No password prompt — SSO token reused', status: 'success' },
    ],
    mfa: false,
    ca: false,
  },
]

export function IdentityDemo() {
  const [selected, setSelected] = useState(0)
  const [step, setStep] = useState(0)
  const scenario = scenarios[selected]
  const visibleSteps = scenario.steps.slice(0, step + 1)

  const selectScenario = (i) => { setSelected(i); setStep(0) }

  return (
    <div>
      <p className="text-text-dim mb-4 text-sm">Step through login flows. See what gets blocked and why.</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {scenarios.map((s, i) => (
          <button key={s.name} onClick={() => selectScenario(i)}
            className={`px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
              selected === i ? 'bg-azure text-white' : 'bg-surface-3 text-text-dim hover:text-white'
            }`}>{s.name}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-surface-2 rounded-lg p-6">
          <h3 className="text-white font-medium mb-4">{scenario.name}</h3>
          <div className="space-y-3">
            {visibleSteps.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-300 ${
                s.status === 'success' ? 'border-success/30 bg-success/10' :
                s.status === 'blocked' ? 'border-danger/30 bg-danger/10' :
                s.status === 'danger' ? 'border-amber-500/30 bg-amber-500/10' :
                'border-border bg-surface-3'
              }`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  s.status === 'success' ? 'bg-success text-white' :
                  s.status === 'blocked' ? 'bg-danger text-white' :
                  s.status === 'danger' ? 'bg-amber-500 text-white' :
                  'bg-azure text-white'
                }`}>{i + 1}</span>
                <span className={`text-sm ${
                  s.status === 'success' ? 'text-success' :
                  s.status === 'blocked' ? 'text-danger' :
                  'text-white'
                }`}>{s.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            {step < scenario.steps.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)}
                className="px-4 py-2 bg-azure hover:bg-azure-dark text-white rounded cursor-pointer">
                Next Step
              </button>
            ) : (
              <button onClick={() => setStep(0)}
                className="px-4 py-2 bg-surface-3 text-white rounded cursor-pointer hover:bg-border">
                Replay
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-surface-2 rounded-lg p-4">
            <h4 className="text-white font-medium text-sm mb-2">Key Concepts</h4>
            <div className="space-y-2 text-sm">
              <div className={`px-3 py-2 rounded ${scenario.mfa ? 'bg-azure/20 text-azure border border-azure/30' : 'bg-surface-3 text-text-dim'}`}>
                MFA: Something you know + something you have/are
              </div>
              <div className={`px-3 py-2 rounded ${scenario.ca ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-surface-3 text-text-dim'}`}>
                Conditional Access: If/then policies (location, device, risk)
              </div>
              <div className="px-3 py-2 rounded bg-surface-3 text-text-dim">
                SSO: One login, access many apps
              </div>
              <div className="px-3 py-2 rounded bg-surface-3 text-text-dim">
                Entra ID: Cloud-based identity service (not on-prem AD)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
