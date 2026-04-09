import { useState } from 'react'

const regions = [
  { name: 'East US', x: 28, y: 38, pair: 'West US', azCount: 3, sovereign: false },
  { name: 'West US', x: 14, y: 36, pair: 'East US', azCount: 3, sovereign: false },
  { name: 'West Europe', x: 47, y: 28, pair: 'North Europe', azCount: 3, sovereign: false },
  { name: 'North Europe', x: 46, y: 22, pair: 'West Europe', azCount: 3, sovereign: false },
  { name: 'Southeast Asia', x: 75, y: 52, pair: 'East Asia', azCount: 3, sovereign: false },
  { name: 'East Asia', x: 78, y: 38, pair: 'Southeast Asia', azCount: 3, sovereign: false },
  { name: 'Brazil South', x: 33, y: 68, pair: 'South Central US', azCount: 3, sovereign: false },
  { name: 'Australia East', x: 85, y: 66, pair: 'Australia Southeast', azCount: 3, sovereign: false },
  { name: 'US Gov Virginia', x: 26, y: 36, pair: 'US Gov Texas', azCount: 3, sovereign: true },
  { name: 'China East', x: 79, y: 35, pair: 'China North', azCount: 3, sovereign: true },
]

export function RegionsDemo() {
  const [selected, setSelected] = useState(null)
  const sel = regions.find(r => r.name === selected)
  const pair = sel ? regions.find(r => r.name === sel.pair) : null

  return (
    <div>
      <p className="text-text-dim mb-4 text-sm">Click a region. <span className="text-azure">AZs</span> = separate datacenters. <span className="text-purple-400">Pairs</span> = DR failover.</p>

      <div className="bg-surface-2 rounded-lg p-5 relative" style={{ aspectRatio: '2/1' }}>
        <div className="absolute inset-0 opacity-10 rounded-lg"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, #0078d4 0%, transparent 70%)' }} />
        {regions.map(r => (
          <button key={r.name} onClick={() => setSelected(r.name)}
            className="absolute cursor-pointer group"
            style={{ left: `${r.x}%`, top: `${r.y}%`, transform: 'translate(-50%, -50%)' }}>
            <div className={`w-4 h-4 rounded-full transition-all ${
              r.sovereign ? 'bg-red-500' :
              r.name === selected ? 'bg-azure ring-4 ring-azure/30 scale-125' :
              r.name === sel?.pair ? 'bg-purple-400 ring-4 ring-purple-400/30 scale-125' :
              'bg-azure/60 hover:bg-azure hover:scale-110'
            }`} />
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-text-dim whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {r.name}
            </span>
          </button>
        ))}

        {sel && pair && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1={`${sel.x}%`} y1={`${sel.y}%`} x2={`${pair.x}%`} y2={`${pair.y}%`}
              stroke="#8b5cf6" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />
          </svg>
        )}
      </div>

      {sel && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-surface-2 rounded-lg p-4">
            <div className="text-xs text-text-dim mb-1">Region</div>
            <div className="text-white font-medium">{sel.name}</div>
            {sel.sovereign && <span className="text-xs text-red-400 mt-1 block">Sovereign Region</span>}
          </div>
          <div className="bg-surface-2 rounded-lg p-4">
            <div className="text-xs text-text-dim mb-1">Availability Zones</div>
            <div className="flex gap-2 mt-1">
              {Array.from({ length: sel.azCount }).map((_, i) => (
                <div key={i} className="w-8 h-8 rounded bg-azure/20 border border-azure/30 flex items-center justify-center text-azure text-xs font-bold">
                  AZ{i + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-surface-2 rounded-lg p-4">
            <div className="text-xs text-text-dim mb-1">Region Pair</div>
            <div className="text-purple-400 font-medium">{sel.pair}</div>
            <div className="text-xs text-text-dim mt-1">Auto-failover for DR</div>
          </div>
        </div>
      )}

      {!sel && (
        <p className="text-text-dim text-center mt-4 text-sm">Click a region dot to explore it</p>
      )}
    </div>
  )
}
