export type WaitlistResult =
  | { ok: true }
  | { ok: false; message: string }

export async function submitWaitlist(email: string): Promise<WaitlistResult> {
  const endpoint = process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT

  if (!endpoint) {
    // Lambda not yet deployed — log locally and return success for UI dev
    console.info('[waitlist] No endpoint configured, skipping submit for:', email)
    return { ok: true }
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.ok) return { ok: true }

    const text = await res.text()
    return { ok: false, message: text || 'Something went wrong. Please try again.' }
  } catch {
    return { ok: false, message: 'Network error. Please check your connection and try again.' }
  }
}
