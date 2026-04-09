import { useState } from 'react'

const slaTable = [
  { sla: '99%', nines: 2, downMin: 5256, downLabel: '3 days 15h 39m', bar: 100 },
  { sla: '99.9%', nines: 3, downMin: 525.6, downLabel: '8h 45m 36s', bar: 10 },
  { sla: '99.95%', nines: 3.3, downMin: 262.8, downLabel: '4h 22m 48s', bar: 5 },
  { sla: '99.99%', nines: 4, downMin: 52.56, downLabel: '52m 34s', bar: 1 },
  { sla: '99.999%', nines: 5, downMin: 5.256, downLabel: '5m 15s', bar: 0.1 },
]

const services = [
  { name: 'Single VM', sla: 99.9, color: 'amber' },
  { name: 'VM (Avail. Set)', sla: 99.95, color: 'blue' },
  { name: 'VM (Avail. Zones)', sla: 99.99, color: 'emerald' },
  { name: 'App Service', sla: 99.95, color: 'purple' },
  { name: 'Azure SQL DB', sla: 99.99, color: 'cyan' },
  { name: 'Storage (LRS)', sla: 99.9, color: 'amber' },
  { name: 'Storage (GRS-RA)', sla: 99.99, color: 'emerald' },
  { name: 'Load Balancer', sla: 99.99, color: 'blue' },
  { name: 'Azure Functions', sla: 99.95, color: 'purple' },
  { name: 'Free Tier', sla: 0, color: 'gray' },
]

