import { useState } from 'react'

const responsibilities = [
  { name: 'Information & data', onprem: 'you', iaas: 'you', paas: 'you', saas: 'you' },
  { name: 'Devices (mobile & PCs)', onprem: 'you', iaas: 'you', paas: 'you', saas: 'you' },
  { name: 'Accounts & identities', onprem: 'you', iaas: 'you', paas: 'you', saas: 'you' },
  { name: 'Identity & directory infra', onprem: 'you', iaas: 'you', paas: 'shared', saas: 'shared' },
  { name: 'Applications', onprem: 'you', iaas: 'you', paas: 'shared', saas: 'ms' },
  { name: 'Network controls', onprem: 'you', iaas: 'you', paas: 'shared', saas: 'ms' },
  { name: 'Operating system', onprem: 'you', iaas: 'you', paas: 'ms', saas: 'ms' },
  { name: 'Physical hosts', onprem: 'you', iaas: 'ms', paas: 'ms', saas: 'ms' },
  { name: 'Physical network', onprem: 'you', iaas: 'ms', paas: 'ms', saas: 'ms' },
  { name: 'Physical datacenter', onprem: 'you', iaas: 'ms', paas: 'ms', saas: 'ms' },
]

const colors = {
  you: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Customer' },
  ms: { bg: 'bg-azure/20', text: 'text-azure', border: 'border-azure/30', label: 'Microsoft' },
  shared: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', label: 'Shared' },
}

const breachScenarios = [
  { name: 'Employee shares password', who: 'you', why: 'Account management is always yours' },
  { name: 'Datacenter flood damages hardware', who: 'ms', why: 'Physical datacenter is always Microsoft' },
  { name: 'Unpatched OS on IaaS VM gets hacked', who: 'you', why: 'OS patching in IaaS is your job' },
  { name: 'Unpatched OS on PaaS app gets hacked', who: 'ms', why: 'OS patching in PaaS is Microsoft\'s job' },
  { name: 'SQL injection in your web app on App Service', who: 'you', why: 'Your application code is always your responsibility' },
  { name: 'Azure backbone network outage', who: 'ms', why: 'Physical network is always Microsoft' },
  { name: 'User grants too-broad permissions', who: 'you', why: 'Access management is always customer responsibility' },
]

export function SharedResponsibilityDemo() {
  const [model, setModel] = useState('iaas')
  const [highlightRow, setHighlightRow] = useState(null)
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [showWho, setShowWho] = useState(false)

  const modelKeys = ['onprem', 'iaas', 'paas', 'saas']
  const modelLabels = { onprem: 'On-Prem', iaas: 'IaaS', paas: 'PaaS', saas: 'SaaS' }

  return (
    <div>
      <p className="text-text-dim mb-4 text-sm">Top 3 = <span className="text-amber-400">always yours</span>. Bottom 3 = <span className="text-azure">always Microsoft</span>. Middle shifts.</p>

      {/* Full matrix view */}
      <div className="bg-surface-2 rounded-lg p-5 mb-6 overflow-x-auto">
        <h3 className="text-white font-medium mb-3">Full Responsibility Matrix</h3>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left text-text-dim py-2 pr-4">Layer</th>
              {modelKeys.map(k => (
                <th key={k} className={`text-center py-2 px-3 cursor-pointer ${model === k ? 'text-azure' : 'text-text-dim'}`}
                  onClick={() => setModel(k)}>
                  {modelLabels[k]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responsibilities.map((r, i) => (
              <tr key={r.name} className={`${highlightRow === i ? 'ring-1 ring-white/20' : ''}`}
                onMouseEnter={() => setHighlightRow(i)} onMouseLeave={() => setHighlightRow(null)}>
                <td className="py-1.5 pr-4 text-white">{r.name}</td>
                {modelKeys.map(k => {
                  const who = r[k]
                  const c = colors[who]
                  return (
                    <td key={k} className="py-1.5 px-1">
                      <div className={`${c.bg} ${c.text} text-center py-1 rounded text-xs font-medium ${model === k ? 'ring-1 ring-white/10' : ''}`}>
                        {c.label}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selected model stack */}
        <div className="bg-surface-2 rounded-lg p-5">
          <div className="flex gap-2 mb-4">
            {modelKeys.map(m => (
              <button key={m} onClick={() => setModel(m)}
                className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${
                  model === m ? 'bg-azure text-white' : 'bg-surface-3 text-text-dim hover:text-white'
                }`}>{modelLabels[m]}</button>
            ))}
          </div>
          <div className="space-y-1.5">
            {responsibilities.map((r) => {
              const who = r[model]
              const c = colors[who]
              return (
                <div key={r.name}
                  className={`flex justify-between items-center px-4 py-2.5 rounded ${c.bg} border ${c.border} transition-all duration-300`}>
                  <span className={`text-sm font-medium ${c.text}`}>{r.name}</span>
                  <span className={`text-xs ${c.text} opacity-70`}>{c.label}</span>
                </div>
              )
            })}
          </div>
          <div className="flex gap-4 mt-4 justify-center text-sm">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-500/40" /> Customer</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-500/40" /> Shared</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-azure/40" /> Microsoft</div>
          </div>
        </div>

        {/* Breach scenarios */}
        <div className="bg-surface-2 rounded-lg p-5">
          <h3 className="text-white font-medium mb-3">Who's responsible?</h3>
          <div className="bg-surface-3 rounded-lg p-4 mb-3">
            <p className="text-white font-medium text-sm">{breachScenarios[scenarioIdx].name}</p>
          </div>

          {!showWho ? (
            <div className="flex gap-3">
              {['you', 'ms', 'shared'].map(w => (
                <button key={w} onClick={() => setShowWho(true)}
                  className={`flex-1 px-3 py-2 rounded cursor-pointer border text-sm ${colors[w].border} ${colors[w].bg} ${colors[w].text}`}>
                  {colors[w].label}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <div className={`${colors[breachScenarios[scenarioIdx].who].bg} border ${colors[breachScenarios[scenarioIdx].who].border} rounded-lg p-3 mb-3`}>
                <span className={`font-medium ${colors[breachScenarios[scenarioIdx].who].text}`}>
                  {colors[breachScenarios[scenarioIdx].who].label}
                </span>
                <span className="text-text-dim text-sm ml-2">— {breachScenarios[scenarioIdx].why}</span>
              </div>
              <button onClick={() => { setScenarioIdx((scenarioIdx + 1) % breachScenarios.length); setShowWho(false) }}
                className="px-4 py-2 bg-azure hover:bg-azure-dark text-white rounded cursor-pointer text-sm">
                Next scenario
              </button>
            </div>
          )}

          {/* Always/never rules */}
          <div className="mt-4 space-y-2">
            <h4 className="text-white font-medium text-sm">Rules that never change:</h4>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded p-2 text-xs text-amber-400">
              ALWAYS yours: Data, Accounts, Devices
            </div>
            <div className="bg-azure/10 border border-azure/20 rounded p-2 text-xs text-azure">
              ALWAYS Microsoft: Physical DC, Physical network, Physical hosts
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded p-2 text-xs text-purple-400">
              SHIFTS by model: OS, Apps, Network controls, Identity infra
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
