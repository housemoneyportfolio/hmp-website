import { colors, borders, shadows } from '@/lib/brand'
import { credibility } from '@/lib/content'

export default function CredibilityStrip() {
  return (
    <section
      style={{
        backgroundColor: colors.bgPaper,
        borderTop: `1px solid ${colors.border}`,
        borderBottom: `1px solid ${colors.border}`,
        padding: '40px 24px',
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        {credibility.stats.map(stat => (
          <div
            key={stat.label}
            style={{
              textAlign: 'center',
              padding: '24px 40px',
              backgroundColor: colors.bgDefault,
              borderRadius: borders.radius.card,
              border: borders.card,
              boxShadow: shadows.card,
              minWidth: 160,
            }}
          >
            <div
              style={{
                fontSize: 40,
                fontWeight: 700,
                color: colors.primary,
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: 14, color: colors.textSecondary, fontWeight: 500 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
