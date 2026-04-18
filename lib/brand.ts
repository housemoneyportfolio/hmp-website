export const colors = {
  primary:       '#0D9B7A',
  primaryLight:  '#19c49b',
  primaryDark:   '#087A5E',
  accent:        '#e1a73a',
  accentDark:    '#C4922A',
  bgDefault:     '#F8F9FB',
  bgPaper:       '#FFFFFF',
  textPrimary:   'rgba(0,0,0,0.87)',
  textSecondary: 'rgba(0,0,0,0.54)',
  textDisabled:  'rgba(0,0,0,0.38)',
  border:        'rgba(0,0,0,0.08)',
  success:       '#0D9B7A',
  error:         '#DC3545',
  warning:       '#E8A317',
  info:          '#2F7BCA',
} as const

export const shadows = {
  card: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
} as const

export const borders = {
  card:   '1px solid rgba(0,0,0,0.06)',
  radius: {
    card:   '12px',
    button: '8px',
    pill:   '999px',
  },
} as const

export const typography = {
  fontFamily: 'Inter, sans-serif',
  weights: [400, 500, 600, 700] as const,
} as const
