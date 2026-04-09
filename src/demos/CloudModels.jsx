import { useState } from 'react'

const layers = ['Networking', 'Storage', 'Servers', 'Virtualization', 'OS', 'Middleware', 'Runtime', 'Data', 'Application']

const models = {
  'On-Premises': { you: layers.slice(), azure: [] },
  IaaS: { you: layers.slice(4), azure: layers.slice(0, 4) },
  PaaS: { you: layers.slice(7), azure: layers.slice(0, 7) },
  SaaS: { you: [], azure: layers.slice() },
}

const examples = {
  'On-Premises': ['Your own server rack', 'Company datacenter'],
  IaaS: ['Azure VMs', 'Azure Virtual Network', 'Azure Disk Storage'],
  PaaS: ['Azure App Service', 'Azure SQL Database', 'Azure Functions'],
  SaaS: ['Microsoft 365', 'Outlook.com', 'OneDrive'],
}

export function CloudModelsDemo() {
  const [selected, setSelected] = useState('IaaS')

  return (
    <div>
      <p className="text-text-dim mb-6">
        Cloud models define how much of the stack <span className="text-azure">Azure manages</span> vs
        how much <span className="text-amber-400">you manage</span>. Click each model to compare.
      </p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.keys(models).map(m => (
          <button key={m} onClick={() => setSelected(m)}
            className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
              selected === m ? 'bg-azure text-white' : 'bg-surface-3 text-text-dim hover:text-white'
            }`}>{m}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-2 rounded-lg p-5">
          <h3 className="text-white font-medium mb-3">Responsibility Stack</h3>
          <div className="space-y-1.5">
            {[...layers].reverse().map(layer => {
              const isAzure = models[selected].azure.includes(layer)
              return (
                <div key={layer}
                  className={`px-4 py-2.5 rounded text-sm font-medium transition-all duration-300 ${
                    isAzure
                      ? 'bg-azure/20 text-azure border border-azure/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                  <span className="flex justify-between">
                    <span>{layer}</span>
                    <span className="text-xs opacity-70">{isAzure ? 'Azure' : 'You'}</span>
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <div className="bg-surface-2 rounded-lg p-5 mb-4">
            <h3 className="text-white font-medium mb-2">{selected} Examples</h3>
            <ul className="space-y-1">
              {examples[selected].map(e => (
                <li key={e} className="text-text-dim text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-azure shrink-0" />{e}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-2 rounded-lg p-5">
            <h3 className="text-white font-medium mb-2">Key Insight</h3>
            {selected === 'On-Premises' && <p className="text-text-dim text-sm">You own and manage everything. Maximum control, maximum responsibility. All CapEx.</p>}
            {selected === 'IaaS' && <p className="text-text-dim text-sm">Azure handles the physical infrastructure. You still manage the OS up. Most flexible cloud model — like renting a server.</p>}
            {selected === 'PaaS' && <p className="text-text-dim text-sm">Azure handles everything except your data and application code. You just deploy code. Best for developers who don't want to manage infrastructure.</p>}
            {selected === 'SaaS' && <p className="text-text-dim text-sm">Azure handles everything. You just use the application. Least flexible but zero management. Pay-per-user typically.</p>}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <div className="text-2xl font-bold text-amber-400">{models[selected].you.length}</div>
              <div className="text-text-dim">layers you manage</div>
            </div>
            <div className="bg-azure/10 border border-azure/30 rounded-lg p-3">
              <div className="text-2xl font-bold text-azure">{models[selected].azure.length}</div>
              <div className="text-text-dim">layers Azure manages</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
