// Single source of truth for all marketing copy.
// Replace placeholder values with final copy before launch.

export const meta = {
  siteName:    'House Money Portfolio',
  domain:      'housemoneyportfolio.com',
  tagline:     'The intelligent portfolio tracker built for serious retail investors.',
  description: 'House Money Portfolio consolidates your brokerage accounts, surfaces actionable signals, and gives you the edge that institutional traders take for granted.',
  twitterHandle: '@housemoneyportfolio',
}

export const nav = {
  signInUrl: 'https://app.housemoneyportfolio.com/sign-in',
  ctaLabel:  'Join Waitlist',
  signInLabel: 'Sign in',
}

export const hero = {
  headline:    'Stop guessing. Start knowing.',
  subheadline: 'House Money Portfolio surfaces the signals professional traders use — built for the retail investor who takes their portfolio seriously.',
  ctaLabel:    'Get Early Access',
  ctaSubtext:  'Free during beta. No credit card required.',
}

export const credibility = {
  stats: [
    { value: '55+',  label: 'Integrations' },
    { value: '13',   label: 'Brokers supported' },
    { value: '60+',  label: 'Data sources' },
  ],
  // TODO: verify these numbers against current platform state before launch
}

export const problem = {
  headline: 'Retail investors are flying blind.',
  body: [
    'Your brokerage gives you a chart and a balance. That\'s it.',
    'Meanwhile, institutional desks run quantitative signals, cross-asset correlation models, and risk attribution — on every position, in real time.',
    'We built House Money Portfolio to close that gap.',
  ],
}

export const moats = [
  {
    icon:        'BarChart2',
    title:       'Unified Portfolio View',
    description: 'Connect all your accounts — brokerage, crypto, retirement — into one real-time dashboard. No more spreadsheets.',
  },
  {
    icon:        'Zap',
    title:       'Actionable Signals',
    description: 'Momentum, mean-reversion, and cross-asset signals surfaced as plain-language alerts — not raw data dumps.',
  },
  {
    icon:        'Shield',
    title:       'Risk Attribution',
    description: 'Know exactly which positions are driving your volatility, and how correlated you are to the macro tape.',
  },
]

export const founder = {
  name:       'Quentrell Green',
  title:      'Founder & CEO, House Money Portfolio',
  headshotAlt: 'Quentrell Green, Founder of House Money Portfolio',
  bio: [
    'I built the tools I wished existed when I started investing.',
    'After years of managing my own portfolio across too many tabs, brokerage apps, and spreadsheets, I decided to build something better — something that gives everyday investors the same information advantage that institutional desks take for granted.',
    'House Money Portfolio is that tool.',
  ],
}

export const finalCta = {
  headline: 'Be first in line.',
  subheadline: 'We\'re opening beta access to a limited number of investors before public launch.',
  ctaLabel:    'Get Early Access',
}

export const footer = {
  tagline: 'Built for the investor who means business.',
  links: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
  legal: `© ${new Date().getFullYear()} House Money Portfolio. All rights reserved. Not financial advice.`,
}
