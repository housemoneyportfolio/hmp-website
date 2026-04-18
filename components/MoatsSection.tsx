import { Scale, Lock, Eye, CheckCircle2 } from 'lucide-react'
import { colors } from '@/lib/brand'
import { moats } from '@/lib/content'

const iconMap = { Scale, Lock, Eye }

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 12, fontWeight: 700, letterSpacing: 2,
      color: colors.primary, marginBottom: 16,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ width: 24, height: 2, background: colors.primary, display: 'inline-block' }} />
      {children}
    </div>
  )
}

export default function MoatsSection() {
  return (
    <section id="how-it-works" style={{
      padding: '100px 24px', background: colors.bgPaper,
      borderTop: `1px solid ${colors.borderLight}`,
      borderBottom: `1px solid ${colors.borderLight}`,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionEyebrow>{moats.eyebrow}</SectionEyebrow>
        <h2 style={{
          fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800,
          lineHeight: 1.15, letterSpacing: -1, margin: '0 0 16px', maxWidth: 780,
        }}>
          {moats.headline}
        </h2>
        <p style={{ fontSize: 17, color: colors.textSecondary, maxWidth: 640, margin: '0 0 56px', lineHeight: 1.55 }}>
          {moats.subheadline}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {moats.items.map(m => {
            const Icon = iconMap[m.icon as keyof typeof iconMap]
            return (
              <div key={m.title} style={{
                background: colors.bgWhite, border: `1px solid ${colors.borderLight}`,
                borderRadius: 12, padding: 32,
              }}>
                <div style={{
                  width: 52, height: 52, background: colors.accentPale, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: colors.primary, marginBottom: 24,
                }}>
                  {Icon && <Icon size={26} />}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px', letterSpacing: -0.3, lineHeight: 1.25 }}>
                  {m.title}
                </h3>
                <p style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.65, margin: '0 0 20px' }}>
                  {m.desc}
                </p>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '6px 12px', background: colors.accentPale, borderRadius: 6,
                  fontSize: 12, fontWeight: 700, color: colors.primaryDeep, letterSpacing: 0.3,
                }}>
                  <CheckCircle2 size={14} color={colors.primary} />
                  {m.bullet}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
