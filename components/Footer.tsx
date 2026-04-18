import Image from 'next/image'
import { colors } from '@/lib/brand'
import { footer } from '@/lib/content'

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#0a0a0a',
        padding: '40px 24px',
        borderTop: `1px solid rgba(255,255,255,0.06)`,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image src="/brand/logo.svg" alt="House Money Portfolio" width={28} height={28} />
          <Image src="/brand/wordmark.svg" alt="House Money Portfolio" width={130} height={28} />
        </div>

        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textAlign: 'center', flex: '1 1 auto' }}>
          {footer.tagline}
        </p>

        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {footer.links.map(link => (
            <a
              key={link.href}
              href={link.href}
              style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: '20px auto 0',
          paddingTop: 20,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
          fontSize: 12,
          color: 'rgba(255,255,255,0.2)',
        }}
      >
        {footer.legal}
      </div>
    </footer>
  )
}
