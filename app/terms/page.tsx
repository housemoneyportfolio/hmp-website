// TODO: Replace placeholder content with reviewed legal copy before public launch.
import { colors } from '@/lib/brand'
import { meta } from '@/lib/content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
}

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
      <a href="/" style={{ fontSize: 14, color: colors.primary, textDecoration: 'none', display: 'block', marginBottom: 32 }}>
        ← Back to home
      </a>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: colors.textPrimary, marginBottom: 8 }}>Terms of Service</h1>
      <p style={{ fontSize: 14, color: colors.textDisabled, marginBottom: 40 }}>Last updated: April 2026</p>

      <div style={{ fontSize: 16, lineHeight: 1.8, color: colors.textSecondary, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <p>
          By accessing {meta.domain}, you agree to these Terms of Service. If you do not agree, do not use the site.
        </p>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary }}>Not financial advice</h2>
        <p>
          {meta.siteName} is a portfolio tracking and analytics tool. Nothing on this site constitutes financial,
          investment, legal, or tax advice. Always consult a qualified professional before making investment decisions.
        </p>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary }}>Use of the service</h2>
        <p>
          You may use this site for lawful purposes only. You may not use it in any way that violates applicable laws
          or regulations, or that infringes the rights of others.
        </p>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary }}>Governing law</h2>
        <p>
          These terms are governed by the laws of the State of Georgia, United States, without regard to conflict of law principles.
        </p>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary }}>Contact</h2>
        <p>
          Questions? Email us at legal@{meta.domain}.
        </p>

        <p style={{ fontSize: 13, color: colors.textDisabled, fontStyle: 'italic', borderTop: `1px solid ${colors.border}`, paddingTop: 24 }}>
          This is placeholder legal content. It will be replaced with reviewed legal copy before public launch.
        </p>
      </div>
    </main>
  )
}
