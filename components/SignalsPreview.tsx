import Image from 'next/image'
import { colors, shadows } from '@/lib/brand'
import { product } from '@/lib/content'

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

export default function SignalsPreview() {
  return (
    <section id="product" style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <SectionEyebrow>{product.eyebrow}</SectionEyebrow>
      <h2 style={{
        fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800,
        lineHeight: 1.15, letterSpacing: -1, margin: '0 0 16px', maxWidth: 780,
      }}>
        {product.headline}
      </h2>
      <p style={{ fontSize: 17, color: colors.textSecondary, maxWidth: 640, margin: '0 0 56px', lineHeight: 1.55 }}>
        {product.subheadline}
      </p>

      {/* Browser-chrome dashboard mockup */}
      <div style={{
        background: colors.bgWhite,
        border: `1px solid ${colors.borderMid}`,
        borderRadius: 12, overflow: 'hidden',
        boxShadow: shadows.dashboard,
      }}>
        {/* Browser chrome bar */}
        <div style={{
          background: colors.bgMuted, padding: '12px 16px',
          borderBottom: `1px solid ${colors.borderLight}`,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
          </div>
          <div style={{
            marginLeft: 16, background: colors.bgWhite,
            border: `1px solid ${colors.borderLight}`, borderRadius: 4,
            padding: '4px 12px', fontSize: 12, color: colors.textMuted,
            fontFamily: 'ui-monospace, monospace', flex: 1, maxWidth: 400,
          }}>
            app.housemoneyportfolio.com/dashboard
          </div>
        </div>

        {/* Dashboard layout */}
        <div style={{ display: 'flex' }}>
          {/* Sidebar */}
          <div className="hmp-sidebar" style={{
            width: 220, background: colors.bgWhite, padding: '20px 0',
            borderRight: `1px solid ${colors.borderLight}`, flexShrink: 0,
          }}>
            <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Image src="/brand/logo.svg" alt="" width={24} height={24} />
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: colors.textPrimary, lineHeight: 1.1 }}>
                HOUSE MONEY<br />
                <span style={{ color: colors.gold, fontSize: 8, letterSpacing: 1.8 }}>PORTFOLIO</span>
              </div>
            </div>
            <div style={{ padding: '8px 20px', fontSize: 10, letterSpacing: 1.2, color: colors.textMuted, fontWeight: 700 }}>TRADE</div>
            {[
              { label: 'Dashboard', active: true },
              { label: 'Signals' },
              { label: 'Auto Trading' },
              { label: 'Recent Orders' },
              { label: 'Desks' },
            ].map(item => (
              <div key={item.label} style={{
                padding: '8px 20px', fontSize: 13,
                color: item.active ? colors.primary : colors.textSecondary,
                background: item.active ? colors.accentPale : 'transparent',
                fontWeight: item.active ? 600 : 500,
                borderLeft: item.active ? `3px solid ${colors.primary}` : '3px solid transparent',
              }}>
                {item.label}
              </div>
            ))}
            <div style={{ padding: '16px 20px 8px', fontSize: 10, letterSpacing: 1.2, color: colors.textMuted, fontWeight: 700 }}>ANALYZE</div>
            {['P&L', 'Positions', 'Decisions'].map(label => (
              <div key={label} style={{ padding: '8px 20px', fontSize: 13, color: colors.textSecondary }}>
                {label}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div style={{ flex: 1, padding: '24px 28px', background: colors.bgPaper, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, gap: 12, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>Dashboard</div>
              <div style={{
                fontSize: 12, color: colors.primaryDeep,
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '4px 10px', background: colors.accentPale, borderRadius: 4, fontWeight: 600,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.accent, display: 'inline-block' }} />
                Live · portfolio:equity_changed
              </div>
            </div>

            {/* KPI strip */}
            <div style={{
              background: colors.bgWhite, border: `1px solid ${colors.borderLight}`,
              borderRadius: 10, padding: '18px 20px', marginBottom: 16,
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
            }}>
              {[
                { label: 'TOTAL PORTFOLIO', value: '$99,806' },
                { label: 'DEPLOYED',        value: '$13,708' },
                { label: 'AVAILABLE',       value: '$14,971' },
                { label: 'ACTIVE DESKS',    value: '2', sub: 'of 15' },
              ].map(k => (
                <div key={k.label}>
                  <div style={{ fontSize: 10, letterSpacing: 1.2, color: colors.textMuted, fontWeight: 700, marginBottom: 4 }}>{k.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: colors.textPrimary, fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
                  {k.sub && <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{k.sub}</div>}
                </div>
              ))}
            </div>

            {/* Desk cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { name: 'US Equities', status: 'Live',        statusColor: colors.success,  statusBg: colors.accentPale, deployed: '$13,708', pnl: '-$195',  pnlColor: colors.danger,    active: true },
                { name: 'Crypto Spot', status: 'Canary',      statusColor: colors.warning,  statusBg: '#FEF3C7',         deployed: '$0',       pnl: '$0',     pnlColor: colors.textMuted, active: true },
                { name: 'Options',     status: 'Coming Soon', statusColor: colors.textMuted, statusBg: colors.bgMuted,   deployed: '',         pnl: '',       pnlColor: colors.textMuted, locked: true },
              ].map(desk => (
                <div key={desk.name} style={{
                  background: colors.bgWhite,
                  border: desk.active && desk.status === 'Live' ? `1px solid ${colors.accent}` : `1px solid ${colors.borderLight}`,
                  borderRadius: 10, padding: '16px 18px',
                  opacity: desk.locked ? 0.55 : 1,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: desk.statusColor, display: 'inline-block' }} />
                      {desk.name}
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 100,
                      background: desk.statusBg, color: desk.statusColor, letterSpacing: 0.4,
                    }}>
                      {desk.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>
                    <span>Deployed</span><span>Unrealized P&L</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                    <span>{desk.deployed || '—'}</span>
                    <span style={{ color: desk.pnlColor }}>{desk.pnl || '—'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, fontSize: 13, color: colors.textMuted, fontStyle: 'italic' }}>
        {product.caption}
      </div>

      <style>{`
        @media (max-width: 720px) { .hmp-sidebar { display: none; } }
      `}</style>
    </section>
  )
}