const colorMap = {
  amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  gray: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export function SLADemo() {
  const [selected, setSelected] = useState([0, 4])

  const toggle = (i) => {
    setSelected(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i])
  }

  const selectedServices = selected.filter(i => services[i].sla > 0)
  const composite = selectedServices.length > 0
    ? selectedServices.reduce((acc, i) => acc * (services[i].sla / 100), 1) * 100
    : 0

  const compositeDownMin = composite > 0 ? ((1 - composite / 100) * 365.25 * 24 * 60) : 0

  const formatDown = (min) => {
    if (min >= 60 * 24) return `${(min / (60 * 24)).toFixed(1)} days`
    if (min >= 60) return `${(min / 60).toFixed(1)} hours`
    return `${min.toFixed(1)} min`
  }

  // Redundancy calc: two parallel services
  const redundantSLA = selectedServices.length === 1
    ? (1 - Math.pow(1 - services[selectedServices[0]].sla / 100, 2)) * 100
    : null

  return (
    <div>
      <p className="text-text-dim mb-4 text-sm">Pick services. Multiply SLAs. <span className="text-amber-400">Composite is always lower.</span></p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual downtime bar chart */}
        <div className="lg:col-span-2 bg-surface-2 rounded-lg p-5">
          <h3 className="text-white font-medium mb-3">What the nines actually mean</h3>
          <div className="space-y-2">
            {slaTable.map(s => (
              <div key={s.sla} className="flex items-center gap-3">
                <span className="text-azure font-mono w-16 text-sm text-right">{s.sla}</span>
                <div className="flex-1 h-6 bg-surface-3 rounded overflow-hidden relative">
                  <div className="h-full bg-danger/40 rounded transition-all"
                    style={{ width: `${Math.min(s.bar, 100)}%`, minWidth: s.bar > 0 ? '2px' : '0' }} />
                  <span className="absolute inset-0 flex items-center px-2 text-xs text-text-dim">
                    {s.downLabel} downtime/year
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-text-dim text-xs mt-2">Red = allowed downtime. Each nine cuts it by 10x.</p>
        </div>

        {/* Service selector */}
        <div>
          <h3 className="text-white font-medium mb-3">Chain services (click to add)</h3>
          <div className="space-y-1.5">
            {services.map((s, i) => (
              <button key={s.name} onClick={() => toggle(i)}
                className={`w-full text-left flex justify-between items-center px-4 py-2.5 rounded-lg cursor-pointer border transition-colors ${
                  selected.includes(i) ? `${colorMap[s.color]} border` : 'border-border bg-surface-2 hover:bg-surface-3'
                }`}>
                <span className="text-white text-sm">{s.name}</span>
                <span className={`font-mono text-sm ${s.sla === 0 ? 'text-danger' : 'text-azure'}`}>
                  {s.sla === 0 ? 'No SLA' : `${s.sla}%`}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Calculator & visual */}
        <div className="space-y-4">
          {/* Composite calculation */}
          <div className="bg-surface-2 rounded-lg p-5">
            <h3 className="text-white font-medium mb-3">Composite SLA</h3>
            {selectedServices.length > 0 ? (
              <div>
                <div className="space-y-1 text-sm font-mono mb-4">
                  {selectedServices.map((i, idx) => (
                    <div key={i} className="text-text-dim">
                      {idx > 0 && <span className="text-amber-400"> x </span>}
                      {services[i].sla}% <span className="text-text-dim/50">({services[i].name})</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2 mt-2">
                    <span className="text-amber-400 font-bold">= {composite.toFixed(4)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-surface-3 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-amber-400">{composite.toFixed(3)}%</div>
                    <div className="text-text-dim text-xs">Composite SLA</div>
                  </div>
                  <div className="bg-surface-3 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-danger">{formatDown(compositeDownMin)}</div>
                    <div className="text-text-dim text-xs">Max downtime/year</div>
                  </div>
                </div>

                {/* Visual: downtime bar for composite vs individual */}
                <div className="space-y-1.5">
                  {selectedServices.map(i => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-text-dim text-xs w-20 truncate">{services[i].name}</span>
                      <div className="flex-1 h-3 bg-surface-3 rounded overflow-hidden">
                        <div className="h-full bg-azure/40 rounded" style={{ width: `${services[i].sla}%` }} />
                      </div>
                      <span className="text-azure text-xs font-mono w-14 text-right">{services[i].sla}%</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 border-t border-border pt-1.5">
                    <span className="text-amber-400 text-xs w-20 font-medium">Composite</span>
                    <div className="flex-1 h-3 bg-surface-3 rounded overflow-hidden">
                      <div className="h-full bg-amber-400/40 rounded" style={{ width: `${composite}%` }} />
                    </div>
                    <span className="text-amber-400 text-xs font-mono w-14 text-right">{composite.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-text-dim text-sm">Select services above</p>
            )}
          </div>

          {/* Redundancy visual */}
          {redundantSLA && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <h4 className="text-emerald-400 font-medium text-sm mb-2">Add redundancy?</h4>
              <p className="text-text-dim text-sm mb-2">
                Two {services[selectedServices[0]].name}s in parallel:
              </p>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="text-amber-400 font-mono text-sm">{services[selectedServices[0]].sla}%</div>
                  <div className="text-text-dim text-xs">Single</div>
                </div>
                <span className="text-text-dim">&rarr;</span>
                <div className="text-center">
                  <div className="text-emerald-400 font-mono text-sm font-bold">{redundantSLA.toFixed(4)}%</div>
                  <div className="text-text-dim text-xs">Redundant</div>
                </div>
              </div>
              <p className="text-text-dim text-xs mt-2">Both must fail simultaneously. Probability drops dramatically.</p>
            </div>
          )}

          {/* Key rules */}
          <div className="bg-surface-2 rounded-lg p-4 text-sm space-y-1.5">
            <div className="text-text-dim">Chain (A then B) = <span className="text-amber-400">multiply (lower)</span></div>
            <div className="text-text-dim">Parallel (A or B) = <span className="text-emerald-400">1 - (failures multiply) (higher)</span></div>
            <div className="text-text-dim">Free tier = <span className="text-danger">0% SLA (no guarantee)</span></div>
            <div className="text-text-dim">SLA breach = <span className="text-azure">you file claim for credits</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
