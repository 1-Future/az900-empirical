import { useState } from 'react'

const tree = {
  name: 'Root Management Group',
  type: 'mg',
  children: [
    {
      name: 'IT Department',
      type: 'mg',
      children: [
        {
          name: 'Production Sub',
          type: 'sub',
          children: [
            { name: 'web-app-rg', type: 'rg', children: [
              { name: 'app-service-01', type: 'resource' },
              { name: 'sql-db-prod', type: 'resource' },
            ]},
            { name: 'networking-rg', type: 'rg', children: [
              { name: 'vnet-prod', type: 'resource' },
              { name: 'nsg-frontend', type: 'resource' },
            ]},
          ],
        },
        {
          name: 'Dev/Test Sub',
          type: 'sub',
          children: [
            { name: 'dev-rg', type: 'rg', children: [
              { name: 'vm-dev-01', type: 'resource' },
            ]},
          ],
        },
      ],
    },
    {
      name: 'Marketing',
      type: 'mg',
      children: [
        {
          name: 'Marketing Sub',
          type: 'sub',
          children: [
            { name: 'website-rg', type: 'rg', children: [
              { name: 'static-site-01', type: 'resource' },
            ]},
          ],
        },
      ],
    },
  ],
}

const typeStyles = {
  mg: { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400', label: 'Management Group' },
  sub: { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400', label: 'Subscription' },
  rg: { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400', label: 'Resource Group' },
  resource: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400', label: 'Resource' },
}

function TreeNode({ node, depth = 0, selected, setSelected }) {
  const s = typeStyles[node.type]
  const isSelected = selected?.name === node.name
  return (
    <div style={{ marginLeft: depth * 24 }}>
      <button onClick={() => setSelected(node)}
        className={`flex items-center gap-2 px-3 py-2 rounded border ${s.border} ${s.bg} mb-1.5 cursor-pointer transition-all w-full text-left ${
          isSelected ? 'ring-2 ring-white/20 scale-[1.02]' : 'hover:scale-[1.01]'
        }`}>
        <span className={`text-xs font-mono ${s.text}`}>{node.type.toUpperCase()}</span>
        <span className="text-white text-sm">{node.name}</span>
      </button>
      {node.children?.map(c => (
        <TreeNode key={c.name} node={c} depth={depth + 1} selected={selected} setSelected={setSelected} />
      ))}
    </div>
  )
}

export function ResourceHierarchyDemo() {
  const [selected, setSelected] = useState(null)

  return (
    <div>
      <p className="text-text-dim mb-4 text-sm"><span className="text-purple-400">MG</span> &rarr; <span className="text-blue-400">Sub</span> &rarr; <span className="text-amber-400">RG</span> &rarr; <span className="text-emerald-400">Resource</span>. Policies flow down. Click any node.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-surface-2 rounded-lg p-5">
          <TreeNode node={tree} selected={selected} setSelected={setSelected} />
        </div>

        <div className="space-y-4">
          {selected ? (
            <div className={`rounded-lg p-5 border ${typeStyles[selected.type].border} ${typeStyles[selected.type].bg}`}>
              <div className={`text-xs font-mono ${typeStyles[selected.type].text} mb-1`}>{typeStyles[selected.type].label}</div>
              <div className="text-white font-medium mb-3">{selected.name}</div>
              <div className="text-text-dim text-sm space-y-1">
                {selected.type === 'mg' && <p>Contains subscriptions or other management groups. Policies applied here inherit downward.</p>}
                {selected.type === 'sub' && <p>Billing boundary. Each subscription gets its own invoice. Contains resource groups.</p>}
                {selected.type === 'rg' && <p>Logical container for resources. A resource can only be in ONE resource group. Deleting a RG deletes all its resources.</p>}
                {selected.type === 'resource' && <p>An actual Azure service instance (VM, database, storage account, etc.)</p>}
              </div>
              {selected.children && (
                <div className="mt-3 text-xs text-text-dim">
                  Contains {selected.children.length} {selected.children[0].type === 'resource' ? 'resources' : 'items'}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-surface-2 rounded-lg p-5 text-text-dim text-sm">
              Click any node in the tree to see details about that level of the hierarchy.
            </div>
          )}

          <div className="bg-surface-2 rounded-lg p-4 text-sm">
            <h4 className="text-white font-medium mb-2">Key Rules</h4>
            <ul className="text-text-dim space-y-1">
              <li>- Policies inherit downward</li>
              <li>- 1 resource = 1 resource group</li>
              <li>- Subscriptions = billing boundary</li>
              <li>- MGs can nest up to 6 levels deep</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
