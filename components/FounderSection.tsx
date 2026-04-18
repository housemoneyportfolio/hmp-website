import Image from 'next/image'
import { colors, borders, shadows } from '@/lib/brand'
import { founder } from '@/lib/content'

export default function FounderSection() {
  return (
    <section
      style={{
        padding: '80px 24px',
        backgroundColor: colors.bgPaper,
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: '0 auto',
          display: 'flex',
          gap: 48,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Headshot with emerald accent ring */}
        <div style={{ flexShrink: 0, margin: '0 auto' }}>
          <div
            style={{
              width: 168,
              height: 168,
              borderRadius: '50%',
              padding: 4,
              background: `linear-gradient(135deg, ${colors.primaryLight}, ${colors.primary})`,
              boxShadow: shadows.card,
            }}
          >
            <Image
              src="/founder/quentrell-green.jpg"
              alt={founder.headshotAlt}
              width={160}
              height={160}
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        </div>

        {/* Bio */}
        <div style={{ flex: '1 1 300px' }}>
          <div
            style={{
              display: 'inline-block',
              width: 40,
              height: 4,
              backgroundColor: colors.accent,
              borderRadius: 2,
              marginBottom: 20,
            }}
          />
          {founder.bio.map((para, i) => (
            <p
              key={i}
              style={{
                fontSize: i === 0 ? 20 : 16,
                fontWeight: i === 0 ? 600 : 400,
                lineHeight: 1.7,
                color: i === 0 ? colors.textPrimary : colors.textSecondary,
                marginBottom: 12,
              }}
            >
              {para}
            </p>
          ))}
          <div style={{ marginTop: 20 }}>
            <p style={{ fontWeight: 700, color: colors.textPrimary, fontSize: 15 }}>
              {founder.name}
            </p>
            <p style={{ fontSize: 13, color: colors.textSecondary }}>{founder.title}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
