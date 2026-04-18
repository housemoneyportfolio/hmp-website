import Image from 'next/image'
import { colors } from '@/lib/brand'
import { footer } from '@/lib/content'

export default function Footer() {
  return (
    <footer style={{ background: colors.bgPaper, padding: '40px 24px', borderTop: `1px solid ${colors.borderLight}` }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', flexWrap: 'wrap', gap: 24,
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <Image src="/brand/logo.svg" alt="" width={32} height={32} />
          <Image src="/brand/wordmark.svg" alt="House Money Portfolio" width={140} height={26} style={{ height: 26, width: 'auto' }} />
        </a>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 32px', fontSize: 13, color: colors.textMuted }}>
          <span>{footer.entity}</span>
          <a href={`mailto:${footer.email}`} style={{ color: colors.textMuted, textDecoration: 'none' }}>
            {footer.email}
          </a>
          {footer.links.map(link => (
            <a key={link.href} href={link.href} style={{ color: colors.textMuted, textDecoration: 'none' }}>
              {link.label}
            </a>
          ))}
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>

      <div style={{
        maxWidth: 1200, margin: '24px auto 0', paddingTop: 20,
        borderTop: `1px solid ${colors.borderLight}`,
        fontSize: 11, color: colors.textMuted, lineHeight: 1.6,
      }}>
        {footer.legal}
      </div>
    </footer>
  )
}
