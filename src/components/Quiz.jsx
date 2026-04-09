import { useState } from 'react'

// Mini visual representations for common AZ-900 concepts
const conceptVisuals = {
  // Cloud Models
  'IaaS': { layers: ['App', 'Data', 'Runtime', 'MW', 'OS'], managed: 0, label: 'IaaS', desc: 'You manage everything above the hardware' },
  'PaaS': { layers: ['App', 'Data', 'Runtime', 'MW', 'OS'], managed: 3, label: 'PaaS', desc: 'You manage app + data only' },
  'SaaS': { layers: ['App', 'Data', 'Runtime', 'MW', 'OS'], managed: 5, label: 'SaaS', desc: 'Provider manages everything' },
  'Serverless': { layers: ['Function', '', '', '', ''], managed: 4, label: 'Serverless', desc: 'Just your code, nothing else' },
  'On-premises': { layers: ['App', 'Data', 'Runtime', 'MW', 'OS'], managed: 0, label: 'On-Prem', desc: 'You manage literally everything' },

  // Hierarchy
  'Root Management Group': { icon: 'MG', color: 'purple', desc: 'Top of hierarchy, contains everything' },
  'Management Group': { icon: 'MG', color: 'purple', desc: 'Organizes subscriptions, policies flow down' },
  'Subscription': { icon: 'SUB', color: 'blue', desc: 'Billing boundary, contains resource groups' },
  'Resource Group': { icon: 'RG', color: 'amber', desc: 'Container for resources, delete = delete all inside' },
  'Resource': { icon: 'RES', color: 'emerald', desc: 'A single Azure service instance' },
  'Tenant': { icon: 'TNT', color: 'gray', desc: 'Identity boundary (Entra ID), not resource hierarchy' },

  // Compute
  'Virtual Machines': { icon: 'VM', color: 'blue', desc: 'Full server you manage. Most control, most work.' },
  'VMs': { icon: 'VM', color: 'blue', desc: 'Full server you manage. Most control, most work.' },
  'Azure Functions': { icon: 'f(x)', color: 'amber', desc: 'Event-triggered code. No idle cost.' },
  'Azure Kubernetes Service': { icon: 'AKS', color: 'cyan', desc: 'Container orchestration at scale' },
  'AKS': { icon: 'AKS', color: 'cyan', desc: 'Container orchestration at scale' },
  'App Service': { icon: 'APP', color: 'purple', desc: 'Managed web hosting. Deploy code, not servers.' },
  'Azure Container Instances': { icon: 'ACI', color: 'emerald', desc: 'Quick container run, no infra' },
  'Azure Virtual Desktop': { icon: 'AVD', color: 'gray', desc: 'Cloud-hosted Windows desktops for end users' },
  'Azure Dedicated Host': { icon: 'DH', color: 'gray', desc: 'Physical server reserved for you. Maximum isolation.' },
  'Logic Apps': { icon: 'LA', color: 'gray', desc: 'Workflow automation (like IFTTT). Not app hosting.' },
  'Azure Batch': { icon: 'BAT', color: 'gray', desc: 'Large-scale parallel compute jobs' },

  // Networking
  'VNet': { icon: 'VNET', color: 'blue', desc: 'Your private network in Azure' },
  'NSG': { icon: 'NSG', color: 'amber', desc: 'Layer 3/4 packet filter (IP, port, protocol)' },
  'Azure Firewall': { icon: 'FW', color: 'red', desc: 'Layer 7 inspection (URLs, FQDNs, TLS)' },
  'ExpressRoute': { icon: 'ER', color: 'purple', desc: 'Private dedicated fiber. No public internet.' },
  'VPN Gateway': { icon: 'VPN', color: 'blue', desc: 'Encrypted tunnel over public internet' },
  'Azure Load Balancer': { icon: 'LB', color: 'blue', desc: 'Layer 4 load balancing within a region' },
  'Azure Traffic Manager': { icon: 'TM', color: 'purple', desc: 'DNS-based global traffic routing' },
  'VNet Peering': { icon: 'PEER', color: 'cyan', desc: 'Connects two VNets privately' },

  // Storage
  'Blob Storage': { icon: 'BLOB', color: 'blue', desc: 'Object storage. Images, videos, backups.' },
  'Table Storage': { icon: 'TBL', color: 'emerald', desc: 'NoSQL key-value. Structured data.' },
  'Queue Storage': { icon: 'QUE', color: 'amber', desc: 'Message queue for async processing' },
  'Azure Files': { icon: 'FILE', color: 'purple', desc: 'SMB/NFS file shares. Mount as drive.' },
  'Azure SQL': { icon: 'SQL', color: 'blue', desc: 'Relational database. Rows and columns.' },
  'LRS': { icon: 'LRS', color: 'blue', desc: '3 copies, 1 datacenter. Cheapest.' },
  'ZRS': { icon: 'ZRS', color: 'purple', desc: '3 copies across 3 AZs. Zone-resilient.' },
  'GRS': { icon: 'GRS', color: 'amber', desc: '6 copies across 2 regions. Geo-resilient.' },
  'GZRS': { icon: 'GZRS', color: 'red', desc: '6 copies. ZRS locally + GRS. Maximum protection.' },
  'Hot tier': { icon: 'HOT', color: 'red', desc: 'Highest storage cost, lowest access cost' },
  'Cool tier': { icon: 'COOL', color: 'blue', desc: 'Lower storage cost, higher access cost' },
  'Archive tier': { icon: 'ARCH', color: 'purple', desc: 'Cheapest storage, hours to retrieve' },
  'Premium tier': { icon: 'PREM', color: 'amber', desc: 'Fastest performance, highest cost' },

  // Identity
  'Azure Active Directory': { icon: 'AAD', color: 'blue', desc: 'Now called Microsoft Entra ID' },
  'Active Directory Domain Services': { icon: 'ADDS', color: 'gray', desc: 'On-prem. Kerberos/LDAP. Different product.' },
  'Microsoft Entra ID': { icon: 'EID', color: 'blue', desc: 'Cloud identity. OAuth/SAML/OIDC.' },
  'Azure Key Vault': { icon: 'KV', color: 'gray', desc: 'Secrets/keys/certs storage. Not identity.' },
  'Microsoft Defender': { icon: 'DEF', color: 'gray', desc: 'Threat detection. Not identity management.' },
  'MFA': { icon: 'MFA', color: 'amber', desc: '2+ factors: know + have/are' },
  'Conditional Access': { icon: 'CA', color: 'purple', desc: 'If/then policies: location, device, risk' },
  'SSO': { icon: 'SSO', color: 'emerald', desc: 'One login, many apps' },
  'FIDO2 security keys, Windows Hello, Authenticator app': { icon: 'PLESS', color: 'emerald', desc: 'No passwords. Biometrics + hardware keys.' },

  // RBAC
  'Owner': { icon: 'OWN', color: 'red', desc: 'Full access + assign roles' },
  'Contributor': { icon: 'CTR', color: 'amber', desc: 'Read + Write, no role assignment' },
  'Reader': { icon: 'RDR', color: 'emerald', desc: 'View only. Zero writes.' },
  'User Access Administrator': { icon: 'UAA', color: 'purple', desc: 'Manage role assignments only' },

  // Cost
  'OpEx': { icon: 'OPEX', color: 'emerald', desc: 'Pay as you go. Operational spending.' },
  'CapEx': { icon: 'CAPEX', color: 'amber', desc: 'Upfront purchase. Own the hardware.' },
  'Pay-as-you-go pricing': { icon: 'PAYG', color: 'blue', desc: 'No commitment. Highest per-unit cost.' },
  '1 or 3 years of usage': { icon: 'RESV', color: 'emerald', desc: 'Commit long term. Up to 60% off.' },
  'Spot pricing': { icon: 'SPOT', color: 'amber', desc: 'Cheap but evictable. Spare capacity.' },
  'Migrating to Azure from on-premises': { icon: 'TCO', color: 'blue', desc: 'Compare total cost: on-prem vs cloud' },

  // Governance
  'Azure Policy': { icon: 'POL', color: 'blue', desc: 'Audit or deny non-compliant deployments' },
  'Resource Tags': { icon: 'TAG', color: 'purple', desc: 'Labels for organizing and cost tracking' },
  'Resource Locks': { icon: 'LOCK', color: 'amber', desc: 'Prevent accidental delete/modify' },
  'Azure Monitor': { icon: 'MON', color: 'gray', desc: 'Observe and alert. Doesn\'t prevent actions.' },
  'Azure Blueprints': { icon: 'BP', color: 'blue', desc: 'Package templates + policies + RBAC together' },

  // SLA
  '99.9%': { icon: '99.9', color: 'amber', desc: '~8.7 hours downtime/year' },
  '99.95%': { icon: '99.95', color: 'blue', desc: '~4.4 hours downtime/year' },
  '99.99%': { icon: '99.99', color: 'emerald', desc: '~52 minutes downtime/year' },
  '99.999%': { icon: '5×9', color: 'emerald', desc: '~5 minutes downtime/year' },

  // Generic
  'Microsoft': { icon: 'MS', color: 'blue', desc: 'Cloud provider responsibility' },
  'The customer': { icon: 'YOU', color: 'amber', desc: 'Your responsibility' },
  'Customer': { icon: 'YOU', color: 'amber', desc: 'Your responsibility' },
  'Shared': { icon: 'BOTH', color: 'purple', desc: 'Split responsibility' },
}

