'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { colors } from '@/lib/brand'
import { nav } from '@/lib/content'

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const linkStyle: React.CSSProperties = {
    color: colors.textSecondary,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
  }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${colors.borderLight}`,
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <Image src="/brand/logo.svg" alt="" width={32} height={32} />
          <Image src="/brand/wordmark.svg" alt="House Money Portfolio" width={140} height={26} style={{ height: 26, width: 'auto' }} />
        </a>

        {/* Desktop nav */}
        <div className="hmp-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {nav.links.map(link => (
            <a key={link.label} href={link.href} style={linkStyle}>{link.label}</a>
          ))}
          <a
            href={nav.signInUrl}
            style={{
              padding: '9px 18px', background: colors.primary,
              color: colors.bgWhite, borderRadius: 6,
              fontWeight: 600, fontSize: 14, textDecoration: 'none',
            }}
          >
            Sign in
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="hmp-mobile-toggle"
          onClick={() => setMobileOpen(o => !o)}
          style={{ display: 'none', background: 'transparent', border: 'none', color: colors.textPrimary, cursor: 'pointer' }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          borderTop: `1px solid ${colors.borderLight}`, padding: '16px 24px',
          display: 'flex', flexDirection: 'column', gap: 16, background: colors.bgWhite,
        }}>
          {nav.links.map(link => (
            <a key={link.label} href={link.href} style={linkStyle} onClick={() => setMobileOpen(false)}>{link.label}</a>
          ))}
          <a
            href={nav.signInUrl}
            style={{ padding: '10px 16px', background: colors.primary, color: colors.bgWhite, borderRadius: 6, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}
          >
            Sign in
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hmp-desktop-nav { display: none !important; }
          .hmp-mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
