import { Shield, ArrowRight, CheckCircle2 } from 'lucide-react'
import { colors } from '@/lib/brand'
import { hero } from '@/lib/content'
import WaitlistForm from './WaitlistForm'

export default function Hero() {
  return (
    <section style={{ padding: '80px 24px 100px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ maxWidth: 860 }}>
        {/* Eyebrow */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 14px', background: colors.accentPale, borderRadius: 100,
          fontSize: 12, fontWeight: 700, color: colors.primaryDeep, letterSpacing: 0.8, marginBottom: 28,
        }}>
          <Shield size={14} />
          {hero.eyebrow}
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(36px, 5.5vw, 64px)', fontWeight: 800,
          lineHeight: 1.05, letterSpacing: -1.5, margin: '0 0 24px',
          color: colors.textPrimary,
        }}>
          {hero.headline.map((line, i) => (
            <span key={i} style={{ display: 'block', color: i === hero.headlineAccentLine ? colors.primary : colors.textPrimary }}>
              {line}
            </span>
          ))}
        </h1>

        <p style={{ fontSize: 19, lineHeight: 1.55, color: colors.textSecondary, margin: '0 0 40px', maxWidth: 640 }}>
          {hero.subheadline}
        </p>

        {/* Waitlist form */}
        <div style={{ maxWidth: 480 }}>
          <WaitlistForm ctaLabel={hero.ctaLabel} size="large" showArrow />
        </div>

        <p style={{ fontSize: 13, color: colors.textMuted, margin: '16px 0 0' }}>
          {hero.disclaimer}
        </p>
      </div>

      {/* Stats strip */}
      <div style={{
        marginTop: 80, paddingTop: 32,
        borderTop: `1px solid ${colors.borderLight}`,
        display: 'flex', flexWrap: 'wrap', gap: '32px 48px',
      }}>
        {hero.stats.map(stat => (
          <div key={stat.label}>
            <div style={{ fontSize: 10, letterSpacing: 1.4, color: colors.textMuted, marginBottom: 6, fontWeight: 700 }}>
              {stat.label}
            </div>
            <div style={{
              fontSize: 20, fontWeight: 700,
              color: stat.highlight ? colors.primary : colors.textPrimary,
              display: 'flex', alignItems: 'center', gap: 8,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {stat.highlight && (
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: colors.accent, display: 'inline-block',
                  boxShadow: `0 0 0 3px ${colors.accentPale}`,
                }} />
              )}
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
