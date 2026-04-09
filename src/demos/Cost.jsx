import { useState } from 'react'

const resources = [
  { name: 'VMs', unit: '/mo', base: 70, min: 0, max: 20, icon: 'VM' },
  { name: 'Storage (TB)', unit: '/mo', base: 20, min: 0, max: 50, icon: 'TB' },
  { name: 'SQL Databases', unit: '/mo', base: 150, min: 0, max: 10, icon: 'DB' },
  { name: 'App Services', unit: '/mo', base: 55, min: 0, max: 10, icon: 'APP' },
  { name: 'Bandwidth (TB)', unit: '/mo', base: 87, min: 0, max: 20, icon: 'BW' },
]

const pricingModels = [
  { id: 'payg', label: 'Pay-As-You-Go', mult: 1, desc: 'No commitment, highest per-unit cost', color: 'text-danger', capex: false },
  { id: '1yr', label: '1-Year Reserved', mult: 0.63, desc: 'Commit 1 year, save ~37%', color: 'text-amber-400', capex: false },
  { id: '3yr', label: '3-Year Reserved', mult: 0.4, desc: 'Commit 3 years, save ~60%', color: 'text-emerald-400', capex: false },
  { id: 'spot', label: 'Spot VMs', mult: 0.15, desc: 'Up to 90% off, but Azure can evict anytime', color: 'text-purple-400', capex: false },
]

const costFactors = [
  { factor: 'VM Size (CPU/RAM)', affects: true, desc: 'More cores = more money' },
  { factor: 'Region', affects: true, desc: 'East US often cheaper than West Europe' },
  { factor: 'Operating System', affects: true, desc: 'Windows license adds cost over Linux' },
  { factor: 'Disk type (SSD/HDD)', affects: true, desc: 'Premium SSD >> Standard HDD' },
  { factor: 'Resource group name', affects: false, desc: 'Just a label, zero cost impact' },
  { factor: 'Tag values', affects: false, desc: 'Tags organize, they don\'t cost anything' },
  { factor: 'Ingress bandwidth', affects: false, desc: 'Data INTO Azure is free' },
  { factor: 'Egress bandwidth', affects: true, desc: 'Data OUT of Azure costs money' },
]

