import { Activity, Lock, AlertCircle } from 'lucide-react'
import { colors } from '@/lib/brand'
import { problem } from '@/lib/content'

const iconMap = { Activity, Lock, AlertCircle }

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

export default function ProblemSection() {
  return (
    <section style={{
      background: colors.bgPaper, padding: '100px 24px',
      borderTop: `1px solid ${colors.borderLight}`,
      borderBottom: `1px solid ${colors.borderLight}`,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionEyebrow>{problem.eyebrow}</SectionEyebrow>
        <h2 style={{
          fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800,
          lineHeight: 1.15, letterSpacing: -1, margin: '0 0 16px', maxWidth: 780,
        }}>
          {problem.headline}
        </h2>
        <p style={{ fontSize: 17, color: colors.textSecondary, maxWidth: 640, margin: '0 0 56px', lineHeight: 1.55 }}>
          {problem.subheadline}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {problem.options.map((opt) => {
            const Icon = iconMap[opt.icon as keyof typeof iconMap]
            return (
              <div key={opt.title} style={{
                background: colors.bgWhite, border: `1px solid ${colors.borderLight}`,
                borderRadius: 12, padding: '28px 28px 32px',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Red top bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: colors.danger }} />
                <div style={{
                  width: 44, height: 44, background: 'rgba(239,68,68,0.1)', borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: colors.danger, marginBottom: 20,
                }}>
                  {Icon && <Icon size={22} />}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px', letterSpacing: -0.3 }}>
                  {opt.title}
                </h3>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.danger, letterSpacing: 0.8, marginBottom: 14 }}>
                  {opt.subtitle.toUpperCase()}
                </div>
                <p style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.6, margin: 0 }}>
                  {opt.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
