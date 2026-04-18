import { colors } from '@/lib/brand'

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.bgDefault,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-block',
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: colors.primary,
            marginBottom: 24,
          }}
        />
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: colors.textPrimary,
            marginBottom: 8,
          }}
        >
          Hello HMP
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: 16 }}>
          Phase 1 scaffold — site coming soon.
        </p>
      </div>
    </main>
  )
}
