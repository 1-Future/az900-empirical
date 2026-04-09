import { useState } from 'react'

const roles = ['Owner', 'Contributor', 'Reader']
const scopes = ['Management Group', 'Subscription', 'Resource Group', 'Resource']

const users = [
  { name: 'Alice', role: 'Owner', scope: 'Subscription' },
  { name: 'Bob', role: 'Contributor', scope: 'Resource Group' },
  { name: 'Charlie', role: 'Reader', scope: 'Resource Group' },
]

const actions = [
  { name: 'Read resource properties', needs: 'Reader' },
  { name: 'Create a new VM', needs: 'Contributor' },
  { name: 'Delete a resource group', needs: 'Contributor' },
  { name: 'Assign roles to other users', needs: 'Owner' },
  { name: 'Manage billing', needs: 'Owner' },
]

const roleLevel = { Owner: 3, Contributor: 2, Reader: 1 }

export function RBACDemo() {
  const [selectedUser, setSelectedUser] = useState(0)
  const user = users[selectedUser]

  return (
    <div>
      <p className="text-text-dim mb-6">
        <span className="text-azure">RBAC</span> controls who can do what at which scope.
        Select a user to see what actions they can perform based on their role assignment.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-white font-medium mb-3">Users</h3>
          <div className="space-y-2">
            {users.map((u, i) => (
              <button key={u.name} onClick={() => setSelectedUser(i)}
                className={`w-full text-left px-4 py-3 rounded-lg cursor-pointer transition-colors border ${
                  selectedUser === i ? 'border-azure bg-azure/10' : 'border-border bg-surface-2 hover:bg-surface-3'
                }`}>
                <div className="text-white font-medium">{u.name}</div>
                <div className="text-text-dim text-xs mt-1">
                  {u.role} @ {u.scope}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 bg-surface-2 rounded-lg p-4">
            <h4 className="text-white text-sm font-medium mb-2">Scope Hierarchy</h4>
            {scopes.map((s, i) => (
              <div key={s} className={`text-sm py-1 ${i > 0 ? 'ml-' + (i * 3) : ''} ${
                s === user.scope ? 'text-azure font-medium' : 'text-text-dim'
              }`}>
                {i > 0 && <span className="text-border mr-1">{'>'}</span>}{s}
                {s === user.scope && <span className="text-xs text-azure ml-1">({user.role})</span>}
              </div>
            ))}
            <p className="text-xs text-text-dim mt-2">Roles inherit downward through the hierarchy.</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-white font-medium mb-3">
            Can {user.name} ({user.role}) do this?
          </h3>
          <div className="space-y-2">
            {actions.map(a => {
              const canDo = roleLevel[user.role] >= roleLevel[a.needs]
              return (
                <div key={a.name}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
                    canDo ? 'border-success/30 bg-success/10' : 'border-danger/30 bg-danger/10'
                  }`}>
                  <div>
                    <span className="text-white text-sm">{a.name}</span>
                    <span className="text-text-dim text-xs ml-2">(requires {a.needs}+)</span>
                  </div>
                  <span className={`text-sm font-mono ${canDo ? 'text-success' : 'text-danger'}`}>
                    {canDo ? 'ALLOWED' : 'DENIED'}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-4 bg-surface-2 rounded-lg p-4">
            <h4 className="text-white text-sm font-medium mb-2">Built-in Role Comparison</h4>
            <div className="grid grid-cols-3 gap-3">
              {roles.map(r => (
                <div key={r} className={`rounded-lg p-3 text-center border ${
                  r === user.role ? 'border-azure bg-azure/10' : 'border-border bg-surface-3'
                }`}>
                  <div className={`font-medium text-sm ${r === user.role ? 'text-azure' : 'text-white'}`}>{r}</div>
                  <div className="text-text-dim text-xs mt-1">
                    {r === 'Reader' && 'View only'}
                    {r === 'Contributor' && 'Read + Write'}
                    {r === 'Owner' && 'Full + assign roles'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
