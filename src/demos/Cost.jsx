import { useState } from 'react'

const resources = [
  { name: 'VMs', unit: '/month', base: 70, min: 0, max: 20, icon: 'VM' },
  { name: 'Storage (TB)', unit: '/month', base: 20, min: 0, max: 50, icon: 'TB' },
  { name: 'SQL Databases', unit: '/month', base: 150, min: 0, max: 10, icon: 'DB' },
  { name: 'App Services', unit: '/month', base: 55, min: 0, max: 10, icon: 'APP' },
  { name: 'Bandwidth (TB)', unit: '/month', base: 87, min: 0, max: 20, icon: 'BW' },
]

export function CostDemo() {
  const [counts, setCounts] = useState(resources.map(() => 1))
  const [plan, setPlan] = useState('payg')

  const multiplier = plan === 'payg' ? 1 : plan === '1yr' ? 0.63 : 0.4
  const total = resources.reduce((sum, r, i) => sum + r.base * counts[i] * multiplier, 0)

  return (
    <div>
      <p className="text-text-dim mb-6">
        Azure pricing depends on what you use, how much, and your commitment level.
        Slide the resource counts and switch pricing models to see the bill change.
      </p>

      <div className="flex gap-2 mb-6">
        {[
          ['payg', 'Pay-As-You-Go (OpEx)'],
          ['1yr', '1-Year Reserved (-37%)'],
          ['3yr', '3-Year Reserved (-60%)'],
        ].map(([id, label]) => (
          <button key={id} onClick={() => setPlan(id)}
            className={`px-4 py-2 rounded-lg text-sm cursor-pointer ${
              plan === id ? 'bg-azure text-white' : 'bg-surface-3 text-text-dim hover:text-white'
            }`}>{label}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          {resources.map((r, i) => (
            <div key={r.name} className="bg-surface-2 rounded-lg px-5 py-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-azure/20 text-azure px-2 py-0.5 rounded">{r.icon}</span>
                  <span className="text-white text-sm">{r.name}</span>
                </div>
                <span className="text-azure font-mono text-sm">
                  ${(r.base * counts[i] * multiplier).toFixed(0)}{r.unit}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input type="range" min={r.min} max={r.max} value={counts[i]}
                  onChange={e => setCounts(c => { const n = [...c]; n[i] = +e.target.value; return n })}
                  className="flex-1 accent-[#0078d4]" />
                <span className="text-text-dim text-sm w-8 text-right">{counts[i]}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-azure/10 border border-azure/30 rounded-lg p-5 text-center">
            <div className="text-text-dim text-sm mb-1">Estimated Monthly Cost</div>
            <div className="text-3xl font-bold text-azure">${total.toFixed(0)}</div>
            <div className="text-text-dim text-xs mt-1">
              {plan === 'payg' ? 'Pay-As-You-Go' : plan === '1yr' ? '1-Year Reserved' : '3-Year Reserved'}
            </div>
          </div>

          <div className="bg-surface-2 rounded-lg p-4">
            <h4 className="text-white text-sm font-medium mb-2">CapEx vs OpEx</h4>
            <div className="space-y-2 text-sm text-text-dim">
              <div className="flex justify-between px-3 py-2 bg-surface-3 rounded">
                <span>CapEx</span>
                <span className="text-white">Upfront hardware</span>
              </div>
              <div className="flex justify-between px-3 py-2 bg-azure/10 border border-azure/30 rounded">
                <span>OpEx</span>
                <span className="text-azure">Pay for what you use</span>
              </div>
            </div>
            <p className="text-xs text-text-dim mt-2">Cloud = OpEx. Reserved instances blend both (commit upfront for savings).</p>
          </div>

          <div className="bg-surface-2 rounded-lg p-4">
            <h4 className="text-white text-sm font-medium mb-2">Cost Tools</h4>
            <div className="space-y-1 text-sm text-text-dim">
              <div>TCO Calculator - Compare on-prem vs cloud</div>
              <div>Pricing Calculator - Estimate Azure costs</div>
              <div>Cost Management - Monitor and set budgets</div>
              <div>Advisor - Recommendations to reduce spend</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