export function CostDemo() {
  const [counts, setCounts] = useState(resources.map(() => 1))
  const [planIdx, setPlanIdx] = useState(0)

  const plan = pricingModels[planIdx]
  const total = resources.reduce((sum, r, i) => sum + r.base * counts[i] * plan.mult, 0)
  const paygTotal = resources.reduce((sum, r, i) => sum + r.base * counts[i], 0)
  const savings = paygTotal - total

  return (
    <div>
      <p className="text-text-dim mb-4 text-sm">Slide resources up. Watch the bill. Switch pricing models.</p>

      {/* CapEx vs OpEx visual */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <h4 className="text-amber-400 font-medium mb-2">CapEx (Traditional)</h4>
          <div className="space-y-1 text-sm text-text-dim">
            <div className="flex justify-between"><span>Buy servers</span><span className="text-amber-400">$$$$$</span></div>
            <div className="flex justify-between"><span>Year 1 ops</span><span className="text-amber-400">$$</span></div>
            <div className="flex justify-between"><span>Year 2 ops</span><span className="text-amber-400">$$</span></div>
            <div className="flex justify-between"><span>Year 3 ops</span><span className="text-amber-400">$$</span></div>
          </div>
          <div className="mt-2 text-xs text-amber-400">Big upfront, depreciates, yours to maintain</div>
        </div>
        <div className="bg-azure/10 border border-azure/30 rounded-lg p-4">
          <h4 className="text-azure font-medium mb-2">OpEx (Cloud)</h4>
          <div className="space-y-1 text-sm text-text-dim">
            <div className="flex justify-between"><span>Month 1</span><span className="text-azure">$$</span></div>
            <div className="flex justify-between"><span>Month 2</span><span className="text-azure">$$$</span></div>
            <div className="flex justify-between"><span>Month 3</span><span className="text-azure">$</span></div>
            <div className="flex justify-between"><span>Month 4</span><span className="text-azure">$$</span></div>
          </div>
          <div className="mt-2 text-xs text-azure">Pay as you go, scales with demand, no hardware</div>
        </div>
      </div>

      {/* Pricing model selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {pricingModels.map((p, i) => (
          <button key={p.id} onClick={() => setPlanIdx(i)}
            className={`px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
              planIdx === i ? 'bg-azure text-white' : 'bg-surface-3 text-text-dim hover:text-white'
            }`}>{p.label}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders */}
        <div className="lg:col-span-2 space-y-3">
          {resources.map((r, i) => (
            <div key={r.name} className="bg-surface-2 rounded-lg px-5 py-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-azure/20 text-azure px-2 py-0.5 rounded">{r.icon}</span>
                  <span className="text-white text-sm">{r.name}</span>
                </div>
                <span className="text-azure font-mono text-sm">${(r.base * counts[i] * plan.mult).toFixed(0)}{r.unit}</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="range" min={r.min} max={r.max} value={counts[i]}
                  onChange={e => setCounts(c => { const n = [...c]; n[i] = +e.target.value; return n })}
                  className="flex-1 accent-[#0078d4]" />
                <span className="text-text-dim text-sm w-8 text-right">{counts[i]}</span>
              </div>
            </div>
          ))}

          {/* Pricing comparison bars */}
          <div className="bg-surface-2 rounded-lg p-5">
            <h4 className="text-white font-medium text-sm mb-3">Same resources, different pricing</h4>
            {pricingModels.map((p, i) => {
              const thisTotal = resources.reduce((sum, r, j) => sum + r.base * counts[j] * p.mult, 0)
              const maxTotal = resources.reduce((sum, r, j) => sum + r.base * counts[j], 0) || 1
              return (
                <div key={p.id} className="flex items-center gap-3 mb-2">
                  <span className={`text-xs w-20 ${planIdx === i ? 'text-white font-medium' : 'text-text-dim'}`}>{p.label}</span>
                  <div className="flex-1 h-5 bg-surface-3 rounded overflow-hidden">
                    <div className={`h-full rounded transition-all ${planIdx === i ? 'bg-azure/50' : 'bg-azure/20'}`}
                      style={{ width: `${(thisTotal / maxTotal) * 100}%` }} />
                  </div>
                  <span className={`font-mono text-xs w-16 text-right ${p.color}`}>${thisTotal.toFixed(0)}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bill summary + cost factors */}
        <div className="space-y-4">
          <div className="bg-azure/10 border border-azure/30 rounded-lg p-5 text-center">
            <div className="text-text-dim text-sm mb-1">Monthly Estimate</div>
            <div className="text-3xl font-bold text-azure">${total.toFixed(0)}</div>
            <div className={`text-xs mt-1 ${plan.color}`}>{plan.desc}</div>
            {savings > 0 && (
              <div className="text-emerald-400 text-sm mt-2">Saving ${savings.toFixed(0)}/mo vs PayG</div>
            )}
          </div>

          <div className="bg-surface-2 rounded-lg p-4">
            <h4 className="text-white text-sm font-medium mb-2">What affects pricing?</h4>
            <div className="space-y-1">
              {costFactors.map(f => (
                <div key={f.factor} className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded ${
                  f.affects ? 'bg-azure/10 text-text-dim' : 'bg-surface-3 text-text-dim/50'
                }`}>
                  <span className={`w-4 text-center font-bold ${f.affects ? 'text-azure' : 'text-danger'}`}>
                    {f.affects ? '+' : '-'}
                  </span>
                  <div>
                    <span className="text-white">{f.factor}</span>
                    <span className="text-text-dim/50 ml-1">— {f.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-2 rounded-lg p-4 text-sm space-y-1">
            <div className="text-white font-medium mb-1">Cost Tools</div>
            <div className="text-text-dim">TCO Calculator — on-prem vs cloud</div>
            <div className="text-text-dim">Pricing Calculator — estimate Azure costs</div>
            <div className="text-text-dim">Cost Management — monitor + budgets</div>
            <div className="text-text-dim">Advisor — recommendations to save</div>
          </div>
        </div>
      </div>
    </div>
  )
}
