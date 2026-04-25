// ═══════════════════════════════════════════════
//  FORGEINFRA — CONFIG CENTRALE
//  Changer le nom/domaine/couleurs ICI SEULEMENT
// ═══════════════════════════════════════════════

export const BRAND = {
  name:        'ForgeInfra',
  tagline:     'Infrastructure provisioning, automated.',
  domain:      'forgeinfra.com',
  email:       'hello@forgeinfra.com',
  github:      'https://github.com/msr-infratech',
  accent:      '#00e87a',
  accentDim:   'rgba(0,232,122,0.12)',
  accentGlow:  'rgba(0,232,122,0.22)',
}

export const NAV_LINKS = [
  { label: 'Features',     href: '#features' },
  { label: 'How it works', href: '#how'      },
  { label: 'Pricing',      href: '#pricing'  },
  { label: 'Docs',         href: '#docs'     },
]

export const STATS = [
  { value: '0',     label: 'Inbound ports needed' },
  { value: '<3min', label: 'Bootstrap time'        },
  { value: 'GPG',   label: 'Signed delivery'       },
  { value: '100%',  label: 'Code stays private'    },
]

export const FEATURES = [
  { icon: '⚡', title: 'Multi-tenant isolation',  desc: 'One git branch per client. One JWT token per client. One Vault path per client. Zero cross-contamination.' },
  { icon: '🔐', title: 'Licence enforcement',     desc: 'JWT checked at every state.apply. Revoke any client instantly. Expired tokens stop execution cold.' },
  { icon: '🛡',  title: 'Code never exposed',      desc: 'States and pillars compiled server-side. Clients receive executed results — not source. Your IP stays yours.' },
  { icon: '⚙',  title: 'GitOps native',           desc: 'States on main, pillars on per-client branches. Git history is your audit log. PR workflow applies cleanly.' },
  { icon: '🚀', title: 'One-command onboarding',  desc: 'Client runs one curl | bash. Script is GPG-signed. Minion configured, highstate applied. No SSH from your side.' },
  { icon: '📊', title: 'Usage dashboard',         desc: 'Per-client execution logs, state history, licence expiry alerts. Billable events tracked automatically.' },
]

export const STEPS = [
  { num: '01 / SIGNUP',    title: 'Client signs up',           desc: 'Fills network config, chooses modules. Licence created, Gitea branch provisioned automatically.' },
  { num: '02 / EMAIL',     title: 'Receives one-line command', desc: 'Email contains a curl command with embedded signed token. Client pastes it on their server as root.' },
  { num: '03 / INSTALL',   title: 'Minion installs',           desc: 'Script verifies GPG signature, installs Salt Minion, injects config pointing to your Salt API proxy.' },
  { num: '04 / PROVISION', title: 'Servers ready',             desc: 'JWT checked, pillars fetched, states compiled server-side, applied to client servers. Done.' },
]

export const PLANS = [
  {
    tier: 'Starter', price: '€490', period: '/ year / client', hot: false,
    features: ['Up to 10 managed nodes', 'All Salt states included', 'Email support', '1 environment (prod)'],
    cta: 'Get started', ctaStyle: 'ghost',
  },
  {
    tier: 'Business', price: '€1,490', period: '/ year / client', hot: true,
    features: ['Up to 100 managed nodes', 'Custom Salt modules', 'Priority support', '3 environments', 'Dashboard access'],
    cta: 'Get started', ctaStyle: 'solid',
  },
  {
    tier: 'Enterprise', price: 'Custom', period: 'annual contract', hot: false,
    features: ['Unlimited nodes', 'Custom state development', 'Dedicated engineer', 'On-prem Salt API option', 'White-label available'],
    cta: 'Contact sales', ctaStyle: 'ghost',
  },
]
