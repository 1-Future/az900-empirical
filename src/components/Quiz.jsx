import { useState } from 'react'

const colorClasses = {
  blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400', fill: '#3b82f6' },
  purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400', fill: '#8b5cf6' },
  amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400', fill: '#f59e0b' },
  emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-400', fill: '#22c55e' },
  cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/40', text: 'text-cyan-400', fill: '#06b6d4' },
  red: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400', fill: '#ef4444' },
  gray: { bg: 'bg-gray-500/20', border: 'border-gray-500/40', text: 'text-gray-400', fill: '#6b7280' },
}

// SVG mini-diagrams for concepts
function StackDiagram({ layers, managedByAzure, color }) {
  // Renders a vertical stack showing which layers Azure manages vs you
  const h = 24
  const gap = 2
  const total = layers.length
  return (
    <svg viewBox={`0 0 200 ${total * (h + gap)}`} className="w-full" style={{ maxHeight: 160 }}>
      {layers.map((layer, i) => {
        const isAzure = i >= (total - managedByAzure)
        return (
          <g key={i}>
            <rect x="4" y={i * (h + gap)} width="192" height={h} rx="4"
              fill={isAzure ? 'rgba(0,120,212,0.25)' : 'rgba(245,158,11,0.25)'}
              stroke={isAzure ? '#0078d4' : '#f59e0b'} strokeWidth="1" />
            <text x="12" y={i * (h + gap) + 16} fill={isAzure ? '#60a5fa' : '#fbbf24'} fontSize="11" fontFamily="monospace">{layer}</text>
            <text x="188" y={i * (h + gap) + 16} fill={isAzure ? '#60a5fa80' : '#fbbf2480'} fontSize="9" fontFamily="monospace" textAnchor="end">{isAzure ? 'Azure' : 'You'}</text>
          </g>
        )
      })}
    </svg>
  )
}

function ServerDiagram({ label, items, color }) {
  // Box diagram with internal items
  const c = colorClasses[color] || colorClasses.blue
  return (
    <svg viewBox="0 0 200 120" className="w-full" style={{ maxHeight: 140 }}>
      <rect x="4" y="4" width="192" height="112" rx="8" fill="none" stroke={c.fill} strokeWidth="1.5" strokeDasharray={color === 'gray' ? '4 3' : 'none'} opacity="0.6" />
      <text x="100" y="22" fill={c.fill} fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">{label}</text>
      {items.map((item, i) => (
        <g key={i}>
          <rect x="12" y={32 + i * 22} width="176" height="18" rx="3" fill={c.fill} opacity="0.15" />
          <text x="20" y={32 + i * 22 + 13} fill={c.fill} fontSize="10" fontFamily="monospace" opacity="0.9">{item}</text>
        </g>
      ))}
    </svg>
  )
}

