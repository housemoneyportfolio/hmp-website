import Image from 'next/image'
import { colors } from '@/lib/brand'
import { founder } from '@/lib/content'

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

export default function FounderSection() {
  return (
    <section id="founder" style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div
        className="hmp-founder-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(260px, 340px) 1fr',
          gap: 56,
          alignItems: 'center',
        }}
      >
        {/* Dark card — left column */}
        <div style={{
          background: colors.primaryDarker, borderRadius: 16, padding: '40px 32px',
          textAlign: 'center', color: colors.bgWhite,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Gold accent bar top-right */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 4, background: colors.gold }} />

          {/* Headshot with gold ring */}
          <div style={{
            width: 140, height: 140, borderRadius: '50%',
            margin: '0 auto 24px',
            padding: 4,
            background: colors.gold,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Image
              src="/founder/quentrell-green.jpg"
              alt={founder.headshotAlt}
              width={132}
              height={132}
              style={{
                borderRadius: '50%', objectFit: 'cover', display: 'block',
                border: `3px solid ${colors.primaryDarker}`,
              }}
            />
          </div>

          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{founder.name}</div>
          <div style={{ fontSize: 11, letterSpacing: 1.5, color: colors.goldLight, fontWeight: 700, marginBottom: 24 }}>
            {founder.title}
          </div>

          {founder.credentials.map(c => (
            <div key={c.label} style={{ fontSize: 11, letterSpacing: 1, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: 12 }}>
              <div style={{ fontWeight: 700, color: colors.bgWhite }}>{c.label}</div>
              <div>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Bio — right column */}
        <div>
          <SectionEyebrow>{founder.eyebrow}</SectionEyebrow>
          <h2 style={{
            fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 800,
            lineHeight: 1.15, letterSpacing: -0.8, margin: '0 0 20px',
          }}>
            {founder.headline.map((line, i) => (
              <span key={i} style={{ display: 'block', color: i === founder.headlineAccentLine ? colors.primary : colors.textPrimary }}>
                {line}
              </span>
            ))}
          </h2>
          {founder.bio.map((para, i) => (
            <p key={i} style={{
              fontSize: 16, lineHeight: 1.7, margin: '0 0 16px',
              color: i === founder.bioAccentIndex ? colors.textPrimary : colors.textSecondary,
              fontWeight: i === founder.bioAccentIndex ? 600 : 400,
            }}>
              {para}
            </p>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hmp-founder-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  )
}
