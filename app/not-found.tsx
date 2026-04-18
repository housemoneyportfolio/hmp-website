import { colors, borders } from '@/lib/brand'

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.bgDefault,
        padding: 24,
        textAlign: 'center',
      }}
    >
      <div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: colors.primary,
            lineHeight: 1,
            marginBottom: 16,
          }}
        >
          404
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: colors.textPrimary, marginBottom: 12 }}>
          Page not found
        </h1>
        <p style={{ fontSize: 16, color: colors.textSecondary, marginBottom: 32 }}>
          This page doesn&apos;t exist or has been moved.
        </p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            padding: '10px 24px',
            backgroundColor: colors.primary,
            color: '#fff',
            borderRadius: borders.radius.button,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          Go home
        </a>
      </div>
    </main>
  )
}
