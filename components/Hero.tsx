import { colors, borders } from '@/lib/brand'
import { hero, meta } from '@/lib/content'
import WaitlistForm from './WaitlistForm'

export default function Hero() {
  return (
    <section
      style={{
        backgroundColor: colors.bgDefault,
        padding: '96px 24px 80px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div
          style={{
            display: 'inline-block',
            padding: '6px 16px',
            backgroundColor: `${colors.primary}18`,
            border: `1px solid ${colors.primary}40`,
            borderRadius: borders.radius.pill,
            fontSize: 13,
            fontWeight: 600,
            color: colors.primaryDark,
            marginBottom: 24,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          Now in beta
        </div>

        <h1
          style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 700,
            lineHeight: 1.1,
            color: colors.textPrimary,
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }}
        >
          {hero.headline}
        </h1>

        <p
          style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            lineHeight: 1.6,
            color: colors.textSecondary,
            marginBottom: 40,
            maxWidth: 580,
            margin: '0 auto 40px',
          }}
        >
          {hero.subheadline}
        </p>

        <div style={{ maxWidth: 480, margin: '0 auto 16px' }}>
          <WaitlistForm ctaLabel={hero.ctaLabel} size="large" />
        </div>

        <p style={{ fontSize: 13, color: colors.textDisabled }}>{hero.ctaSubtext}</p>

        <p
          style={{
            marginTop: 48,
            fontSize: 12,
            color: colors.textDisabled,
            fontStyle: 'italic',
          }}
        >
          Not financial advice. {meta.siteName} is a portfolio tracking and analytics tool.
        </p>
      </div>
    </section>
  )
}
