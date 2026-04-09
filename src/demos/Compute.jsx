import { useState } from 'react'

const services = [
  {
    name: 'Virtual Machines',
    acronym: 'VM',
    icon: '[ VM ]',
    color: 'blue',
    control: 'Full',
    scaling: 'Manual / VMSS',
    cost: 'Per-second billing',
    useCase: 'Lift-and-shift, custom OS needs, legacy apps',
    desc: 'Full virtual computer. You pick OS, size, region. Most flexible, most responsibility.',
    idle: true,
  },
  {
    name: 'App Service',
    acronym: 'PaaS',
    icon: '[ APP ]',
    color: 'purple',
    control: 'Code only',
    scaling: 'Auto-scale built in',
    cost: 'Per App Service Plan',
    useCase: 'Web apps, REST APIs, mobile backends',
    desc: 'Managed hosting — deploy code, Azure handles the rest. Supports .NET, Node, Python, Java, PHP.',
    idle: true,
  },
  {
    name: 'Azure Functions',
    acronym: 'Serverless',
    icon: '[ f(x) ]',
    color: 'amber',
    control: 'Function only',
    scaling: 'Auto (event-driven)',
    cost: 'Per execution + compute time',
    useCase: 'Event processing, webhooks, scheduled tasks, microservices',
    desc: 'Run code without thinking about servers. Triggers: HTTP, timer, queue, blob, etc. Zero cost when idle.',
    idle: false,
  },
  {
    name: 'Container Instances',
    acronym: 'ACI',
    icon: '[ ACI ]',
    color: 'emerald',
    control: 'Container',
    scaling: 'Manual',
    cost: 'Per-second',
    useCase: 'Quick container runs, batch jobs, testing',
    desc: 'Run a container without managing VMs. Fastest way to run a container in Azure. No orchestration.',
    idle: true,
  },
  {
    name: 'Kubernetes Service',
    acronym: 'AKS',
    icon: '[ AKS ]',
    color: 'cyan',
    control: 'Cluster',
    scaling: 'Auto (HPA)',
    cost: 'Per node VM',
    useCase: 'Microservices at scale, complex container orchestration',
    desc: 'Managed Kubernetes. Azure handles the control plane, you manage worker nodes. For serious container workloads.',
    idle: true,
  },
]

const colorMap = {
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400' },
  purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400' },
  amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400' },
  emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400' },
  cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-400' },
}

export function ComputeDemo() {
  const [selected, setSelected] = useState(0)
  const s = services[selected]
  const c = colorMap[s.color]

  return (
    <div>
      <p className="text-text-dim mb-4 text-sm">More control = more responsibility. Click to compare.</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {services.map((svc, i) => (
          <button key={svc.name} onClick={() => setSelected(i)}
            className={`px-4 py-2 rounded-lg font-mono text-sm cursor-pointer transition-colors ${
              selected === i ? `${colorMap[svc.color].bg} ${colorMap[svc.color].text} border ${colorMap[svc.color].border}` : 'bg-surface-3 text-text-dim hover:text-white'
            }`}>{svc.name}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-lg p-6 border ${c.border} ${c.bg}`}>
          <div className="font-mono text-3xl mb-3 ${c.text}">{s.icon}</div>
          <h3 className={`text-xl font-medium ${c.text} mb-2`}>{s.name}</h3>
          <p className="text-text-dim text-sm mb-4">{s.desc}</p>
          <div className="bg-surface/50 rounded p-3 text-sm">
            <div className="text-text-dim italic">Best for: {s.useCase}</div>
          </div>
        </div>

        <div className="space-y-3">
          {[
            ['Control Level', s.control],
            ['Scaling', s.scaling],
            ['Cost Model', s.cost],
            ['Idle Cost', s.idle ? 'Yes - pays when stopped*' : 'No idle cost'],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between items-center bg-surface-2 rounded px-4 py-3">
              <span className="text-text-dim text-sm">{label}</span>
              <span className="text-white text-sm font-medium">{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-surface-2 rounded-lg p-4">
        <h4 className="text-white text-sm font-medium mb-2">Abstraction Spectrum</h4>
        <div className="flex items-center gap-1">
          {services.map((svc, i) => (
            <div key={svc.name}
              className={`flex-1 h-8 rounded flex items-center justify-center text-xs font-mono cursor-pointer transition-all ${
                selected === i ? `${colorMap[svc.color].bg} ${colorMap[svc.color].text} border ${colorMap[svc.color].border}` : 'bg-surface-3 text-text-dim'
              }`}
              onClick={() => setSelected(i)}>
              {svc.acronym}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-text-dim mt-1 px-1">
          <span>&larr; More control</span>
          <span>More managed &rarr;</span>
        </div>
      </div>
    </div>
  )
}
