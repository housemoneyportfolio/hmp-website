import React, { useState, useEffect } from 'react';
import {
  Shield, Eye, Lock, CheckCircle2, ArrowRight,
  Scale, Activity, AlertCircle, Menu, X
} from 'lucide-react';

// ============================================================================
// BRAND TOKENS — matched to real logo.svg and wordmark.svg assets
// ============================================================================
const brand = {
  // Primary greens — pulled directly from logo.svg
  primary: '#0D9B7A',        // main brand green
  primaryLight: '#19c49b',   // chip ring accent
  primaryDeep: '#118a6f',    // gradient dark stop
  primaryDark: '#0A7057',    // hover/emphasis
  primaryDarker: '#064D3D',  // deep surfaces

  // Mint for live indicators
  accent: '#10B981',
  accentLight: '#34D399',
  accentPale: '#D1FAE5',

  // Gold — the real brand accent from wordmark
  gold: '#e1a73a',
  goldLight: '#F5C261',
  goldPale: '#FEF3D8',

  // Neutrals
  bgWhite: '#FFFFFF',
  bgPaper: '#FAFBFC',
  bgMuted: '#F5F7FA',
  bgSubtle: '#EEF2F7',

  textPrimary: 'rgba(0,0,0,0.87)',  // matches wordmark text color
  textSecondary: '#475569',
  textMuted: '#94A3B8',

  borderLight: 'rgba(15, 23, 42, 0.08)',
  borderMid: 'rgba(15, 23, 42, 0.14)',

  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
};

// Path to assets — will sit in Next.js /public folder
const ASSETS = {
  logo: '/logo.svg',
  wordmark: '/wordmark.svg',
  headshot: '/quentrell-green.jpg',
};

export default function HMPMarketingSite() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3500);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.includes('@')) setSubmitted(true);
  };

  return (
    <div style={{
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      color: brand.textPrimary,
      background: brand.bgWhite,
      minHeight: '100vh',
      WebkitFontSmoothing: 'antialiased',
    }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <Nav mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <Hero email={email} setEmail={setEmail} submitted={submitted} handleSubmit={handleSubmit} />
      <ProblemSection />
      <ProductShowcase tick={tick} />
      <MoatsSection />
      <FounderSection />
      <CTASection email={email} setEmail={setEmail} submitted={submitted} handleSubmit={handleSubmit} />
      <Footer />
    </div>
  );
}

// ============================================================================
// LOGO COMPONENTS — use the real SVG files from /public
// ============================================================================
function LogoMark({ size = 36 }) {
  return (
    <img
      src={ASSETS.logo}
      alt=""
      width={size}
      height={size}
      style={{ display: 'block', width: size, height: size }}
    />
  );
}

function Wordmark({ height = 20 }) {
  return (
    <img
      src={ASSETS.wordmark}
      alt="House Money Portfolio"
      style={{ display: 'block', height, width: 'auto' }}
    />
  );
}

function Logo({ compact = false }) {
  return (
    <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
      <LogoMark size={compact ? 32 : 40} />
      <Wordmark height={compact ? 26 : 32} />
    </a>
  );
}

