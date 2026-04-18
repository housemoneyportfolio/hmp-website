import { colors, borders, shadows } from '@/lib/brand'

export default function SignalsPreview() {
  return (
    <section
      style={{
        padding: '80px 24px',
        backgroundColor: colors.bgPaper,
        borderTop: `1px solid ${colors.border}`,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <h2
          style={{
            fontSize: 'clamp(24px, 3vw, 36px)',
            fontWeight: 700,
            color: colors.textPrimary,
            marginBottom: 12,
            letterSpacing: '-0.01em',
          }}
        >
          Signals at a glance
        </h2>
        <p
          style={{
            fontSize: 16,
            color: colors.textSecondary,
            marginBottom: 40,
            maxWidth: 520,
            margin: '0 auto 40px',
          }}
        >
          Real-time momentum, mean-reversion, and cross-asset signals — surfaced as plain-language alerts across your entire portfolio.
        </p>

        {/* Screenshot placeholder — replace with real app screenshot before launch */}
        <div
          style={{
            backgroundColor: colors.bgDefault,
            border: borders.card,
            borderRadius: borders.radius.card,
            boxShadow: shadows.card,
            overflow: 'hidden',
            aspectRatio: '16/9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: `${colors.primary}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <div style={{ width: 28, height: 28, backgroundColor: colors.primary, borderRadius: 4 }} />
            </div>
            <p style={{ color: colors.textDisabled, fontSize: 14 }}>
              App screenshot coming soon
            </p>
          </div>
        </div>

        <p
          style={{
            marginTop: 16,
            fontSize: 13,
            color: colors.textDisabled,
            fontStyle: 'italic',
          }}
        >
          Actual interface. Data shown is illustrative.
        </p>
      </div>
    </section>
  )
}
