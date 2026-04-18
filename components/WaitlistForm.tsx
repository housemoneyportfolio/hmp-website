'use client'

import { useState } from 'react'
import { colors, borders } from '@/lib/brand'
import { submitWaitlist } from '@/lib/waitlist'

type State = 'idle' | 'loading' | 'success' | 'error'

interface Props {
  ctaLabel?: string
  size?: 'default' | 'large'
}

export default function WaitlistForm({ ctaLabel = 'Get Early Access', size = 'default' }: Props) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setState('loading')
    const result = await submitWaitlist(email.trim())

    if (result.ok) {
      setState('success')
      setEmail('')
    } else {
      setState('error')
      setErrorMsg(result.message)
    }
  }

  const inputHeight = size === 'large' ? 52 : 44
  const fontSize = size === 'large' ? 16 : 14

  if (state === 'success') {
    return (
      <div
        style={{
          padding: '14px 20px',
          backgroundColor: `${colors.primary}18`,
          border: `1px solid ${colors.primary}`,
          borderRadius: borders.radius.button,
          color: colors.primaryDark,
          fontWeight: 600,
          fontSize,
        }}
      >
        You&apos;re on the list. We&apos;ll be in touch.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} id="waitlist">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={state === 'loading'}
          style={{
            flex: '1 1 220px',
            height: inputHeight,
            padding: '0 16px',
            fontSize,
            border: `1px solid ${state === 'error' ? colors.error : colors.border}`,
            borderRadius: borders.radius.button,
            outline: 'none',
            backgroundColor: colors.bgPaper,
            color: colors.textPrimary,
          }}
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          style={{
            height: inputHeight,
            padding: '0 24px',
            fontSize,
            fontWeight: 600,
            color: '#fff',
            backgroundColor: state === 'loading' ? colors.primaryDark : colors.primary,
            border: 'none',
            borderRadius: borders.radius.button,
            cursor: state === 'loading' ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {state === 'loading' ? 'Submitting…' : ctaLabel}
        </button>
      </div>
      {state === 'error' && (
        <p style={{ marginTop: 8, fontSize: 13, color: colors.error }}>{errorMsg}</p>
      )}
    </form>
  )
}
