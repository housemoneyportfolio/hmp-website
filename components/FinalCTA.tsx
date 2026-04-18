import { colors } from '@/lib/brand'
import { cta } from '@/lib/content'
import WaitlistForm from './WaitlistForm'

export default function FinalCTA() {
  return (
    <section style={{
      background: colors.primaryDarker, padding: '80px 24px',
      color: colors.bgWhite, position: 'relative', overflow: 'hidden',
    }}>
      {/* Gold bar at top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: colors.gold }} />

      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800,
          lineHeight: 1.15, letterSpacing: -1, margin: '0 0 16px',
        }}>
          {cta.headline.map((line, i) => (
            <span key={i} style={{ display: 'block', color: i === cta.headlineAccentLine ? colors.goldLight : colors.bgWhite }}>
              {line}
            </span>
          ))}
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.8)', lineHeight: 1.55, margin: '0 0 40px', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
          {cta.subheadline}
        </p>

        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <WaitlistForm
            ctaLabel={cta.ctaLabel}
            successMsg={cta.successMsg}
            size="large"
            showArrow
            goldButton
          />
        </div>
      </div>
    </section>
  )
}