// ============================================================================
// NAV
// ============================================================================
function Nav({ mobileOpen, setMobileOpen }) {
  const navLinkStyle = { color: brand.textSecondary, textDecoration: 'none', fontSize: 14, fontWeight: 500 };

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${brand.borderLight}`,
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo compact />
        <div className="hmp-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#product" style={navLinkStyle}>Product</a>
          <a href="#how-it-works" style={navLinkStyle}>How it works</a>
          <a href="#founder" style={navLinkStyle}>Founder</a>
          <a
            href="https://app.housemoneyportfolio.com"
            style={{ padding: '9px 18px', background: brand.primary, color: brand.bgWhite, borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: 'none', transition: 'background 0.15s' }}
            onMouseOver={(e) => e.currentTarget.style.background = brand.primaryDark}
            onMouseOut={(e) => e.currentTarget.style.background = brand.primary}
          >
            Sign in
          </a>
        </div>
        <button
          className="hmp-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ display: 'none', background: 'transparent', border: 'none', color: brand.textPrimary, cursor: 'pointer' }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {mobileOpen && (
        <div style={{ borderTop: `1px solid ${brand.borderLight}`, padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16, background: brand.bgWhite }}>
          <a href="#product" style={navLinkStyle} onClick={() => setMobileOpen(false)}>Product</a>
          <a href="#how-it-works" style={navLinkStyle} onClick={() => setMobileOpen(false)}>How it works</a>
          <a href="#founder" style={navLinkStyle} onClick={() => setMobileOpen(false)}>Founder</a>
          <a href="https://app.housemoneyportfolio.com" style={{ padding: '10px 16px', background: brand.primary, color: brand.bgWhite, borderRadius: 6, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>
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
  );
}

// ============================================================================
// HERO
// ============================================================================
function Hero({ email, setEmail, submitted, handleSubmit }) {
  return (
    <section style={{ padding: '80px 24px 100px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ maxWidth: 860 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 14px', background: brand.accentPale, borderRadius: 100,
          fontSize: 12, fontWeight: 700, color: brand.primaryDeep, letterSpacing: 0.8, marginBottom: 28,
        }}>
          <Shield size={14} />
          GOVERNANCE-FIRST TRADING
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 5.5vw, 64px)', fontWeight: 800,
          lineHeight: 1.05, letterSpacing: -1.5, margin: '0 0 24px',
          color: brand.textPrimary,
        }}>
          Institutional-grade<br />
          trading discipline<br />
          <span style={{ color: brand.primary }}>for self-directed investors.</span>
        </h1>

        <p style={{ fontSize: 19, lineHeight: 1.55, color: brand.textSecondary, margin: '0 0 40px', maxWidth: 640 }}>
          HMP scans the markets, executes through your own brokerage account, and explains every decision in plain language. Your capital never leaves your custody.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, maxWidth: 480, flexWrap: 'wrap' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                flex: '1 1 240px', padding: '14px 18px', fontSize: 15,
                border: `1px solid ${brand.borderMid}`, borderRadius: 8, outline: 'none',
                fontFamily: 'inherit', color: brand.textPrimary, background: brand.bgWhite,
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = brand.primary}
              onBlur={(e) => e.currentTarget.style.borderColor = brand.borderMid}
            />
            <button
              type="submit"
              style={{
                padding: '14px 26px', fontSize: 15, fontWeight: 600,
                background: brand.primary, color: brand.bgWhite, border: 'none', borderRadius: 8,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'inherit', transition: 'background 0.15s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = brand.primaryDark}
              onMouseOut={(e) => e.currentTarget.style.background = brand.primary}
            >
              Join the waitlist
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '14px 20px', background: brand.accentPale,
            border: `1px solid ${brand.accent}`, borderRadius: 8,
            color: brand.primaryDeep, fontWeight: 600,
          }}>
            <CheckCircle2 size={18} color={brand.primary} />
            You're on the list. We'll be in touch before InvestFest 2026.
          </div>
        )}

        <p style={{ fontSize: 13, color: brand.textMuted, margin: '16px 0 0' }}>
          Private beta. Public launch at InvestFest 2026. No spam, no financial advice.
        </p>
      </div>

      <div style={{ marginTop: 80, paddingTop: 32, borderTop: `1px solid ${brand.borderLight}`, display: 'flex', flexWrap: 'wrap', gap: '32px 48px' }}>
        <StatStrip label="PRODUCTION SERVICES" value="55+" />
        <StatStrip label="BROKER INTEGRATIONS" value="13" />
        <StatStrip label="DATA SOURCES" value="60+" />
        <StatStrip label="RISK GATES" value="12" />
        <StatStrip label="PLATFORM STATUS" value="LIVE" highlight />
      </div>
    </section>
  );
}

function StatStrip({ label, value, highlight }) {
  return (
    <div>
      <div style={{ fontSize: 10, letterSpacing: 1.4, color: brand.textMuted, marginBottom: 6, fontWeight: 700 }}>
        {label}
      </div>
      <div style={{
        fontSize: 20, fontWeight: 700,
        color: highlight ? brand.primary : brand.textPrimary,
        display: 'flex', alignItems: 'center', gap: 8,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {highlight && (
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: brand.accent, display: 'inline-block',
            boxShadow: `0 0 0 3px ${brand.accentPale}`,
          }} />
        )}
        {value}
      </div>
    </div>
  );
}

// ============================================================================
// PROBLEM
// ============================================================================
function ProblemSection() {
  const options = [
    { icon: <Activity size={22} />, title: 'Trade manually', subtitle: 'Discipline is hard', desc: "Emotion-driven decisions. No consistent rules. Wins fade, losses compound. The platform is the trader's own willpower." },
    { icon: <Lock size={22} />, title: 'Use a robo-advisor', subtitle: 'Lose all control', desc: 'Hand custody to a black-box allocator. Generic portfolios, no flexibility, no insight into the why behind any decision.' },
    { icon: <AlertCircle size={22} />, title: 'Build a DIY bot', subtitle: 'No safety rails', desc: 'Stitch together TradingView scripts and broker APIs. No risk gates, no audit trail, no idea why it did what it did when something breaks.' },
  ];

  return (
    <section style={{ background: brand.bgPaper, padding: '100px 24px', borderTop: `1px solid ${brand.borderLight}`, borderBottom: `1px solid ${brand.borderLight}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionEyebrow>THE PROBLEM</SectionEyebrow>
        <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: -1, margin: '0 0 16px', maxWidth: 780 }}>
          Self-directed investors are stuck choosing between three bad options.
        </h2>
        <p style={{ fontSize: 17, color: brand.textSecondary, maxWidth: 640, margin: '0 0 56px', lineHeight: 1.55 }}>
          None of them give you what institutional desks have always had: disciplined, rules-based execution with real risk rails and a full audit trail of every decision.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {options.map((opt, i) => (
            <div key={i} style={{
              background: brand.bgWhite, border: `1px solid ${brand.borderLight}`, borderRadius: 12,
              padding: '28px 28px 32px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: brand.danger }} />
              <div style={{
                width: 44, height: 44, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: brand.danger, marginBottom: 20,
              }}>
                {opt.icon}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px', letterSpacing: -0.3 }}>
                {opt.title}
              </h3>
              <div style={{ fontSize: 12, fontWeight: 700, color: brand.danger, letterSpacing: 0.8, marginBottom: 14 }}>
                {opt.subtitle.toUpperCase()}
              </div>
              <p style={{ fontSize: 14, color: brand.textSecondary, lineHeight: 1.6, margin: 0 }}>
                {opt.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PRODUCT SHOWCASE
// ============================================================================
function ProductShowcase({ tick }) {
  return (
    <section id="product" style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <SectionEyebrow>THE PRODUCT</SectionEyebrow>
      <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: -1, margin: '0 0 16px', maxWidth: 780 }}>
        An engineering-grade trading desk that runs in the background.
      </h2>
      <p style={{ fontSize: 17, color: brand.textSecondary, maxWidth: 640, margin: '0 0 56px', lineHeight: 1.55 }}>
        Multi-strategy scanners running against your brokerage account in real time. Every signal is policy-checked before it can fire.
      </p>

      <div style={{
        background: brand.bgWhite, border: `1px solid ${brand.borderMid}`, borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 20px 50px -20px rgba(13, 155, 122, 0.2), 0 8px 24px -12px rgba(0,0,0,0.08)',
      }}>
        {/* Browser chrome */}
        <div style={{
          background: brand.bgMuted, padding: '12px 16px',
          borderBottom: `1px solid ${brand.borderLight}`,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
          </div>
          <div style={{
            marginLeft: 16, background: brand.bgWhite,
            border: `1px solid ${brand.borderLight}`, borderRadius: 4,
            padding: '4px 12px', fontSize: 12, color: brand.textMuted,
            fontFamily: 'ui-monospace, monospace', flex: 1, maxWidth: 400,
          }}>
            app.housemoneyportfolio.com/dashboard
          </div>
        </div>

        {/* Dashboard */}
        <div style={{ display: 'flex' }}>
          {/* Sidebar */}
          <div className="hmp-sidebar" style={{
            width: 220, background: brand.bgWhite, padding: '20px 0',
            borderRight: `1px solid ${brand.borderLight}`, flexShrink: 0,
          }}>
            <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <LogoMark size={24} />
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: brand.textPrimary, lineHeight: 1.1 }}>
                HOUSE MONEY<br />
                <span style={{ color: brand.gold, fontSize: 8, letterSpacing: 1.8 }}>PORTFOLIO</span>
              </div>
            </div>
            <div style={{ padding: '8px 20px', fontSize: 10, letterSpacing: 1.2, color: brand.textMuted, fontWeight: 700 }}>
              TRADE
            </div>
            {[
              { label: 'Dashboard', active: true },
              { label: 'Signals' },
              { label: 'Auto Trading' },
              { label: 'Recent Orders' },
              { label: 'Desks' },
            ].map((item) => (
              <div key={item.label} style={{
                padding: '8px 20px', fontSize: 13,
                color: item.active ? brand.primary : brand.textSecondary,
                background: item.active ? brand.accentPale : 'transparent',
                fontWeight: item.active ? 600 : 500,
                borderLeft: item.active ? `3px solid ${brand.primary}` : '3px solid transparent',
                cursor: 'pointer',
              }}>
                {item.label}
              </div>
            ))}
            <div style={{ padding: '16px 20px 8px', fontSize: 10, letterSpacing: 1.2, color: brand.textMuted, fontWeight: 700 }}>
              ANALYZE
            </div>
            {['P&L', 'Positions', 'Decisions'].map((label) => (
              <div key={label} style={{ padding: '8px 20px', fontSize: 13, color: brand.textSecondary, cursor: 'pointer' }}>
                {label}
              </div>
            ))}
          </div>

          {/* Main */}
          <div style={{ flex: 1, padding: '24px 28px', background: brand.bgPaper, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, gap: 12, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>Dashboard</div>
              <div style={{
                fontSize: 12, color: brand.primaryDeep,
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '4px 10px', background: brand.accentPale, borderRadius: 4, fontWeight: 600,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: brand.accent, display: 'inline-block',
                  animation: 'hmp-pulse 2s ease-in-out infinite',
                }} />
                Live · portfolio:equity_changed
              </div>
            </div>

            {/* KPI strip */}
            <div style={{
              background: brand.bgWhite, border: `1px solid ${brand.borderLight}`,
              borderRadius: 10, padding: '18px 20px', marginBottom: 16,
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
            }}>
              {[
                { label: 'TOTAL PORTFOLIO', value: '$99,806' },
                { label: 'DEPLOYED', value: '$13,708' },
                { label: 'AVAILABLE', value: '$14,971' },
                { label: 'ACTIVE DESKS', value: '2', sub: 'of 15' },
              ].map((k) => (
                <div key={k.label}>
                  <div style={{ fontSize: 10, letterSpacing: 1.2, color: brand.textMuted, fontWeight: 700, marginBottom: 4 }}>
                    {k.label}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: brand.textPrimary, fontVariantNumeric: 'tabular-nums' }}>
                    {k.value}
                  </div>
                  {k.sub && <div style={{ fontSize: 11, color: brand.textMuted, marginTop: 2 }}>{k.sub}</div>}
                </div>
              ))}
            </div>

            {/* Desk cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { name: 'US Equities', status: 'Live', statusColor: brand.success, statusBg: brand.accentPale, deployed: '$13,708', pnl: '-$195', pnlColor: brand.danger, active: true },
                { name: 'Crypto Spot', status: 'Canary', statusColor: brand.warning, statusBg: '#FEF3C7', deployed: '$0', pnl: '$0', pnlColor: brand.textMuted, active: true },
                { name: 'Options', status: 'Coming Soon', statusColor: brand.textMuted, statusBg: brand.bgMuted, locked: true },
              ].map((desk) => (
                <div key={desk.name} style={{
                  background: brand.bgWhite,
                  border: desk.active && desk.status === 'Live'
                    ? `1px solid ${brand.accent}`
                    : `1px solid ${brand.borderLight}`,
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: brand.textMuted, marginBottom: 4 }}>
                    <span>Deployed</span>
                    <span>Unrealized P&L</span>
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

      <div style={{ marginTop: 16, fontSize: 13, color: brand.textMuted, fontStyle: 'italic' }}>
        Preview of the live portfolio dashboard. Multi-desk capital allocation with per-desk risk governance.
      </div>

      <style>{`
        @keyframes hmp-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 720px) {
          .hmp-sidebar { display: none; }
        }
      `}</style>
    </section>
  );
}

// ============================================================================
// MOATS
// ============================================================================
function MoatsSection() {
  const moats = [
    {
      icon: <Scale size={26} />,
      title: 'Governance-first architecture',
      desc: 'Twelve policy gates sit inside the execution path itself. Kill switch, position limits, regime filter, drawdown guard, stop-loss enforcement. Retrofitting this into an existing platform would require a rewrite.',
      bullet: 'Built in, not bolted on',
    },
    {
      icon: <Lock size={26} />,
      title: 'BYOB custody — never an intermediary',
      desc: "We connect through your own brokerage account via OAuth. HMP never holds customer funds, never sees credentials. That sidesteps the broker-dealer regulatory perimeter that slows competitors by 12 to 24 months.",
      bullet: 'Your capital stays with you',
    },
    {
      icon: <Eye size={26} />,
      title: 'Decision Trace — full provenance',
      desc: 'Every trade — taken or rejected — is recorded with a plain-language explanation. Why the signal fired, which gates it passed, why the order was approved. Not log files. A first-class product surface.',
      bullet: 'Every decision is auditable',
    },
  ];

  return (
    <section id="how-it-works" style={{ padding: '100px 24px', background: brand.bgPaper, borderTop: `1px solid ${brand.borderLight}`, borderBottom: `1px solid ${brand.borderLight}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionEyebrow>WHY HMP WINS</SectionEyebrow>
        <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: -1, margin: '0 0 16px', maxWidth: 780 }}>
          Three structural choices competitors can't replicate.
        </h2>
        <p style={{ fontSize: 17, color: brand.textSecondary, maxWidth: 640, margin: '0 0 56px', lineHeight: 1.55 }}>
          These aren't features. They're architectural commitments made on day one. Features can be copied in a quarter. These cannot.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {moats.map((m, i) => (
            <div key={i} style={{
              background: brand.bgWhite, border: `1px solid ${brand.borderLight}`,
              borderRadius: 12, padding: 32,
            }}>
              <div style={{
                width: 52, height: 52, background: brand.accentPale, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: brand.primary, marginBottom: 24,
              }}>
                {m.icon}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px', letterSpacing: -0.3, lineHeight: 1.25 }}>
                {m.title}
              </h3>
              <p style={{ fontSize: 14, color: brand.textSecondary, lineHeight: 1.65, margin: '0 0 20px' }}>
                {m.desc}
              </p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 12px', background: brand.accentPale, borderRadius: 6,
                fontSize: 12, fontWeight: 700, color: brand.primaryDeep, letterSpacing: 0.3,
              }}>
                <CheckCircle2 size={14} color={brand.primary} />
                {m.bullet}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FOUNDER — headshot integrated
// ============================================================================
function FounderSection() {
  return (
    <section id="founder" style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 340px) 1fr', gap: 56, alignItems: 'center' }} className="hmp-founder-grid">
        <div style={{
          background: brand.primaryDarker, borderRadius: 16, padding: '40px 32px',
          textAlign: 'center', color: brand.bgWhite, position: 'relative', overflow: 'hidden',
        }}>
          {/* Gold accent bar — echoes the logo's gold trend line */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 4, background: brand.gold }} />

          {/* Real headshot */}
          <div style={{
            width: 140, height: 140, borderRadius: '50%',
            margin: '0 auto 24px',
            padding: 4,
            background: brand.gold,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img
              src={ASSETS.headshot}
              alt="Quentrell Green, Founder"
              style={{
                width: '100%', height: '100%', borderRadius: '50%',
                objectFit: 'cover', display: 'block',
                border: `3px solid ${brand.primaryDarker}`,
              }}
            />
          </div>

          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
            Quentrell Green
          </div>
          <div style={{ fontSize: 11, letterSpacing: 1.5, color: brand.goldLight, fontWeight: 700, marginBottom: 24 }}>
            FOUNDER & ARCHITECT
          </div>
          <div style={{ fontSize: 11, letterSpacing: 1, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
            <div style={{ fontWeight: 700, color: brand.bgWhite }}>ENTERPRISE ARCHITECT</div>
            <div style={{ marginBottom: 12 }}>QGE / GGIT</div>
            <div style={{ fontWeight: 700, color: brand.bgWhite }}>FORMERLY</div>
            <div>Senior Network<br />Engineering Manager</div>
          </div>
        </div>

        <div>
          <SectionEyebrow>THE FOUNDER</SectionEyebrow>
          <h2 style={{ fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: -0.8, margin: '0 0 20px' }}>
            From building control planes for networks<br />
            <span style={{ color: brand.primary }}>to building one for capital.</span>
          </h2>
          <p style={{ fontSize: 16, color: brand.textSecondary, lineHeight: 1.7, margin: '0 0 16px' }}>
            I spent over a decade managing enterprise network infrastructure — building systems where one bad decision propagates fast and recovery is measured in customer impact. The hard problems were never the routing protocols. They were policy enforcement, change control, blast-radius containment, and audit.
          </p>
          <p style={{ fontSize: 16, color: brand.textPrimary, fontWeight: 600, lineHeight: 1.6, margin: '0 0 16px' }}>
            Trading platforms have the same problems. Most ignore them.
          </p>
          <p style={{ fontSize: 16, color: brand.textSecondary, lineHeight: 1.7, margin: 0 }}>
            HMP applies the engineering discipline of telecom-grade control planes to retail capital allocation. The result is a system designed for trust before it was designed for speed.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hmp-founder-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  );
}

// ============================================================================
// CTA
// ============================================================================
function CTASection({ email, setEmail, submitted, handleSubmit }) {
  return (
    <section style={{
      background: brand.primaryDarker, padding: '80px 24px',
      color: brand.bgWhite, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: brand.gold }} />
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: -1, margin: '0 0 16px' }}>
          Every self-directed investor deserves the same<br />
          <span style={{ color: brand.goldLight }}>governance and rigor institutions take for granted.</span>
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.8)', lineHeight: 1.55, margin: '0 0 40px', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
          Private beta is open to a small group. Public launch at InvestFest 2026, Atlanta.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, maxWidth: 480, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                flex: '1 1 240px', padding: '14px 18px', fontSize: 15,
                border: 'none', borderRadius: 8, outline: 'none',
                fontFamily: 'inherit', background: brand.bgWhite, color: brand.textPrimary,
              }}
            />
            <button
              type="submit"
              style={{
                padding: '14px 24px', fontSize: 15, fontWeight: 600,
                background: brand.gold, color: brand.primaryDarker,
                border: 'none', borderRadius: 8, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'inherit', transition: 'transform 0.15s, background 0.15s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.background = brand.goldLight;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = brand.gold;
              }}
            >
              Request access
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '14px 20px', background: 'rgba(225, 167, 58, 0.2)',
            border: `1px solid ${brand.gold}`, borderRadius: 8,
            color: brand.bgWhite, fontWeight: 500,
          }}>
            <CheckCircle2 size={18} color={brand.goldLight} />
            You're on the list.
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER
// ============================================================================
function Footer() {
  return (
    <footer style={{ background: brand.bgPaper, padding: '40px 24px', borderTop: `1px solid ${brand.borderLight}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo compact />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 32px', fontSize: 13, color: brand.textMuted }}>
          <span>House Money Portfolio LLC · Delaware</span>
          <a href="mailto:quentrell@housemoneyportfolio.com" style={{ color: brand.textMuted, textDecoration: 'none' }}>
            quentrell@housemoneyportfolio.com
          </a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
      <div style={{
        maxWidth: 1200, margin: '24px auto 0', paddingTop: 20,
        borderTop: `1px solid ${brand.borderLight}`,
        fontSize: 11, color: brand.textMuted, lineHeight: 1.6,
      }}>
        HMP is a software platform. HMP is not a broker-dealer, investment adviser, or financial intermediary. HMP does not hold customer funds or securities. Trades execute through the user's own brokerage account via OAuth. Nothing on this site constitutes financial advice.
      </div>
    </footer>
  );
}

function SectionEyebrow({ children }) {
  return (
    <div style={{
      fontSize: 12, fontWeight: 700, letterSpacing: 2,
      color: brand.primary, marginBottom: 16,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ width: 24, height: 2, background: brand.primary, display: 'inline-block' }} />
      {children}
    </div>
  );
}
