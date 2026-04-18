export const colors = {
  primary:        '#0D9B7A',
  primaryLight:   '#19c49b',
  primaryDeep:    '#118a6f',
  primaryDark:    '#0A7057',
  primaryDarker:  '#064D3D',

  accent:         '#10B981',
  accentLight:    '#34D399',
  accentPale:     '#D1FAE5',

  gold:           '#e1a73a',
  goldLight:      '#F5C261',
  goldPale:       '#FEF3D8',

  bgWhite:        '#FFFFFF',
  bgPaper:        '#FAFBFC',
  bgMuted:        '#F5F7FA',
  bgSubtle:       '#EEF2F7',

  textPrimary:    'rgba(0,0,0,0.87)',
  textSecondary:  '#475569',
  textMuted:      '#94A3B8',

  borderLight:    'rgba(15, 23, 42, 0.08)',
  borderMid:      'rgba(15, 23, 42, 0.14)',

  success:        '#10B981',
  warning:        '#F59E0B',
  danger:         '#EF4444',
} as const

export const shadows = {
  card:      '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
  dashboard: '0 20px 50px -20px rgba(13,155,122,0.2), 0 8px 24px -12px rgba(0,0,0,0.08)',
} as const

export const borders = {
  card:   `1px solid rgba(15,23,42,0.08)`,
  radius: {
    card:   '12px',
    button: '8px',
    pill:   '999px',
  },
} as const
