'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { colors } from '@/lib/brand'
import { submitWaitlist } from '@/lib/waitlist'

type State = 'idle' | 'loading' | 'success' | 'error'

interface Props {
  ctaLabel?:    string
  successMsg?:  string
  size?:        'default' | 'large'
  showArrow?:   boolean
  goldButton?:  boolean // used in final CTA section
}

export default function WaitlistForm({
  ctaLabel   = 'Get Early Access',
  successMsg = "You're on the list. We'll be in touch.",
  size       = 'default',
  showArrow  = false,
  goldButton = false,
}: Props) {
  const [email, setEmail]   = useState('')
  const [state, setState]   = useState<State>('idle')
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

  const pad  = size === 'large' ? '14px 18px' : '10px 14px'
  const fs   = size === 'large' ? 15 : 14

  if (state === 'success') {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '14px 20px', background: colors.accentPale,
        border: `1px solid ${colors.accent}`, borderRadius: 8,
        color: colors.primaryDeep, fontWeight: 600,
      }}>
        <CheckCircle2 size={18} color={colors.primary} />
        {successMsg}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} id="waitlist">
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={state === 'loading'}
          style={{
            flex: '1 1 240px', padding: pad, fontSize: fs,
            border: `1px solid ${state === 'error' ? colors.danger : colors.borderMid}`,
            borderRadius: 8, outline: 'none',
            fontFamily: 'inherit', color: colors.textPrimary, background: colors.bgWhite,
          }}
        />
        <button
          type="submit"
          disabled={state === 'loading'}
          style={{
            padding: pad, fontSize: fs, fontWeight: 600,
            background: goldButton ? colors.gold : colors.primary,
            color: goldButton ? colors.primaryDarker : colors.bgWhite,
            border: 'none', borderRadius: 8,
            cursor: state === 'loading' ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'inherit',
          }}
        >
          {state === 'loading' ? 'Submitting…' : ctaLabel}
          {showArrow && state !== 'loading' && <ArrowRight size={16} />}
        </button>
      </div>
      {state === 'error' && (
        <p style={{ marginTop: 8, fontSize: 13, color: colors.danger }}>{errorMsg}</p>
      )}
    </form>
  )
}
