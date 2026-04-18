import { BarChart2, Zap, Shield, type LucideProps } from 'lucide-react'
import { colors, borders, shadows } from '@/lib/brand'
import { moats } from '@/lib/content'

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  BarChart2,
  Zap,
  Shield,
}

export default function MoatsSection() {
  return (
    <section style={{ padding: '80px 24px', backgroundColor: colors.bgDefault }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              color: colors.textPrimary,
              marginBottom: 12,
              letterSpacing: '-0.01em',
            }}
          >
            Built different
          </h2>
          <p style={{ fontSize: 18, color: colors.textSecondary, maxWidth: 480, margin: '0 auto' }}>
            Three things no other retail portfolio tool does well. We do all three.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          {moats.map(moat => {
            const Icon = iconMap[moat.icon]
            return (
              <div
                key={moat.title}
                style={{
                  backgroundColor: colors.bgPaper,
                  border: borders.card,
                  borderRadius: borders.radius.card,
                  boxShadow: shadows.card,
                  padding: 32,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: borders.radius.button,
                    backgroundColor: `${colors.primary}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                  }}
                >
                  {Icon && <Icon size={24} color={colors.primary} />}
                </div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: colors.textPrimary,
                    marginBottom: 10,
                  }}
                >
                  {moat.title}
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: colors.textSecondary }}>
                  {moat.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
