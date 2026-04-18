import { colors } from '@/lib/brand'
import { problem } from '@/lib/content'

export default function ProblemSection() {
  return (
    <section style={{ padding: '80px 24px', backgroundColor: colors.bgDefault }}>
      <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700,
            color: colors.textPrimary,
            marginBottom: 32,
            letterSpacing: '-0.01em',
          }}
        >
          {problem.headline}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {problem.body.map((para, i) => (
            <p
              key={i}
              style={{
                fontSize: 18,
                lineHeight: 1.7,
                color: i === problem.body.length - 1 ? colors.primaryDark : colors.textSecondary,
                fontWeight: i === problem.body.length - 1 ? 600 : 400,
              }}
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
