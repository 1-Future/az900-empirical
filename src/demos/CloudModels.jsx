import { useState } from 'react'

const layers = [
  { name: 'Networking', cat: 'infra' },
  { name: 'Storage', cat: 'infra' },
  { name: 'Servers', cat: 'infra' },
  { name: 'Virtualization', cat: 'infra' },
  { name: 'OS', cat: 'platform' },
  { name: 'Middleware', cat: 'platform' },
  { name: 'Runtime', cat: 'platform' },
  { name: 'Data', cat: 'app' },
  { name: 'Application', cat: 'app' },
]

const models = {
  'On-Prem': { azure: 0, label: 'On-Premises', examples: ['Your server rack', 'Company datacenter'], analogy: 'Building your own house from scratch' },
  'IaaS': { azure: 4, label: 'Infrastructure as a Service', examples: ['Azure VMs', 'Virtual Network', 'Disk Storage'], analogy: 'Renting an empty apartment — you furnish it' },
  'PaaS': { azure: 7, label: 'Platform as a Service', examples: ['App Service', 'Azure SQL', 'Functions'], analogy: 'Renting a furnished apartment — just move in' },
  'SaaS': { azure: 9, label: 'Software as a Service', examples: ['Microsoft 365', 'Outlook.com', 'OneDrive'], analogy: 'Staying at a hotel — everything done for you' },
}

const scenarios = [
  { q: 'Legacy Windows app, no code changes', answer: 'IaaS', why: 'Lift-and-shift needs a VM with the old OS' },
  { q: 'Deploy a Node.js API quickly', answer: 'PaaS', why: 'App Service handles the server, you deploy code' },
  { q: 'Company needs email for 500 employees', answer: 'SaaS', why: 'Microsoft 365 — no servers to manage' },
  { q: 'Custom GPU machine learning training', answer: 'IaaS', why: 'Need full control over GPU drivers and OS config' },
  { q: 'Run code only when an event fires', answer: 'PaaS', why: 'Azure Functions — serverless, event-driven PaaS' },
  { q: 'Replace on-prem file server with cloud shares', answer: 'PaaS', why: 'Azure Files — managed SMB shares, no VM needed' },
]

export function CloudModelsDemo() {
  const [selected, setSelected] = useState('IaaS')
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <div>
      <p className="text-text-dim mb-4 text-sm"><span className="text-azure">Azure</span> vs <span className="text-amber-400">You</span> — who manages what?</p>

      {/* Model selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.keys(models).map(m => (
          <button key={m} onClick={() => setSelected(m)}
            className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
              selected === m ? 'bg-azure text-white' : 'bg-surface-3 text-text-dim hover:text-white'
            }`}>{m}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ALL 4 stacks side by side comparison */}
        <div className="lg:col-span-2 bg-surface-2 rounded-lg p-5">
          <h3 className="text-white font-medium mb-3">Side-by-Side Comparison</h3>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(models).map(([key, m]) => (
              <div key={key} className={`rounded-lg p-2 border ${selected === key ? 'border-azure' : 'border-border'}`}>
                <div className={`text-xs font-medium text-center mb-2 ${selected === key ? 'text-azure' : 'text-text-dim'}`}>{key}</div>
                <div className="space-y-0.5">
                  {[...layers].reverse().map((layer, i) => {
                    const layerIdx = layers.length - 1 - i
                    const isAzure = layerIdx < m.azure
                    return (
                      <div key={layer.name}
                        className={`px-1.5 py-1 rounded text-center transition-all duration-300 ${
                          isAzure
                            ? 'bg-azure/20 text-azure'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                        style={{ fontSize: '10px' }}>
                        {layer.name}
                      </div>
                    )
                  })}
                </div>
                <div className="mt-2 text-center">
                  <span className="text-amber-400 text-xs font-mono">{9 - m.azure}</span>
                  <span className="text-text-dim text-xs"> you / </span>
                  <span className="text-azure text-xs font-mono">{m.azure}</span>
                  <span className="text-text-dim text-xs"> azure</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected model detail */}
        <div className="bg-surface-2 rounded-lg p-5">
          <h3 className="text-white font-medium mb-2">{models[selected].label}</h3>
          <div className="space-y-1.5 mb-4">
            {[...layers].reverse().map((layer, i) => {
              const layerIdx = layers.length - 1 - i
              const isAzure = layerIdx < models[selected].azure
              return (
                <div key={layer.name}
                  className={`px-4 py-2.5 rounded text-sm font-medium transition-all duration-300 flex justify-between ${
                    isAzure
                      ? 'bg-azure/20 text-azure border border-azure/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                  <span>{layer.name}</span>
                  <span className="text-xs opacity-70">{isAzure ? 'Azure' : 'You'}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Details panel */}
        <div className="space-y-4">
          <div className="bg-surface-2 rounded-lg p-5">
            <h4 className="text-white font-medium mb-2">Analogy</h4>
            <p className="text-text-dim text-sm">{models[selected].analogy}</p>
          </div>

          <div className="bg-surface-2 rounded-lg p-5">
            <h4 className="text-white font-medium mb-2">Examples</h4>
            <div className="flex flex-wrap gap-2">
              {models[selected].examples.map(e => (
                <span key={e} className="text-sm bg-azure/10 text-azure px-3 py-1 rounded border border-azure/20">{e}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-400">{9 - models[selected].azure}</div>
              <div className="text-text-dim text-xs">You manage</div>
            </div>
            <div className="bg-azure/10 border border-azure/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-azure">{models[selected].azure}</div>
              <div className="text-text-dim text-xs">Azure manages</div>
            </div>
          </div>
        </div>

        {/* Scenario matcher */}
        <div className="lg:col-span-2 bg-surface-2 rounded-lg p-5">
          <h3 className="text-white font-medium mb-3">Which model fits?</h3>
          <div className="bg-surface-3 rounded-lg p-4 mb-3">
            <p className="text-white font-medium">{scenarios[scenarioIdx].q}</p>
          </div>

          {!showAnswer ? (
            <div className="flex gap-2 flex-wrap">
              {Object.keys(models).map(m => (
                <button key={m} onClick={() => { setShowAnswer(true); setSelected(m === scenarios[scenarioIdx].answer ? m : selected) }}
                  className={`px-4 py-2 rounded-lg cursor-pointer border ${
                    m === scenarios[scenarioIdx].answer
                      ? 'border-success bg-success/10 text-success'
                      : 'border-border bg-surface-3 text-text-dim hover:text-white'
                  }`}>{m}</button>
              ))}
              <button onClick={() => setShowAnswer(true)}
                className="px-4 py-2 rounded-lg cursor-pointer text-azure hover:underline text-sm">
                Show answer
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-success font-medium">{scenarios[scenarioIdx].answer}</span>
                <span className="text-text-dim text-sm">— {scenarios[scenarioIdx].why}</span>
              </div>
              <button onClick={() => { setScenarioIdx((scenarioIdx + 1) % scenarios.length); setShowAnswer(false) }}
                className="px-4 py-2 bg-azure hover:bg-azure-dark text-white rounded cursor-pointer text-sm">
                Next scenario
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
