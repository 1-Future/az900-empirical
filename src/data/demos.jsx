import { CloudModelsDemo } from '../demos/CloudModels'
import { SharedResponsibilityDemo } from '../demos/SharedResponsibility'
import { RegionsDemo } from '../demos/Regions'
import { ResourceHierarchyDemo } from '../demos/ResourceHierarchy'
import { ComputeDemo } from '../demos/Compute'
import { NetworkingDemo } from '../demos/Networking'
import { StorageDemo } from '../demos/Storage'
import { IdentityDemo } from '../demos/Identity'
import { CostDemo } from '../demos/Cost'
import { SLADemo } from '../demos/SLA'
import { GovernanceDemo } from '../demos/Governance'
import { RBACDemo } from '../demos/RBAC'

export const demos = [
  {
    id: 'cloud-models',
    title: 'IaaS vs PaaS vs SaaS',
    acronyms: ['IaaS', 'PaaS', 'SaaS'],
    domain: 'Cloud Concepts',
    weight: '25-30%',
    desc: 'Drag services into the right cloud model. See what you manage vs what Azure manages.',
    sandbox: 'https://learn.microsoft.com/en-us/training/modules/describe-cloud-service-types/',
    Component: CloudModelsDemo,
    questions: [
      { q: 'Which cloud model gives you the MOST control over hardware?', choices: ['IaaS', 'PaaS', 'SaaS'], answer: 0 },
      { q: 'Azure App Service is an example of which model?', choices: ['IaaS', 'PaaS', 'SaaS'], answer: 1 },
      { q: 'Microsoft 365 is an example of which model?', choices: ['IaaS', 'PaaS', 'SaaS'], answer: 2 },
      { q: 'In which model does the customer manage the OS?', choices: ['IaaS', 'PaaS', 'SaaS'], answer: 0 },
    ],
  },
  {
    id: 'shared-responsibility',
    title: 'Shared Responsibility Model',
    acronyms: ['SRM'],
    domain: 'Cloud Concepts',
    weight: '25-30%',
    desc: 'Toggle between cloud models and see who is responsible for what.',
    sandbox: 'https://learn.microsoft.com/en-us/training/modules/describe-cloud-compute/4-describe-shared-responsibility-model',
    Component: SharedResponsibilityDemo,
    questions: [
      { q: 'Who is ALWAYS responsible for the data and access management?', choices: ['Microsoft', 'Customer', 'Shared'], answer: 1 },
      { q: 'Physical security of the datacenter is whose responsibility?', choices: ['Microsoft', 'Customer', 'Shared'], answer: 0 },
      { q: 'In IaaS, who manages the operating system?', choices: ['Microsoft', 'Customer', 'Shared'], answer: 1 },
    ],
  },
  {
    id: 'regions',
    title: 'Regions & Availability Zones',
    acronyms: ['AZ', 'Region Pair', 'Sovereign'],
    domain: 'Architecture & Services',
    weight: '35-40%',
    desc: 'Click regions on a world map. See availability zones, region pairs, and latency.',
    sandbox: 'https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/5-describe-azure-physical-infrastructure',
    Component: RegionsDemo,
    questions: [
      { q: 'What is the minimum number of availability zones in a region that supports them?', choices: ['1', '2', '3'], answer: 2 },
      { q: 'Region pairs are used primarily for...', choices: ['Lower cost', 'Disaster recovery', 'Faster compute'], answer: 1 },
      { q: 'Azure Government is an example of a...', choices: ['Region pair', 'Sovereign region', 'Availability zone'], answer: 1 },
    ],
  },
  {
    id: 'resource-hierarchy',
    title: 'Resource Hierarchy',
    acronyms: ['MG', 'Sub', 'RG'],
    domain: 'Architecture & Services',
    weight: '35-40%',
    desc: 'Build a resource hierarchy: management groups, subscriptions, resource groups, resources.',
    sandbox: 'https://learn.microsoft.com/en-us/training/modules/describe-core-architectural-components-of-azure/6-describe-azure-management-infrastructure',
    Component: ResourceHierarchyDemo,
    questions: [
      { q: 'What is the TOP level of the Azure resource hierarchy?', choices: ['Subscription', 'Management Group', 'Resource Group'], answer: 1 },
      { q: 'A resource can belong to how many resource groups?', choices: ['1', '2', 'Unlimited'], answer: 0 },
      { q: 'Which can contain multiple subscriptions?', choices: ['Resource Group', 'Management Group', 'Resource'], answer: 1 },
    ],
  },
  {
    id: 'compute',
    title: 'Compute Services',
    acronyms: ['VM', 'ACI', 'AKS', 'Functions'],
    domain: 'Architecture & Services',
    weight: '35-40%',
    desc: 'Compare VMs, containers, and serverless. See when each one makes sense.',
    sandbox: 'https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/',
    Component: ComputeDemo,
    questions: [
      { q: 'Which compute option runs code ONLY when triggered (no idle cost)?', choices: ['VMs', 'AKS', 'Azure Functions'], answer: 2 },
      { q: 'Which service is best for lift-and-shift migrations?', choices: ['Azure Functions', 'VMs', 'App Service'], answer: 1 },
      { q: 'AKS is used for orchestrating...', choices: ['VMs', 'Containers', 'Functions'], answer: 1 },
    ],
  },
  {
    id: 'networking',
    title: 'Networking & NSGs',
    acronyms: ['VNet', 'NSG', 'Subnet', 'LB', 'VPN', 'ExpressRoute'],
    domain: 'Architecture & Services',
    weight: '35-40%',
    desc: 'Build a virtual network, add subnets, attach NSG rules, and watch traffic flow.',
    sandbox: 'https://learn.microsoft.com/en-us/training/modules/describe-azure-compute-networking-services/8-describe-azure-virtual-networking',
    Component: NetworkingDemo,
    questions: [
      { q: 'NSG rules filter traffic based on...', choices: ['Cost', 'IP, port, and protocol', 'Region only'], answer: 1 },
      { q: 'ExpressRoute provides what kind of connection?', choices: ['Public internet VPN', 'Private dedicated link', 'Free tunnel'], answer: 1 },
      { q: 'A VNet is scoped to a single...', choices: ['Subscription', 'Region', 'Resource group'], answer: 1 },
    ],
  },
  {
    id: 'storage',
    title: 'Storage Services',
    acronyms: ['Blob', 'File', 'Queue', 'Table', 'LRS', 'GRS', 'ZRS'],
    domain: 'Architecture & Services',
    weight: '35-40%',
    desc: 'Drag data types into the right storage service. See redundancy options visually.',
    sandbox: 'https://learn.microsoft.com/en-us/training/modules/describe-azure-storage-services/',
    Component: StorageDemo,
    questions: [
      { q: 'Which storage is best for unstructured data like images and videos?', choices: ['Table', 'Queue', 'Blob'], answer: 2 },
      { q: 'GRS replicates data to...', choices: ['Same datacenter', 'A paired region', 'All regions'], answer: 1 },
      { q: 'Azure Files supports which protocol?', choices: ['HTTP only', 'SMB and NFS', 'FTP'], answer: 1 },
    ],
  },
  {
    id: 'identity',
    title: 'Identity & Entra ID',
    acronyms: ['AAD/Entra ID', 'MFA', 'SSO', 'Conditional Access'],
    domain: 'Architecture & Services',
    weight: '35-40%',
    desc: 'Simulate login flows with MFA, conditional access policies, and SSO.',
    sandbox: 'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/',
    Component: IdentityDemo,
    questions: [
      { q: 'Microsoft Entra ID is the new name for...', choices: ['Azure AD', 'Active Directory DS', 'Azure Key Vault'], answer: 0 },
      { q: 'MFA requires at least how many verification methods?', choices: ['1', '2', '3'], answer: 1 },
      { q: 'Conditional Access policies can block access based on...', choices: ['Time of day only', 'Location, device, risk level', 'Username only'], answer: 1 },
    ],
  },
  {
    id: 'rbac',
    title: 'Role-Based Access Control',
    acronyms: ['RBAC', 'Role', 'Scope', 'Least Privilege'],
    domain: 'Management & Governance',
    weight: '30-35%',
    desc: 'Assign roles to users at different scopes. Try to access resources and see what happens.',
    sandbox: 'https://learn.microsoft.com/en-us/training/modules/describe-azure-identity-access-security/4-describe-azure-role-based-access-control',
    Component: RBACDemo,
    questions: [
      { q: 'RBAC roles can be assigned at which level?', choices: ['Resource group only', 'Management group, subscription, RG, or resource', 'Subscription only'], answer: 1 },
      { q: 'The principle of least privilege means...', choices: ['Give everyone Owner', 'Grant only needed permissions', 'Deny all access'], answer: 1 },
      { q: 'Which built-in role has full access to all resources?', choices: ['Reader', 'Contributor', 'Owner'], answer: 2 },
    ],
  },
  {
    id: 'cost',
    title: 'Cost Management',
    acronyms: ['TCO', 'CapEx', 'OpEx', 'Reserved', 'Spot'],
    domain: 'Management & Governance',
    weight: '30-35%',
    desc: 'Slide resource sliders and watch your Azure bill change in real time.',
    sandbox: 'https://learn.microsoft.com/en-us/training/modules/describe-cost-management-azure/',
    Component: CostDemo,
    questions: [
      { q: 'Cloud computing shifts spending from CapEx to...', choices: ['CapEx', 'OpEx', 'Neither'], answer: 1 },
      { q: 'Reserved instances save money by committing to...', choices: ['1 or 3 years', '1 month', 'Pay-as-you-go'], answer: 0 },
      { q: 'The TCO calculator helps estimate savings from...', choices: ['Migrating to Azure', 'Buying new hardware', 'Hiring staff'], answer: 0 },
    ],
  },
  {
    id: 'sla',
    title: 'SLAs & Uptime',
    acronyms: ['SLA', 'RTO', 'RPO', 'Composite SLA'],
    domain: 'Management & Governance',
    weight: '30-35%',
    desc: 'Combine services and calculate composite SLAs. See how many minutes of downtime each means.',
    sandbox: 'https://learn.microsoft.com/en-us/training/modules/describe-features-tools-azure-for-governance-compliance/6-describe-purpose-of-service-level-agreements',
    Component: SLADemo,
    questions: [
      { q: '99.99% uptime means roughly how much downtime per year?', choices: ['~5 minutes', '~52 minutes', '~8.7 hours'], answer: 1 },
      { q: 'Combining two 99.9% SLA services gives a composite SLA of...', choices: ['99.9%', '99.99%', '99.8%'], answer: 2 },
      { q: 'Adding redundancy to a service can...', choices: ['Lower the SLA', 'Increase the composite SLA', 'Has no effect'], answer: 1 },
    ],
  },
  {
    id: 'governance',
    title: 'Governance Tools',
    acronyms: ['Policy', 'Blueprints', 'Resource Locks', 'Tags'],
    domain: 'Management & Governance',
    weight: '30-35%',
    desc: 'Apply policies, locks, and tags to resources. See what gets blocked.',
    sandbox: 'https://learn.microsoft.com/en-us/training/modules/describe-features-tools-azure-for-governance-compliance/',
    Component: GovernanceDemo,
    questions: [
      { q: 'A "CanNotDelete" lock prevents...', choices: ['Reading the resource', 'Deleting the resource', 'Modifying the resource'], answer: 1 },
      { q: 'Azure Policy can automatically...', choices: ['Delete non-compliant resources', 'Audit or deny non-compliant deployments', 'Create resources'], answer: 1 },
      { q: 'Tags are used for...', choices: ['Security only', 'Organizing and tracking costs', 'Networking'], answer: 1 },
    ],
  },
]
