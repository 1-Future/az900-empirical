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

export function SharedResponsibilityDemo() {
  const [model, setModel] = useState('iaas')

  return (
    <div>
      <p className="text-text-dim mb-6">
        The shared responsibility model defines who secures what. The top 3 rows are <span className="text-amber-400">always yours</span>.
        The bottom 3 are <span className="text-azure">always Microsoft's</span>. The middle shifts based on cloud model.
      </p>

      <div className="flex gap-2 mb-6">
        {['onprem', 'iaas', 'paas', 'saas'].map(m => (
          <button key={m} onClick={() => setModel(m)}
            className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
              model === m ? 'bg-azure text-white' : 'bg-surface-3 text-text-dim hover:text-white'
            }`}>{m === 'onprem' ? 'On-Prem' : m.toUpperCase()}</button>
        ))}
      </div>

      <div className="bg-surface-2 rounded-lg p-5">
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
      </div>

      <div className="flex gap-4 mt-4 justify-center text-sm">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-500/40" /> Customer</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-purple-500/40" /> Shared</div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-azure/40" /> Microsoft</div>
      </div>
    </div>
  )
}
