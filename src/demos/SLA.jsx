import { useState } from 'react'

const slaOptions = [
  { value: 99, label: '99%', downtime: '3 days 15h 39m' },
  { value: 99.9, label: '99.9%', downtime: '8h 45m 56s' },
  { value: 99.95, label: '99.95%', downtime: '4h 22m 58s' },
  { value: 99.99, label: '99.99%', downtime: '52m 35s' },
  { value: 99.999, label: '99.999%', downtime: '5m 15s' },
]

const services = [
  { name: 'Azure VMs (single)', sla: 99.9 },
  { name: 'Azure VMs (Avail. Set)', sla: 99.95 },
  { name: 'Azure VMs (Avail. Zones)', sla: 99.99 },
  { name: 'Azure App Service', sla: 99.95 },
  { name: 'Azure SQL Database', sla: 99.99 },
  { name: 'Azure Storage (LRS)', sla: 99.9 },
  { name: 'Azure Storage (GRS-RA)', sla: 99.99 },
  { name: 'Azure Load Balancer', sla: 99.99 },
]

export function SLADemo() {
  const [selected, setSelected] = useState([0, 4])

  const toggle = (i) => {
    setSelected(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i])
  }

  const composite = selected.length > 0
    ? selected.reduce((acc, i) => acc * (services[i].sla / 100), 1) * 100
    : 0

  const compositeDowntime = composite > 0
    ? ((1 - composite / 100) * 365.25 * 24 * 60)
    : 0

  const formatDowntime = (minutes) => {
    if (minutes >= 60 * 24) return `${(minutes / (60 * 24)).toFixed(1)} days`
    if (minutes >= 60) return `${(minutes / 60).toFixed(1)} hours`
    return `${minutes.toFixed(1)} minutes`
  }

  return (
    <div>
      <p className="text-text-dim mb-6">
        <span className="text-azure">SLAs</span> guarantee uptime. When you combine services,
        multiply their SLAs to get the <span className="text-amber-400">composite SLA</span> (always lower).
        Select services below.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-white font-medium mb-3">Select Services</h3>
          <div className="space-y-2">
            {services.map((s, i) => (
              <button key={s.name} onClick={() => toggle(i)}
                className={`w-full text-left flex justify-between items-center px-4 py-3 rounded-lg cursor-pointer border transition-colors ${
                  selected.includes(i) ? 'border-azure bg-azure/10' : 'border-border bg-surface-2 hover:bg-surface-3'
                }`}>
                <span className="text-white text-sm">{s.name}</span>
                <span className="text-azure font-mono text-sm">{s.sla}%</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-surface-2 rounded-lg p-5">
            <h3 className="text-white font-medium mb-3">Composite SLA Calculator</h3>
            {selected.length > 0 ? (
              <div>
                <div className="space-y-1 text-sm font-mono mb-4">
                  {selected.map((i, idx) => (
                    <div key={i} className="text-text-dim">
                      {idx > 0 && <span className="text-amber-400"> x </span>}
                      {services[i].sla}% <span className="text-text-dim/50">({services[i].name})</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-2 mt-2">
                    <span className="text-amber-400">= {composite.toFixed(4)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface-3 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-amber-400">{composite.toFixed(3)}%</div>
                    <div className="text-text-dim text-xs">Composite SLA</div>
                  </div>
                  <div className="bg-surface-3 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-danger">{formatDowntime(compositeDowntime)}</div>
                    <div className="text-text-dim text-xs">Max downtime/year</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-text-dim text-sm">Select services to calculate composite SLA</p>
            )}
          </div>

          <div className="bg-surface-2 rounded-lg p-4">
            <h4 className="text-white text-sm font-medium mb-2">SLA Reference</h4>
            <div className="space-y-1">
              {slaOptions.map(s => (
                <div key={s.value} className="flex justify-between text-sm px-2 py-1">
                  <span className="text-azure font-mono">{s.label}</span>
                  <span className="text-text-dim">{s.downtime}/year</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-2 rounded-lg p-4 text-sm">
            <h4 className="text-white font-medium mb-1">Key Insight</h4>
            <p className="text-text-dim">
              More services in a chain = lower composite SLA. Adding redundancy (availability zones, failover) increases it back up.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