function HierarchyDiagram({ levels, highlight }) {
  // Nested boxes showing hierarchy
  return (
    <svg viewBox="0 0 200 130" className="w-full" style={{ maxHeight: 150 }}>
      {levels.map((lvl, i) => {
        const x = 4 + i * 12
        const y = 4 + i * 14
        const w = 192 - i * 24
        const h = 122 - i * 28
        const isHighlight = lvl.label === highlight
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} rx="6" fill="none"
              stroke={lvl.color} strokeWidth={isHighlight ? 2 : 1} opacity={isHighlight ? 1 : 0.4} />
            <text x={x + 6} y={y + 13} fill={lvl.color} fontSize="9" fontFamily="monospace" fontWeight={isHighlight ? 'bold' : 'normal'}>
              {lvl.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function FlowDiagram({ steps, color }) {
  const c = colorClasses[color] || colorClasses.blue
  return (
    <svg viewBox={`0 0 200 ${Math.max(80, steps.length * 28 + 8)}`} className="w-full" style={{ maxHeight: 160 }}>
      {steps.map((step, i) => (
        <g key={i}>
          {i > 0 && <line x1="100" y1={i * 28 - 4} x2="100" y2={i * 28 + 2} stroke={c.fill} strokeWidth="1" opacity="0.4" />}
          <rect x="8" y={i * 28 + 4} width="184" height="20" rx="4" fill={c.fill} opacity="0.15" />
          <text x="100" y={i * 28 + 18} fill={c.fill} fontSize="9" fontFamily="monospace" textAnchor="middle">{step}</text>
        </g>
      ))}
    </svg>
  )
}

function CopyDiagram({ copies, locations, color }) {
  const c = colorClasses[color] || colorClasses.blue
  const cols = Math.min(copies, 3)
  const rows = Math.ceil(copies / 3)
  return (
    <svg viewBox="0 0 200 100" className="w-full" style={{ maxHeight: 120 }}>
      {Array.from({ length: copies }).map((_, i) => {
        const col = i % 3
        const row = Math.floor(i / 3)
        const x = 20 + col * 60
        const y = 8 + row * 44
        return (
          <g key={i}>
            <rect x={x} y={y} width="48" height="32" rx="4" fill={c.fill} opacity="0.2" stroke={c.fill} strokeWidth="1" />
            <text x={x + 24} y={y + 20} fill={c.fill} fontSize="10" fontFamily="monospace" textAnchor="middle">Copy {i + 1}</text>
          </g>
        )
      })}
      <text x="100" y="95" fill={c.fill} fontSize="9" fontFamily="monospace" textAnchor="middle" opacity="0.7">{locations}</text>
    </svg>
  )
}

function RegionDiagram({ zones, label, color }) {
  const c = colorClasses[color] || colorClasses.blue
  return (
    <svg viewBox="0 0 200 100" className="w-full" style={{ maxHeight: 120 }}>
      <rect x="4" y="4" width="192" height="92" rx="8" fill="none" stroke={c.fill} strokeWidth="1.5" opacity="0.4" />
      <text x="100" y="22" fill={c.fill} fontSize="10" fontFamily="monospace" textAnchor="middle">{label}</text>
      {Array.from({ length: zones }).map((_, i) => {
        const x = 20 + i * 58
        return (
          <g key={i}>
            <rect x={x} y="32" width="48" height="52" rx="6" fill={c.fill} opacity="0.15" stroke={c.fill} strokeWidth="1" />
            <text x={x + 24} y="50" fill={c.fill} fontSize="9" fontFamily="monospace" textAnchor="middle">AZ {i + 1}</text>
            <rect x={x + 8} y="56" width="12" height="8" rx="2" fill={c.fill} opacity="0.3" />
            <rect x={x + 24} y="56" width="12" height="8" rx="2" fill={c.fill} opacity="0.3" />
            <text x={x + 24} y="76" fill={c.fill} fontSize="7" fontFamily="monospace" textAnchor="middle" opacity="0.6">DC</text>
          </g>
        )
      })}
    </svg>
  )
}

function PermissionDiagram({ actions, color }) {
  const c = colorClasses[color] || colorClasses.blue
  return (
    <svg viewBox="0 0 200 90" className="w-full" style={{ maxHeight: 110 }}>
      {actions.map((a, i) => (
        <g key={i}>
          <rect x="8" y={4 + i * 22} width="184" height="18" rx="3"
            fill={a.allowed ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}
            stroke={a.allowed ? '#22c55e' : '#ef4444'} strokeWidth="0.5" />
          <text x="16" y={4 + i * 22 + 13} fill={a.allowed ? '#22c55e' : '#ef4444'} fontSize="10" fontFamily="monospace">{a.label}</text>
          <text x="184" y={4 + i * 22 + 13} fill={a.allowed ? '#22c55e' : '#ef4444'} fontSize="8" fontFamily="monospace" textAnchor="end">
            {a.allowed ? 'OK' : 'DENY'}
          </text>
        </g>
      ))}
    </svg>
  )
}

function TrafficDiagram({ blocked, port, color }) {
  const c = colorClasses[color] || colorClasses.blue
  return (
    <svg viewBox="0 0 200 80" className="w-full" style={{ maxHeight: 100 }}>
      <rect x="4" y="24" width="50" height="32" rx="4" fill="rgba(96,165,250,0.2)" stroke="#60a5fa" strokeWidth="1" />
      <text x="29" y="44" fill="#60a5fa" fontSize="9" fontFamily="monospace" textAnchor="middle">Client</text>
      <rect x="146" y="24" width="50" height="32" rx="4" fill="rgba(96,165,250,0.2)" stroke="#60a5fa" strokeWidth="1" />
      <text x="171" y="44" fill="#60a5fa" fontSize="9" fontFamily="monospace" textAnchor="middle">Server</text>
      <line x1="54" y1="40" x2="90" y2="40" stroke={blocked ? '#ef4444' : '#22c55e'} strokeWidth="2" markerEnd={blocked ? '' : 'url(#arrow)'} />
      {blocked ? (
        <>
          <rect x="88" y="28" width="24" height="24" rx="4" fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth="1.5" />
          <text x="100" y="44" fill="#ef4444" fontSize="14" fontFamily="monospace" textAnchor="middle">X</text>
        </>
      ) : (
        <>
          <line x1="110" y1="40" x2="146" y2="40" stroke="#22c55e" strokeWidth="2" />
          <rect x="88" y="28" width="24" height="24" rx="4" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="1.5" />
          <text x="100" y="43" fill="#22c55e" fontSize="10" fontFamily="monospace" textAnchor="middle">OK</text>
        </>
      )}
      <text x="100" y="72" fill={c.fill} fontSize="9" fontFamily="monospace" textAnchor="middle" opacity="0.7">Port {port}</text>
    </svg>
  )
}

function CostDiagram({ bars, color }) {
  const c = colorClasses[color] || colorClasses.blue
  const max = Math.max(...bars.map(b => b.value))
  return (
    <svg viewBox="0 0 200 100" className="w-full" style={{ maxHeight: 120 }}>
      {bars.map((b, i) => {
        const barW = 36
        const x = 20 + i * (barW + 12)
        const barH = (b.value / max) * 60
        return (
          <g key={i}>
            <rect x={x} y={80 - barH} width={barW} height={barH} rx="3" fill={b.color || c.fill} opacity="0.3" stroke={b.color || c.fill} strokeWidth="1" />
            <text x={x + barW / 2} y={75 - barH} fill={b.color || c.fill} fontSize="9" fontFamily="monospace" textAnchor="middle">{b.label2 || ''}</text>
            <text x={x + barW / 2} y="95" fill={b.color || c.fill} fontSize="8" fontFamily="monospace" textAnchor="middle">{b.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

// Map answer text to diagram configs
const diagrams = {
  // Cloud models - stacks
  'IaaS': () => <StackDiagram layers={['Application', 'Data', 'Runtime', 'Middleware', 'OS', 'Virtualization', 'Servers', 'Storage', 'Networking']} managedByAzure={4} />,
  'PaaS': () => <StackDiagram layers={['Application', 'Data', 'Runtime', 'Middleware', 'OS', 'Virtualization', 'Servers', 'Storage', 'Networking']} managedByAzure={7} />,
  'SaaS': () => <StackDiagram layers={['Application', 'Data', 'Runtime', 'Middleware', 'OS', 'Virtualization', 'Servers', 'Storage', 'Networking']} managedByAzure={9} />,
  'On-premises': () => <StackDiagram layers={['Application', 'Data', 'Runtime', 'Middleware', 'OS', 'Virtualization', 'Servers', 'Storage', 'Networking']} managedByAzure={0} />,
  'Serverless': () => <StackDiagram layers={['Your Function', '(everything else hidden)']} managedByAzure={1} />,
  'On-Prem': () => <StackDiagram layers={['Application', 'Data', 'Runtime', 'Middleware', 'OS', 'Virtualization', 'Servers', 'Storage', 'Networking']} managedByAzure={0} />,

  // Hierarchy
  'Root Management Group': () => <HierarchyDiagram levels={[
    { label: 'Root Management Group', color: '#8b5cf6' },
    { label: 'Management Group', color: '#8b5cf680' },
    { label: 'Subscription', color: '#3b82f680' },
    { label: 'Resource Group', color: '#f59e0b80' },
  ]} highlight="Root Management Group" />,
  'Management Group': () => <HierarchyDiagram levels={[
    { label: 'Root MG', color: '#8b5cf680' },
    { label: 'Management Group', color: '#8b5cf6' },
    { label: 'Subscription', color: '#3b82f680' },
    { label: 'Resource Group', color: '#f59e0b80' },
  ]} highlight="Management Group" />,
  'Subscription': () => <HierarchyDiagram levels={[
    { label: 'Root MG', color: '#8b5cf680' },
    { label: 'Management Group', color: '#8b5cf680' },
    { label: 'Subscription', color: '#3b82f6' },
    { label: 'Resource Group', color: '#f59e0b80' },
  ]} highlight="Subscription" />,
  'Resource Group': () => <HierarchyDiagram levels={[
    { label: 'Root MG', color: '#8b5cf680' },
    { label: 'Management Group', color: '#8b5cf680' },
    { label: 'Subscription', color: '#3b82f680' },
    { label: 'Resource Group', color: '#f59e0b' },
  ]} highlight="Resource Group" />,
  'Tenant': () => <ServerDiagram label="Entra ID Tenant" items={['Identity boundary', 'NOT resource hierarchy', 'Contains users/groups']} color="gray" />,

  // Compute
  'Virtual Machines': () => <ServerDiagram label="Virtual Machine" items={['OS: You manage', 'Patches: You manage', 'Runtime: You manage', 'Full control, full work']} color="blue" />,
  'VMs': () => <ServerDiagram label="Virtual Machine" items={['OS: You manage', 'Patches: You manage', 'Runtime: You manage', 'Full control, full work']} color="blue" />,
  'Azure VMs': () => <ServerDiagram label="Virtual Machine" items={['OS: You manage', 'Patches: You manage', 'Runtime: You manage', 'Full control, full work']} color="blue" />,
  'App Service': () => <ServerDiagram label="App Service (PaaS)" items={['Deploy code only', 'Azure handles OS+runtime', 'Auto-scale built in', 'SSL, CI/CD included']} color="purple" />,
  'Azure App Service': () => <ServerDiagram label="App Service (PaaS)" items={['Deploy code only', 'Azure handles OS+runtime', 'Auto-scale built in', 'SSL, CI/CD included']} color="purple" />,
  'Azure Functions': () => <FlowDiagram steps={['Event trigger fires', 'Function code runs', 'Returns result', 'Scales to zero (no cost)']} color="amber" />,
  'Azure Functions consumption plan': () => <FlowDiagram steps={['Event trigger fires', 'Function code runs', 'Returns result', 'Scales to zero (no cost)']} color="amber" />,
  'Azure Kubernetes Service': () => <ServerDiagram label="AKS Cluster" items={['Control plane (Azure)', 'Node pool (Your VMs)', 'Pods (Your containers)', 'Auto-scaling (HPA)']} color="cyan" />,
  'AKS': () => <ServerDiagram label="AKS Cluster" items={['Control plane (Azure)', 'Node pool (Your VMs)', 'Pods (Your containers)', 'Auto-scaling (HPA)']} color="cyan" />,
  'Containers': () => <ServerDiagram label="Containers" items={['Packaged app + dependencies', 'Lightweight (share OS)', 'Orchestrated by K8s']} color="cyan" />,
  'Azure Container Instances': () => <ServerDiagram label="Container Instances" items={['No infra to manage', 'Give it an image, it runs', 'Per-second billing', 'No orchestration']} color="emerald" />,
  'Azure Virtual Desktop': () => <ServerDiagram label="Virtual Desktop" items={['Cloud Windows desktops', 'For end users, not APIs', 'RDP from anywhere']} color="gray" />,
  'Azure Dedicated Host': () => <ServerDiagram label="Dedicated Host" items={['Physical server for you', 'MORE management', 'Maximum isolation', 'Very expensive']} color="gray" />,
  'Logic Apps': () => <FlowDiagram steps={['Trigger (email, HTTP...)', 'Action 1 (send email)', 'Action 2 (update DB)', 'Workflow, not app hosting']} color="gray" />,
  'Azure Batch': () => <ServerDiagram label="Azure Batch" items={['Parallel compute jobs', 'Not container hosting', 'Large-scale processing']} color="gray" />,
  'Reserved VMs': () => <CostDiagram bars={[
    { label: 'PayG', value: 100, color: '#ef4444' },
    { label: '1yr', value: 63, color: '#f59e0b', label2: '-37%' },
    { label: '3yr', value: 40, color: '#22c55e', label2: '-60%' },
  ]} color="blue" />,

  // Networking
  'IP address, port, and protocol': () => <TrafficDiagram blocked={false} port="443 TCP" color="blue" />,
  'Private dedicated fiber connection': () => <FlowDiagram steps={['Your datacenter', '--- private fiber ---', 'Azure datacenter', 'No public internet']} color="purple" />,
  'Public internet VPN with encryption': () => <FlowDiagram steps={['Your datacenter', '~~~ public internet ~~~', 'Encrypted VPN tunnel', 'Azure datacenter']} color="blue" />,
  'ExpressRoute': () => <FlowDiagram steps={['Your datacenter', '--- private fiber ---', 'Azure datacenter', 'No public internet']} color="purple" />,
  'VPN Gateway': () => <FlowDiagram steps={['Your datacenter', '~~~ public internet ~~~', 'Encrypted VPN tunnel', 'Azure datacenter']} color="blue" />,
  'Azure Load Balancer': () => <ServerDiagram label="Load Balancer" items={['Layer 4 (TCP/UDP)', 'Within one region', 'Distributes traffic']} color="blue" />,
  'Azure Traffic Manager': () => <ServerDiagram label="Traffic Manager" items={['DNS-based routing', 'Global (cross-region)', 'Health probes', 'Nearest healthy endpoint']} color="purple" />,
  'VNet Peering': () => <FlowDiagram steps={['VNet A (10.0.0.0/16)', '<-- peering link -->', 'VNet B (10.1.0.0/16)', 'Private, MS backbone']} color="cyan" />,
  'Azure Firewall is Layer 7 and NSG is Layer 3/4': () => <ServerDiagram label="Firewall vs NSG" items={['Firewall: URLs, FQDNs, TLS', 'NSG: IP + Port + Protocol', 'Firewall = smart, expensive', 'NSG = simple, free']} color="blue" />,
  'Region': () => <RegionDiagram zones={3} label="Azure Region" color="blue" />,

  // Storage
  'Blob Storage': () => <ServerDiagram label="Blob Storage" items={['Images, videos, backups', 'Unstructured data', 'REST/HTTP access', 'Hot/Cool/Archive tiers']} color="blue" />,
  'Table Storage': () => <ServerDiagram label="Table Storage" items={['NoSQL key-value pairs', 'Structured data only', 'Not for binary files']} color="emerald" />,
  'Queue Storage': () => <ServerDiagram label="Queue Storage" items={['Small messages (<64KB)', 'Async processing', 'Decouples components']} color="amber" />,
  'Azure Files': () => <ServerDiagram label="Azure Files" items={['SMB + NFS protocols', 'Mount as network drive', 'Replace file servers']} color="purple" />,
  'Azure SQL': () => <ServerDiagram label="Azure SQL" items={['Relational database', 'Rows and columns', 'Not for large binaries']} color="blue" />,
  'SMB and NFS': () => <ServerDiagram label="File Protocols" items={['SMB: Windows shares', 'NFS: Linux shares', 'Mount as network drive']} color="purple" />,
  'LRS': () => <CopyDiagram copies={3} locations="1 datacenter" color="blue" />,
  'ZRS': () => <CopyDiagram copies={3} locations="3 availability zones" color="purple" />,
  'GRS': () => <CopyDiagram copies={6} locations="2 regions (paired)" color="amber" />,
  'A paired region (6 total copies)': () => <CopyDiagram copies={6} locations="2 regions (paired)" color="amber" />,
  'GZRS': () => <CopyDiagram copies={6} locations="ZRS local + LRS remote" color="red" />,
  'Hot tier': () => <CostDiagram bars={[
    { label: 'Store', value: 100, color: '#ef4444', label2: '$$$' },
    { label: 'Access', value: 20, color: '#22c55e', label2: '$' },
  ]} color="red" />,
  'Cool tier': () => <CostDiagram bars={[
    { label: 'Store', value: 50, color: '#3b82f6', label2: '$$' },
    { label: 'Access', value: 50, color: '#f59e0b', label2: '$$' },
  ]} color="blue" />,
  'Archive tier': () => <CostDiagram bars={[
    { label: 'Store', value: 10, color: '#22c55e', label2: '$' },
    { label: 'Access', value: 100, color: '#ef4444', label2: '$$$' },
    { label: 'Wait', value: 80, color: '#8b5cf6', label2: 'Hours' },
  ]} color="purple" />,
  'Premium tier': () => <CostDiagram bars={[
    { label: 'Store', value: 100, color: '#ef4444', label2: '$$$' },
    { label: 'Speed', value: 100, color: '#22c55e', label2: 'Fast' },
  ]} color="amber" />,

  // Identity
  'Azure Active Directory': () => <ServerDiagram label="Azure AD (now Entra ID)" items={['Cloud-native identity', 'OAuth / SAML / OIDC', 'Renamed 2023']} color="blue" />,
  'Active Directory Domain Services': () => <ServerDiagram label="AD DS (On-Prem)" items={['Domain controllers', 'Kerberos / LDAP / NTLM', 'Group Policy', 'Different product entirely']} color="gray" />,
  'Microsoft Entra ID': () => <ServerDiagram label="Microsoft Entra ID" items={['Cloud identity service', 'OAuth / SAML / OIDC', 'SSO, MFA, Conditional Access']} color="blue" />,
  'Azure Key Vault': () => <ServerDiagram label="Key Vault" items={['Stores secrets & keys', 'NOT identity mgmt', 'Encryption, not auth']} color="gray" />,
  'Microsoft Defender': () => <ServerDiagram label="Defender" items={['Threat detection', 'NOT identity mgmt', 'Security, not auth']} color="gray" />,
  'Signing in once to access multiple applications': () => <FlowDiagram steps={['Login to Entra ID (once)', 'Access App A (no prompt)', 'Access App B (no prompt)', 'Access App C (no prompt)']} color="emerald" />,
  'Location, device state, risk level, and more': () => <FlowDiagram steps={['User signs in...', 'Check: Location OK?', 'Check: Device compliant?', 'Check: Risk level low?', 'Grant or deny access']} color="purple" />,
  'FIDO2 security keys, Windows Hello, Authenticator app': () => <ServerDiagram label="Passwordless Auth" items={['FIDO2 hardware key', 'Windows Hello (biometric)', 'Authenticator push', 'No passwords at all']} color="emerald" />,
  'Entra ID uses OAuth/SAML; on-prem AD uses Kerberos/LDAP': () => <ServerDiagram label="Protocol Comparison" items={['Entra: OAuth, SAML, OIDC', 'AD DS: Kerberos, LDAP', 'Cloud vs On-Prem', 'Different architectures']} color="blue" />,

  // RBAC
  'Owner': () => <PermissionDiagram actions={[
    { label: 'Read resources', allowed: true },
    { label: 'Create/modify resources', allowed: true },
    { label: 'Delete resources', allowed: true },
    { label: 'Assign roles to others', allowed: true },
  ]} color="red" />,
  'Contributor': () => <PermissionDiagram actions={[
    { label: 'Read resources', allowed: true },
    { label: 'Create/modify resources', allowed: true },
    { label: 'Delete resources', allowed: true },
    { label: 'Assign roles to others', allowed: false },
  ]} color="amber" />,
  'Reader': () => <PermissionDiagram actions={[
    { label: 'Read resources', allowed: true },
    { label: 'Create/modify resources', allowed: false },
    { label: 'Delete resources', allowed: false },
    { label: 'Assign roles to others', allowed: false },
  ]} color="emerald" />,
  'User Access Administrator': () => <PermissionDiagram actions={[
    { label: 'Read resources', allowed: true },
    { label: 'Create/modify resources', allowed: false },
    { label: 'Delete resources', allowed: false },
    { label: 'Assign roles to others', allowed: true },
  ]} color="purple" />,
  'Management group, subscription, resource group, or resource': () => <HierarchyDiagram levels={[
    { label: 'Management Group', color: '#8b5cf6' },
    { label: 'Subscription', color: '#3b82f6' },
    { label: 'Resource Group', color: '#f59e0b' },
    { label: 'Resource', color: '#22c55e' },
  ]} highlight="" />,
  'Grant only the permissions needed to do the job': () => <PermissionDiagram actions={[
    { label: 'Needed: Read logs', allowed: true },
    { label: 'Not needed: Delete VMs', allowed: false },
    { label: 'Not needed: Assign roles', allowed: false },
  ]} color="emerald" />,
  'She has Contributor on that RG and Reader on everything else': () => <HierarchyDiagram levels={[
    { label: 'Subscription (Reader)', color: '#22c55e' },
    { label: 'RG-A (Contributor)', color: '#f59e0b' },
    { label: 'RG-B (Reader inherited)', color: '#22c55e80' },
    { label: 'Resources', color: '#6b728080' },
  ]} highlight="RG-A (Contributor)" />,

  // Cost
  'OpEx': () => <CostDiagram bars={[
    { label: 'Jan', value: 60, color: '#22c55e' },
    { label: 'Feb', value: 80, color: '#22c55e' },
    { label: 'Mar', value: 40, color: '#22c55e' },
    { label: 'Apr', value: 90, color: '#22c55e' },
  ]} color="emerald" />,
  'CapEx': () => <CostDiagram bars={[
    { label: 'Buy', value: 100, color: '#ef4444', label2: '$$$' },
    { label: 'Yr 1', value: 10, color: '#f59e0b' },
    { label: 'Yr 2', value: 10, color: '#f59e0b' },
    { label: 'Yr 3', value: 10, color: '#f59e0b' },
  ]} color="amber" />,
  '1 or 3 years of usage': () => <CostDiagram bars={[
    { label: 'PayG', value: 100, color: '#ef4444', label2: '100%' },
    { label: '1yr', value: 63, color: '#f59e0b', label2: '63%' },
    { label: '3yr', value: 40, color: '#22c55e', label2: '40%' },
  ]} color="emerald" />,
  'Migrating to Azure from on-premises': () => <CostDiagram bars={[
    { label: 'On-Prem', value: 100, color: '#ef4444', label2: '$$$' },
    { label: 'Azure', value: 55, color: '#22c55e', label2: 'Save' },
  ]} color="blue" />,
  'Set budgets and alerts for spending': () => <FlowDiagram steps={['Set budget: $500/month', 'Alert at 80% ($400)', 'Alert at 100% ($500)', 'Review and optimize']} color="blue" />,
  'Azure can evict them when it needs the capacity back': () => <FlowDiagram steps={['Spot VM running (cheap)', 'Azure needs capacity...', '30 second warning!', 'VM evicted. Gone.']} color="amber" />,
  'Resource group name': () => <ServerDiagram label="RG Name = Just a Label" items={['Does NOT affect pricing', 'Just organizational', 'VM cost = size+region+OS']} color="gray" />,

  // SLA
  '~52 minutes': () => <CostDiagram bars={[
    { label: '99%', value: 100, color: '#ef4444', label2: '3.6d' },
    { label: '99.9%', value: 12, color: '#f59e0b', label2: '8.7h' },
    { label: '99.99%', value: 1.5, color: '#22c55e', label2: '52m' },
    { label: '99.999%', value: 0.15, color: '#06b6d4', label2: '5m' },
  ]} color="blue" />,
  '99.8%': () => <FlowDiagram steps={['Service A: 99.9%', 'x Service B: 99.9%', '= 0.999 x 0.999', '= 99.8% composite']} color="amber" />,
  'Increase the composite SLA': () => <FlowDiagram steps={['Path A fails (0.1% chance)', 'Path B still works!', 'Both must fail: 0.0001%', 'Composite: 99.9999%']} color="emerald" />,
  'You get service credits (partial refund) if you file a claim': () => <FlowDiagram steps={['Azure outage detected', 'You document downtime', 'File claim within deadline', 'Get credits (not cash)']} color="blue" />,
  '0% — no SLA': () => <ServerDiagram label="Free Tier" items={['No uptime guarantee', 'No SLA at all', 'You get what you pay for']} color="gray" />,
  '99.99%': () => <CostDiagram bars={[
    { label: 'Single', value: 50, color: '#f59e0b', label2: '99.9%' },
    { label: 'AZ Set', value: 75, color: '#3b82f6', label2: '99.95%' },
    { label: 'Zones', value: 100, color: '#22c55e', label2: '99.99%' },
  ]} color="emerald" />,

  // Governance
  'Deleting the resource': () => <PermissionDiagram actions={[
    { label: 'Read', allowed: true },
    { label: 'Modify', allowed: true },
    { label: 'Delete', allowed: false },
  ]} color="amber" />,
  'Read resource properties only': () => <PermissionDiagram actions={[
    { label: 'Read', allowed: true },
    { label: 'Modify', allowed: false },
    { label: 'Delete', allowed: false },
  ]} color="emerald" />,
  'Audit or deny non-compliant deployments': () => <FlowDiagram steps={['Deploy request arrives', 'Policy evaluates rules', 'Compliant? -> Allow', 'Non-compliant? -> Deny/Audit']} color="blue" />,
  'Organizing resources and tracking costs': () => <ServerDiagram label="Tags" items={['env: production', 'team: backend', 'cost-center: 42', 'Filter billing by tag']} color="purple" />,
  'Azure Policy': () => <FlowDiagram steps={['Define policy rule', 'Assign to scope', 'Evaluate deployments', 'Audit or deny']} color="blue" />,
  'Resource Tags': () => <ServerDiagram label="Tags" items={['Key-value labels', 'Organize + track cost', 'Cannot enforce anything']} color="purple" />,
  'Resource Locks': () => <PermissionDiagram actions={[
    { label: 'CanNotDelete: block delete', allowed: false },
    { label: 'ReadOnly: block all writes', allowed: false },
  ]} color="amber" />,
  'Azure Monitor': () => <FlowDiagram steps={['Collect metrics/logs', 'Visualize dashboards', 'Send alerts', 'Does NOT prevent actions']} color="gray" />,
  'Define a repeatable set of Azure resources and policies': () => <ServerDiagram label="Blueprint" items={['ARM Templates', '+ Policy assignments', '+ RBAC assignments', '+ Resource Groups', 'Deploy together']} color="blue" />,

  // Responsibility
  'Microsoft (always)': () => <ServerDiagram label="Microsoft" items={['Physical datacenter', 'Guards, biometrics', 'Power, cooling', 'Always their job']} color="blue" />,
  'Microsoft': () => <ServerDiagram label="Microsoft" items={['Physical datacenter', 'Physical network', 'Physical hosts']} color="blue" />,
  'The customer': () => <ServerDiagram label="Customer (You)" items={['Your data', 'Your accounts', 'Your access policies']} color="amber" />,
  'Customer': () => <ServerDiagram label="Customer (You)" items={['Your data', 'Your accounts', 'Your access policies']} color="amber" />,
  'Shared': () => <ServerDiagram label="Shared" items={['MS: provides platform', 'You: configure it', 'Both responsible']} color="purple" />,
  'Accounts and identities they create': () => <ServerDiagram label="Your Accounts" items={['Who has access?', 'MFA enabled?', 'Permissions correct?', 'Always your job']} color="amber" />,
  'Applications': () => <StackDiagram layers={['Application (shifts)', 'IaaS: You manage', 'PaaS: Shared', 'SaaS: Microsoft']} managedByAzure={1} />,
  'Physical host maintenance': () => <ServerDiagram label="Physical Hosts" items={['Replace drives', 'BIOS updates', 'Cooling, power', 'Shifts to MS in IaaS']} color="blue" />,
  'Operating system and middleware': () => <ServerDiagram label="OS + Middleware" items={['PaaS handles these', 'No patching for you', 'No server config', 'Just deploy code']} color="blue" />,

  // Regions
  'Disaster recovery and business continuity': () => <FlowDiagram steps={['Region A: Primary', 'Region B: Paired backup', 'Region A goes down...', 'Failover to Region B']} color="purple" />,
  'Geographies and data residency': () => <RegionDiagram zones={2} label="Germany Geography" color="blue" />,
  'They protect against datacenter-level failures': () => <RegionDiagram zones={3} label="3 AZs = 3 Datacenters" color="blue" />,
  'Exactly one': () => <FlowDiagram steps={['East US <--> West US', '1 region = 1 pair', 'Always 1:1', 'Set by Microsoft']} color="purple" />,

  // Misc
  'Exactly one': () => <FlowDiagram steps={['Resource -> 1 RG only', 'Cannot straddle groups', 'Move it or delete it']} color="amber" />,
  'All resources inside are deleted': () => <FlowDiagram steps={['Delete Resource Group', 'VM-01: DELETED', 'SQL-DB: DELETED', 'Storage: DELETED', 'Everything gone.']} color="red" />,
  '6 levels': () => <HierarchyDiagram levels={[
    { label: 'Level 1', color: '#8b5cf6' },
    { label: 'Level 2', color: '#3b82f6' },
    { label: 'Level 3', color: '#06b6d4' },
    { label: 'Level 4-6...', color: '#22c55e' },
  ]} highlight="" />,
  'Are inherited by all child subscriptions and resource groups': () => <FlowDiagram steps={['Policy at MG level', '-> Inherited by Sub A', '-> Inherited by RG-1', '-> Inherited by all resources']} color="purple" />,
  'A role with specific permissions you define': () => <PermissionDiagram actions={[
    { label: 'Custom: Read VMs', allowed: true },
    { label: 'Custom: Start/Stop VMs', allowed: true },
    { label: 'Custom: Delete VMs', allowed: false },
    { label: 'You define each action', allowed: true },
  ]} color="blue" />,
}

function ConceptCard({ label, outline }) {
  const DiagramFn = diagrams[label]

  if (DiagramFn) {
    return (
      <div className={`rounded-lg p-4 border-2 ${outline} bg-surface-2`}>
        <div className="text-white font-medium text-sm mb-2 text-center">{label}</div>
        <DiagramFn />
      </div>
    )
  }

  // Fallback: simple text card
  return (
    <div className={`rounded-lg p-6 border-2 ${outline} bg-surface-2 text-center`}>
      <div className="text-white font-medium text-base">{label}</div>
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
          {/* Visual diagram comparison */}
          {!isCorrect ? (
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
          ) : (
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