const colorClasses = {
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400' },
  purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400' },
  amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400' },
  emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400' },
  cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-400' },
  red: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400' },
  gray: { bg: 'bg-gray-500/20', border: 'border-gray-500/40', text: 'text-gray-400' },
}

function ConceptCard({ label, outline }) {
  const vis = conceptVisuals[label]
  if (!vis) return (
    <div className={`rounded-lg p-4 border-2 ${outline} bg-surface-3 text-center`}>
      <div className="text-white font-medium text-sm">{label}</div>
    </div>
  )

  // Stack visual for cloud models
  if (vis.layers) {
    return (
      <div className={`rounded-lg p-4 border-2 ${outline} bg-surface-2`}>
        <div className="text-center mb-2">
          <span className="text-white font-bold text-sm">{vis.label}</span>
        </div>
        <div className="space-y-0.5">
          {vis.layers.map((l, i) => l && (
            <div key={i} className={`text-xs px-2 py-1 rounded text-center ${
              i < vis.managed ? 'bg-azure/20 text-azure' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {l} {i < vis.managed ? '(Azure)' : '(You)'}
            </div>
          ))}
        </div>
        <div className="text-text-dim text-xs mt-2 text-center">{vis.desc}</div>
      </div>
    )
  }

  // Icon card for everything else
  const c = colorClasses[vis.color] || colorClasses.gray
  return (
    <div className={`rounded-lg p-4 border-2 ${outline} ${c.bg}`}>
      <div className="text-center">
        <div className={`inline-block font-mono font-bold text-lg px-3 py-1 rounded ${c.bg} border ${c.border} ${c.text} mb-2`}>
          {vis.icon}
        </div>
        <div className="text-white font-medium text-sm">{label}</div>
        <div className="text-text-dim text-xs mt-1">{vis.desc}</div>
      </div>
    </div>
  )
}

export function Quiz({ questions }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const q = questions[current]
  const isCorrect = selected === q.answer
  const total = questions.length

  const handleSelect = (i) => {
    if (revealed) return
    setSelected(i)
  }

  const handleReveal = () => {
    if (selected === null) return
    setRevealed(true)
    if (selected === q.answer) setScore(s => s + 1)
  }

  const handleNext = () => {
    if (current + 1 >= total) {
      setDone(true)
      return
    }
    setCurrent(c => c + 1)
    setSelected(null)
    setRevealed(false)
  }

  const handleRestart = () => {
    setCurrent(0)
    setSelected(null)
    setRevealed(false)
    setScore(0)
    setDone(false)
  }

  if (done) {
    const pct = Math.round((score / total) * 100)
    return (
      <div className="text-center py-12">
        <div className={`text-6xl font-bold mb-4 ${pct >= 70 ? 'text-success' : 'text-danger'}`}>{pct}%</div>
        <div className="text-white text-xl mb-2">{score}/{total} correct</div>
        <div className="text-text-dim mb-6">
          {pct >= 90 ? 'Locked in.' : pct >= 70 ? 'Passing. But the exam will be trickier.' : pct >= 50 ? 'You know some of it. Go back through the demos you missed.' : 'Go back to the demos. Don\'t guess — understand.'}
        </div>
        <button onClick={handleRestart}
          className="px-6 py-2.5 bg-azure hover:bg-azure-dark text-white rounded-lg cursor-pointer">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-text-dim text-sm">Question {current + 1} of {total}</span>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${
                i < current ? 'bg-azure' : i === current ? 'bg-white' : 'bg-surface-3'
              }`} />
            ))}
          </div>
          <span className="text-text-dim text-sm">{score}/{current} correct</span>
        </div>
      </div>

      <div className="bg-surface-2 rounded-lg p-6 mb-4">
        <p className="text-white text-lg font-medium">{q.q}</p>
      </div>

      <div className="space-y-2 mb-4">
        {q.choices.map((c, i) => {
          let cls = 'border-border hover:border-azure/50'
          if (revealed) {
            if (i === q.answer) cls = 'border-success bg-success/10'
            else if (i === selected) cls = 'border-danger bg-danger/10'
            else cls = 'border-border opacity-40'
          } else if (i === selected) {
            cls = 'border-azure bg-azure/10'
          }
          return (
            <button key={i} onClick={() => handleSelect(i)}
              className={`w-full text-left px-5 py-3.5 rounded-lg border ${cls} text-sm transition-colors cursor-pointer`}>
              <span className="text-text-dim mr-3 font-mono">{String.fromCharCode(65 + i)}.</span>
              <span className="text-white">{c}</span>
            </button>
          )
        })}
      </div>

      {!revealed && (
        <button onClick={handleReveal} disabled={selected === null}
          className="px-6 py-2.5 bg-azure hover:bg-azure-dark disabled:opacity-30 text-white rounded-lg cursor-pointer disabled:cursor-not-allowed">
          Lock In
        </button>
      )}

      {revealed && (
        <div className="space-y-4">
          {/* Visual comparison: your pick vs correct answer */}
          {!isCorrect && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-danger text-xs font-medium mb-2 uppercase tracking-wide">Your answer</div>
                <ConceptCard label={q.choices[selected]} outline="border-danger" />
              </div>
              <div>
                <div className="text-success text-xs font-medium mb-2 uppercase tracking-wide">Correct answer</div>
                <ConceptCard label={q.choices[q.answer]} outline="border-success" />
              </div>
            </div>
          )}

          {isCorrect && (
            <div className="max-w-sm mx-auto">
              <div className="text-success text-xs font-medium mb-2 uppercase tracking-wide text-center">Correct</div>
              <ConceptCard label={q.choices[q.answer]} outline="border-success" />
            </div>
          )}

          {/* Text explanation */}
          {isCorrect ? (
            <div className="bg-success/10 border border-success/30 rounded-lg p-5">
              <div className="text-success font-medium mb-1">Correct.</div>
              {q.explain && <p className="text-text-dim text-sm">{q.explain}</p>}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-danger/10 border border-danger/30 rounded-lg p-5">
                <div className="text-danger font-medium mb-2">Wrong.</div>
                {q.traps?.[selected] && (
                  <>
                    <p className="text-text-dim text-sm mb-2">
                      <span className="text-amber-400 font-medium">Why you picked that: </span>
                      {q.traps[selected].thought}
                    </p>
                    <p className="text-text-dim text-sm">
                      <span className="text-danger font-medium">Why it's wrong: </span>
                      {q.traps[selected].wrong}
                    </p>
                  </>
                )}
              </div>
              <div className="bg-success/10 border border-success/30 rounded-lg p-5">
                <div className="text-success font-medium mb-1">The answer is: {q.choices[q.answer]}</div>
                {q.explain && <p className="text-text-dim text-sm">{q.explain}</p>}
              </div>
            </div>
          )}

          <button onClick={handleNext}
            className="px-6 py-2.5 bg-surface-3 hover:bg-border text-white rounded-lg cursor-pointer">
            {current + 1 >= total ? 'See Results' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  )
}
