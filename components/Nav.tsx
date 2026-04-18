'use client'

import Image from 'next/image'
import { colors } from '@/lib/brand'
import { nav } from '@/lib/content'

export default function Nav() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <Image src="/brand/logo.svg" alt="House Money Portfolio logo" width={36} height={36} />
          <Image src="/brand/wordmark.svg" alt="House Money Portfolio" width={160} height={35} />
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a
            href={nav.signInUrl}
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: colors.textSecondary,
              textDecoration: 'none',
            }}
          >
            {nav.signInLabel}
          </a>
          <a
            href="#waitlist"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#fff',
              backgroundColor: colors.primary,
              padding: '8px 18px',
              borderRadius: '8px',
              textDecoration: 'none',
            }}
          >
            {nav.ctaLabel}
          </a>
        </div>
      </div>
    </nav>
  )
}
