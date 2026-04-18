// TODO: Replace placeholder content with reviewed legal copy before public launch.
import { colors } from '@/lib/brand'
import { meta } from '@/lib/content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
      <a href="/" style={{ fontSize: 14, color: colors.primary, textDecoration: 'none', display: 'block', marginBottom: 32 }}>
        ← Back to home
      </a>
      <h1 style={{ fontSize: 32, fontWeight: 700, color: colors.textPrimary, marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ fontSize: 14, color: colors.textMuted, marginBottom: 40 }}>Last updated: April 2026</p>

      <div style={{ fontSize: 16, lineHeight: 1.8, color: colors.textSecondary, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <p>
          {meta.siteName} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, and share information when you visit {meta.domain} or sign up for our waitlist.
        </p>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary }}>Information we collect</h2>
        <p>
          We collect your email address when you join our waitlist. We may also collect standard web analytics data
          (pages visited, browser type, referrer) through Cloudflare Web Analytics, which does not use cookies or fingerprinting.
        </p>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary }}>How we use your information</h2>
        <p>
          We use your email address to send you updates about {meta.siteName}, including beta access invitations
          and product announcements. We will not sell your email address to third parties.
        </p>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary }}>Contact</h2>
        <p>
          Questions about this policy? Email us at privacy@{meta.domain}.
        </p>

        <p style={{ fontSize: 13, color: colors.textMuted, fontStyle: 'italic', borderTop: `1px solid ${colors.borderLight}`, paddingTop: 24 }}>
          This is placeholder legal content. It will be replaced with reviewed legal copy before public launch.
        </p>
      </div>
    </main>
  )
}
