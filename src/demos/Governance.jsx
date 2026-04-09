import { useState } from 'react'

const resources = [
  { name: 'vm-prod-01', type: 'VM', region: 'East US', tags: { env: 'production', team: 'backend' }, locked: 'CanNotDelete' },
  { name: 'sql-dev-02', type: 'SQL Database', region: 'West Europe', tags: { env: 'dev' }, locked: null },
  { name: 'storage-prod', type: 'Storage Account', region: 'East US', tags: { env: 'production', team: 'data' }, locked: 'ReadOnly' },
  { name: 'vm-test-03', type: 'VM', region: 'Southeast Asia', tags: {}, locked: null },
]

const policies = [
  { name: 'Allowed Regions', desc: 'Only allow resources in East US and West Europe', check: (r) => ['East US', 'West Europe'].includes(r.region) },
  { name: 'Require "env" Tag', desc: 'All resources must have an "env" tag', check: (r) => !!r.tags.env },
  { name: 'Deny Public IP', desc: 'Block creation of public IPs (audit example)', check: () => true },
]

const lockTypes = {
  CanNotDelete: { label: 'CanNotDelete', desc: 'Can read and modify, but cannot delete', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ReadOnly: { label: 'ReadOnly', desc: 'Can only read. No modifications or deletions.', color: 'text-danger', bg: 'bg-danger/10' },
}

const actions = ['Read', 'Modify', 'Delete']

export function GovernanceDemo() {
  const [tab, setTab] = useState('locks')
  const [selectedResource, setSelectedResource] = useState(0)
  const res = resources[selectedResource]

  return (
    <div>
      <p className="text-text-dim mb-6">
        Azure governance tools enforce rules across your environment:
        <span className="text-azure"> Policies</span> audit/deny non-compliant resources,
        <span className="text-amber-400"> Locks</span> prevent accidental changes,
        <span className="text-purple-400"> Tags</span> organize for cost tracking.
      </p>

      <div className="flex gap-2 mb-6">
        {['locks', 'policy', 'tags'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg capitalize cursor-pointer ${
              tab === t ? 'bg-azure text-white' : 'bg-surface-3 text-text-dim hover:text-white'
            }`}>{t === 'policy' ? 'Azure Policy' : t === 'locks' ? 'Resource Locks' : 'Tags'}</button>
        ))}
      </div>

      {tab === 'locks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-white font-medium mb-3">Resources</h3>
            <div className="space-y-2">
              {resources.map((r, i) => (
                <button key={r.name} onClick={() => setSelectedResource(i)}
                  className={`w-full text-left px-4 py-3 rounded-lg cursor-pointer border ${
                    selectedResource === i ? 'border-azure bg-azure/10' : 'border-border bg-surface-2 hover:bg-surface-3'
                  }`}>
                  <div className="flex justify-between">
                    <span className="text-white text-sm">{r.name}</span>
                    {r.locked && (
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${lockTypes[r.locked].bg} ${lockTypes[r.locked].color}`}>
                        {r.locked}
                      </span>
                    )}
                  </div>
                  <div className="text-text-dim text-xs mt-1">{r.type} - {r.region}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-2 rounded-lg p-5">
            <h3 className="text-white font-medium mb-3">
              Actions on {res.name}
              {res.locked && <span className={`ml-2 text-xs ${lockTypes[res.locked].color}`}>({res.locked} lock)</span>}
            </h3>
            <div className="space-y-2">
              {actions.map(a => {
                let allowed = true
                let reason = ''
                if (res.locked === 'ReadOnly' && a !== 'Read') { allowed = false; reason = 'ReadOnly lock' }
                if (res.locked === 'CanNotDelete' && a === 'Delete') { allowed = false; reason = 'CanNotDelete lock' }
                return (
                  <div key={a} className={`flex justify-between items-center px-4 py-3 rounded border ${
                    allowed ? 'border-success/30 bg-success/10' : 'border-danger/30 bg-danger/10'
                  }`}>
                    <span className="text-white text-sm">{a}</span>
                    <div className="text-right">
                      <span className={`text-sm font-mono ${allowed ? 'text-success' : 'text-danger'}`}>
                        {allowed ? 'ALLOWED' : 'BLOCKED'}
                      </span>
                      {reason && <div className="text-xs text-text-dim">{reason}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
            {!res.locked && <p className="text-text-dim text-xs mt-3">No lock applied. All actions are permitted.</p>}
          </div>
        </div>
      )}

      {tab === 'policy' && (
        <div className="space-y-4">
          {policies.map(p => (
            <div key={p.name} className="bg-surface-2 rounded-lg p-5">
              <h3 className="text-white font-medium mb-1">{p.name}</h3>
              <p className="text-text-dim text-sm mb-3">{p.desc}</p>
              <div className="space-y-1.5">
                {resources.map(r => {
                  const compliant = p.check(r)
                  return (
                    <div key={r.name} className={`flex justify-between items-center px-4 py-2 rounded text-sm ${
                      compliant ? 'bg-success/10 border border-success/20' : 'bg-danger/10 border border-danger/20'
                    }`}>
                      <span className="text-white">{r.name} <span className="text-text-dim">({r.region})</span></span>
                      <span className={compliant ? 'text-success' : 'text-danger'}>
                        {compliant ? 'Compliant' : 'Non-compliant'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'tags' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-white font-medium mb-3">Resource Tags</h3>
            <div className="space-y-3">
              {resources.map(r => (
                <div key={r.name} className="bg-surface-2 rounded-lg p-4">
                  <div className="text-white text-sm font-medium mb-2">{r.name}</div>
                  {Object.keys(r.tags).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(r.tags).map(([k, v]) => (
                        <span key={k} className="text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-1 rounded font-mono">
                          {k}: {v}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-danger">No tags</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-2 rounded-lg p-5">
            <h3 className="text-white font-medium mb-3">Cost by Tag: "env"</h3>
            {['production', 'dev'].map(env => {
              const count = resources.filter(r => r.tags.env === env).length
              const total = resources.filter(r => r.tags.env === env).length
              return (
                <div key={env} className="flex justify-between items-center px-4 py-3 bg-surface-3 rounded mb-2">
                  <span className="text-purple-400 font-mono text-sm">{env}</span>
                  <span className="text-white text-sm">{total} resource{total !== 1 ? 's' : ''}</span>
                </div>
              )
            })}
            <div className="flex justify-between items-center px-4 py-3 bg-danger/10 border border-danger/20 rounded">
              <span className="text-danger font-mono text-sm">untagged</span>
              <span className="text-danger text-sm">{resources.filter(r => !r.tags.env).length} resources</span>
            </div>
            <p className="text-text-dim text-xs mt-3">Tags help you track costs by team, environment, project. Use Azure Policy to enforce required tags.</p>
          </div>
        </div>
      )}
    </div>
  )
}
