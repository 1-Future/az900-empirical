import { useState } from 'react'

const defaultRules = [
  { id: 1, name: 'Allow-HTTP', direction: 'Inbound', port: '80', protocol: 'TCP', source: 'Any', action: 'Allow', priority: 100 },
  { id: 2, name: 'Allow-HTTPS', direction: 'Inbound', port: '443', protocol: 'TCP', source: 'Any', action: 'Allow', priority: 110 },
  { id: 3, name: 'Deny-All-Inbound', direction: 'Inbound', port: '*', protocol: '*', source: 'Any', action: 'Deny', priority: 4096 },
]

const testPackets = [
  { label: 'HTTPS Request (443)', port: '443', protocol: 'TCP', direction: 'Inbound' },
  { label: 'HTTP Request (80)', port: '80', protocol: 'TCP', direction: 'Inbound' },
  { label: 'SSH Attempt (22)', port: '22', protocol: 'TCP', direction: 'Inbound' },
  { label: 'RDP Attempt (3389)', port: '3389', protocol: 'TCP', direction: 'Inbound' },
  { label: 'DNS Query (53)', port: '53', protocol: 'UDP', direction: 'Inbound' },
]

function evaluatePacket(packet, rules) {
  const sorted = [...rules].sort((a, b) => a.priority - b.priority)
  for (const rule of sorted) {
    if (rule.direction !== packet.direction) continue
    if (rule.port !== '*' && rule.port !== packet.port) continue
    if (rule.protocol !== '*' && rule.protocol !== packet.protocol) continue
    return { rule, allowed: rule.action === 'Allow' }
  }
  return { rule: null, allowed: false }
}

export function NetworkingDemo() {
  const [rules] = useState(defaultRules)
  const [testResult, setTestResult] = useState(null)

  return (
    <div>
      <p className="text-text-dim mb-6">
        <span className="text-azure">Network Security Groups (NSGs)</span> filter traffic with priority-based rules.
        Lower priority number = evaluated first. First matching rule wins. Test packets below.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-white font-medium mb-3">NSG Rules</h3>
          <div className="bg-surface-2 rounded-lg overflow-hidden">
            <div className="grid grid-cols-5 gap-2 px-4 py-2 bg-surface-3 text-xs text-text-dim font-mono">
              <span>Priority</span><span>Name</span><span>Port</span><span>Protocol</span><span>Action</span>
            </div>
            {rules.map(r => (
              <div key={r.id}
                className={`grid grid-cols-5 gap-2 px-4 py-2.5 text-sm border-t border-border ${
                  testResult?.rule?.id === r.id ? (testResult.allowed ? 'bg-success/10' : 'bg-danger/10') : ''
                }`}>
                <span className="text-text-dim font-mono">{r.priority}</span>
                <span className="text-white">{r.name}</span>
                <span className="text-text-dim font-mono">{r.port}</span>
                <span className="text-text-dim font-mono">{r.protocol}</span>
                <span className={r.action === 'Allow' ? 'text-success' : 'text-danger'}>{r.action}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-white font-medium mb-3">Test Traffic</h3>
          <div className="space-y-2">
            {testPackets.map(p => {
              const result = evaluatePacket(p, rules)
              return (
                <button key={p.label} onClick={() => setTestResult({ ...result, packet: p })}
                  className="w-full text-left px-4 py-3 bg-surface-2 rounded-lg hover:bg-surface-3 transition-colors cursor-pointer border border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-sm">{p.label}</span>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                      result.allowed ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                    }`}>
                      {result.allowed ? 'ALLOWED' : 'BLOCKED'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {testResult && (
            <div className={`mt-4 p-4 rounded-lg border ${
              testResult.allowed ? 'border-success/30 bg-success/10' : 'border-danger/30 bg-danger/10'
            }`}>
              <div className={`font-medium text-sm ${testResult.allowed ? 'text-success' : 'text-danger'}`}>
                {testResult.packet.label}: {testResult.allowed ? 'ALLOWED' : 'BLOCKED'}
              </div>
              <div className="text-text-dim text-xs mt-1">
                Matched rule: <span className="text-white">{testResult.rule?.name}</span> (priority {testResult.rule?.priority})
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-surface-2 rounded-lg p-4">
        <h4 className="text-white text-sm font-medium mb-2">Network Concepts</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {[
            ['VNet', 'Your private network in Azure. Isolated by default.'],
            ['Subnet', 'Segment within a VNet. NSGs attach here.'],
            ['VPN Gateway', 'Encrypted tunnel over public internet to your on-prem network.'],
            ['ExpressRoute', 'Private dedicated fiber connection. No public internet.'],
          ].map(([title, desc]) => (
            <div key={title} className="bg-surface-3 rounded p-3">
              <div className="text-azure font-medium">{title}</div>
              <div className="text-text-dim text-xs mt-1">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
