export const meta = {
  siteName:      'House Money Portfolio',
  domain:        'housemoneyportfolio.com',
  tagline:       'Institutional-grade trading discipline for self-directed investors.',
  description:   'HMP scans the markets, executes through your own brokerage account, and explains every decision in plain language. Your capital never leaves your custody.',
  twitterHandle: '@housemoneyportfolio',
}

export const nav = {
  signInUrl: 'https://app.housemoneyportfolio.com',
  links: [
    { label: 'Product',      href: '#product' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Founder',      href: '#founder' },
  ],
}

export const hero = {
  eyebrow:    'GOVERNANCE-FIRST TRADING',
  headline:   ['Institutional-grade', 'trading discipline', 'for self-directed investors.'],
  headlineAccentLine: 2, // 0-indexed line that gets primary color
  subheadline: 'HMP scans the markets, executes through your own brokerage account, and explains every decision in plain language. Your capital never leaves your custody.',
  ctaLabel:   'Join the waitlist',
  successMsg: "You're on the list. We'll be in touch before InvestFest 2026.",
  disclaimer: 'Private beta. Public launch at InvestFest 2026. No spam, no financial advice.',
  stats: [
    { label: 'PRODUCTION SERVICES', value: '55+' },
    { label: 'BROKER INTEGRATIONS', value: '13' },
    { label: 'DATA SOURCES',        value: '60+' },
    { label: 'RISK GATES',          value: '12' },
    { label: 'PLATFORM STATUS',     value: 'LIVE', highlight: true },
  ],
}

export const problem = {
  eyebrow:    'THE PROBLEM',
  headline:   'Self-directed investors are stuck choosing between three bad options.',
  subheadline: 'None of them give you what institutional desks have always had: disciplined, rules-based execution with real risk rails and a full audit trail of every decision.',
  options: [
    {
      icon:     'Activity',
      title:    'Trade manually',
      subtitle: 'Discipline is hard',
      desc:     "Emotion-driven decisions. No consistent rules. Wins fade, losses compound. The platform is the trader's own willpower.",
    },
    {
      icon:     'Lock',
      title:    'Use a robo-advisor',
      subtitle: 'Lose all control',
      desc:     'Hand custody to a black-box allocator. Generic portfolios, no flexibility, no insight into the why behind any decision.',
    },
    {
      icon:     'AlertCircle',
      title:    'Build a DIY bot',
      subtitle: 'No safety rails',
      desc:     'Stitch together TradingView scripts and broker APIs. No risk gates, no audit trail, no idea why it did what it did when something breaks.',
    },
  ],
}

export const product = {
  eyebrow:    'THE PRODUCT',
  headline:   'An engineering-grade trading desk that runs in the background.',
  subheadline: 'Multi-strategy scanners running against your brokerage account in real time. Every signal is policy-checked before it can fire.',
  caption:    'Preview of the live portfolio dashboard. Multi-desk capital allocation with per-desk risk governance.',
}

export const moats = {
  eyebrow:    'WHY HMP WINS',
  headline:   "Three structural choices competitors can't replicate.",
  subheadline: "These aren't features. They're architectural commitments made on day one. Features can be copied in a quarter. These cannot.",
  items: [
    {
      icon:   'Scale',
      title:  'Governance-first architecture',
      desc:   'Twelve policy gates sit inside the execution path itself. Kill switch, position limits, regime filter, drawdown guard, stop-loss enforcement. Retrofitting this into an existing platform would require a rewrite.',
      bullet: 'Built in, not bolted on',
    },
    {
      icon:   'Lock',
      title:  'BYOB custody — never an intermediary',
      desc:   "We connect through your own brokerage account via OAuth. HMP never holds customer funds, never sees credentials. That sidesteps the broker-dealer regulatory perimeter that slows competitors by 12 to 24 months.",
      bullet: 'Your capital stays with you',
    },
    {
      icon:   'Eye',
      title:  'Decision Trace — full provenance',
      desc:   'Every trade — taken or rejected — is recorded with a plain-language explanation. Why the signal fired, which gates it passed, why the order was approved. Not log files. A first-class product surface.',
      bullet: 'Every decision is auditable',
    },
  ],
}

export const founder = {
  eyebrow:      'THE FOUNDER',
  name:         'Quentrell Green',
  title:        'FOUNDER',
  headshotAlt:  'Quentrell Green, Founder',
  headline:     ['From building control planes for networks', 'to building one for capital.'],
  headlineAccentLine: 1,
  bio: [
    'I spent nearly two decades building enterprise network infrastructure where, one bad decision propagates fast and recovery is measured in customer impact. The hard problems weren\'t the routing protocols. They were policy enforcement, change control, blast radius containment, and audit.',
    'Trading platforms have the same problems. Most ignore them.',
    'HMP applies the engineering discipline of enterprise grade control planes to retail capital allocation. The result is a system designed for trust before it was designed for speed.',
  ],
  bioAccentIndex: 1,
}

export const cta = {
  headline:    ['Every self-directed investor deserves the same', 'governance and rigor institutions take for granted.'],
  headlineAccentLine: 1,
  subheadline: 'Private beta is open to a small group. Public launch at InvestFest 2026, Atlanta.',
  ctaLabel:    'Request access',
  successMsg:  "You're on the list.",
}

export const footer = {
  entity:  'House Money Portfolio LLC · Delaware',
  email:   'quentrell@housemoneyportfolio.com',
  links: [
    { label: 'Privacy Policy',   href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
  legal: 'HMP is a software platform. HMP is not a broker-dealer, investment adviser, or financial intermediary. HMP does not hold customer funds or securities. Trades execute through the user\'s own brokerage account via OAuth. Nothing on this site constitutes financial advice.',
}
