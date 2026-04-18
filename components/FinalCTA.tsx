import { colors, borders } from '@/lib/brand'
import { finalCta } from '@/lib/content'
import WaitlistForm from './WaitlistForm'

export default function FinalCTA() {
  return (
    <section
      style={{
        padding: '96px 24px',
        backgroundColor: colors.primary,
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Gold accent bar */}
        <div
          style={{
            display: 'inline-block',
            width: 48,
            height: 4,
            backgroundColor: colors.accent,
            borderRadius: 2,
            marginBottom: 28,
          }}
        />

        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 700,
            color: '#fff',
            marginBottom: 16,
            letterSpacing: '-0.01em',
          }}
        >
          {finalCta.headline}
        </h2>
        <p
          style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.8)',
            marginBottom: 40,
            lineHeight: 1.6,
          }}
        >
          {finalCta.subheadline}
        </p>

        <div
          style={{
            maxWidth: 480,
            margin: '0 auto',
            // Override input border color for dark background
          }}
        >
          <WaitlistForm ctaLabel={finalCta.ctaLabel} size="large" />
        </div>
      </div>
    </section>
  )
}
