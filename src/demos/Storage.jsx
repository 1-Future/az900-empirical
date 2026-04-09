import { useState } from 'react'

const storageTypes = [
  { name: 'Blob Storage', color: 'blue', desc: 'Object storage for unstructured data. Images, videos, backups, logs.', protocol: 'REST/HTTP', examples: ['Photos', 'Videos', 'Backups', 'Logs', 'VHDs'] },
  { name: 'Azure Files', color: 'purple', desc: 'Managed file shares. Mount as network drive via SMB or NFS.', protocol: 'SMB / NFS', examples: ['Shared configs', 'Legacy app migration', 'Dev tools'] },
  { name: 'Queue Storage', color: 'amber', desc: 'Message queue for async processing. Decouples app components.', protocol: 'REST/HTTP', examples: ['Order processing', 'Task queues', 'Notifications'] },
  { name: 'Table Storage', color: 'emerald', desc: 'NoSQL key-value store. Simple structured data, massive scale.', protocol: 'REST/OData', examples: ['IoT data', 'User profiles', 'Metadata'] },
]

const redundancy = [
  { name: 'LRS', full: 'Locally Redundant', copies: 3, scope: 'Single datacenter', durability: '11 nines', cost: '$' },
  { name: 'ZRS', full: 'Zone Redundant', copies: 3, scope: '3 availability zones', durability: '12 nines', cost: '$$' },
  { name: 'GRS', full: 'Geo Redundant', copies: 6, scope: '2 regions (primary LRS + secondary LRS)', durability: '16 nines', cost: '$$$' },
  { name: 'GZRS', full: 'Geo-Zone Redundant', copies: 6, scope: 'Primary ZRS + secondary LRS', durability: '16 nines', cost: '$$$$' },
]

const colorMap = {
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400' },
  purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400' },
  amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400' },
  emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400' },
}

export function StorageDemo() {
  const [tab, setTab] = useState('types')
  const [selRedundancy, setSelRedundancy] = useState(0)

  return (
    <div>
      <p className="text-text-dim mb-6">
        Azure Storage has 4 core services for different data types, and 4 redundancy options for durability.
      </p>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('types')}
          className={`px-4 py-2 rounded-lg cursor-pointer ${tab === 'types' ? 'bg-azure text-white' : 'bg-surface-3 text-text-dim'}`}>
          Storage Types
        </button>
        <button onClick={() => setTab('redundancy')}
          className={`px-4 py-2 rounded-lg cursor-pointer ${tab === 'redundancy' ? 'bg-azure text-white' : 'bg-surface-3 text-text-dim'}`}>
          Redundancy
        </button>
      </div>

      {tab === 'types' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {storageTypes.map(s => {
            const c = colorMap[s.color]
            return (
              <div key={s.name} className={`rounded-lg p-5 border ${c.border} ${c.bg}`}>
                <h3 className={`font-medium ${c.text} mb-1`}>{s.name}</h3>
                <p className="text-text-dim text-sm mb-3">{s.desc}</p>
                <div className="text-xs text-text-dim mb-2">Protocol: <span className="text-white">{s.protocol}</span></div>
                <div className="flex flex-wrap gap-1.5">
                  {s.examples.map(e => (
                    <span key={e} className="text-xs bg-surface/50 px-2 py-0.5 rounded text-text-dim">{e}</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab === 'redundancy' && (
        <div>
          <div className="flex gap-2 mb-4">
            {redundancy.map((r, i) => (
              <button key={r.name} onClick={() => setSelRedundancy(i)}
                className={`px-4 py-2 rounded-lg font-mono cursor-pointer ${
                  selRedundancy === i ? 'bg-azure text-white' : 'bg-surface-3 text-text-dim hover:text-white'
                }`}>{r.name}</button>
            ))}
          </div>

          {(() => {
            const r = redundancy[selRedundancy]
            return (
              <div className="bg-surface-2 rounded-lg p-6">
                <h3 className="text-white text-xl font-medium mb-1">{r.full} Storage ({r.name})</h3>
                <p className="text-text-dim text-sm mb-4">{r.scope}</p>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-surface-3 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-azure">{r.copies}</div>
                    <div className="text-text-dim text-xs">total copies</div>
                  </div>
                  <div className="bg-surface-3 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-azure">{r.durability}</div>
                    <div className="text-text-dim text-xs">durability</div>
                  </div>
                  <div className="bg-surface-3 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-amber-400">{r.cost}</div>
                    <div className="text-text-dim text-xs">relative cost</div>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <span className="text-text-dim text-sm">Data copies:</span>
                  {Array.from({ length: r.copies }).map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded bg-azure/20 border border-azure/30 flex items-center justify-center text-azure text-xs font-bold">
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
