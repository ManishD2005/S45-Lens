import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { WelcomeSplash } from '../components/WelcomeSplash'
import { ipoSummaries } from '../data/ipos'
import { useAppState } from '../lib/appState'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Login() {
  const { profile, login, forgetAccount } = useAppState()
  const navigate = useNavigate()
  const isReturning = Boolean(profile)
  const openIpoCount = ipoSummaries.filter((ipo) => ipo.isOpen).length

  const [step, setStep] = useState<'details' | 'otp'>('details')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [welcomeName, setWelcomeName] = useState<string | null>(null)

  const detailsValid = isReturning
    ? phone.trim().length >= 10
    : name.trim().length >= 2 && EMAIL_PATTERN.test(email.trim()) && phone.trim().length >= 10

  function handleDetailsSubmit(e: FormEvent) {
    e.preventDefault()
    if (!detailsValid) return
    setStep('otp')
  }

  function handleOtpSubmit(e: FormEvent) {
    e.preventDefault()
    if (otp.trim().length < 4) return
    const firstName = (isReturning ? profile!.name : name.trim()).split(' ')[0]
    if (isReturning) {
      login()
    } else {
      login({ name: name.trim(), email: email.trim(), phone: phone.trim() })
    }
    setWelcomeName(firstName)
  }

  function useDifferentAccount() {
    forgetAccount()
    setStep('details')
    setName('')
    setEmail('')
    setPhone('')
    setOtp('')
  }

  if (welcomeName) {
    return <WelcomeSplash name={welcomeName} openCount={openIpoCount} onDone={() => navigate('/')} />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-sunken px-4">
      <div className="anim-fade-up w-full max-w-sm rounded-card border border-line bg-surface p-8 shadow-[0_4px_24px_-8px_rgba(20,23,26,0.08)]">
        <div className="mb-6 flex justify-center">
          <Logo to="/login" />
        </div>

        {step === 'details' ? (
          <>
            <p className="mb-8 text-center text-sm leading-relaxed text-ink-muted">
              {isReturning ? (
                <>Welcome back{profile ? `, ${profile.name.split(' ')[0]}` : ''}.</>
              ) : (
                <>
                  IPO prospectuses in plain language.
                  <br />
                  Every fact verified. Facts and opinions, always separated.
                </>
              )}
            </p>

            <form onSubmit={handleDetailsSubmit}>
              {!isReturning && (
                <>
                  <label className="label-caps mb-2 block text-ink-muted" htmlFor="name">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoFocus
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Anjali Rao"
                    className="mb-5 w-full rounded-[10px] border border-line bg-surface-sunken px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-primary/40"
                  />

                  <label className="label-caps mb-2 block text-ink-muted" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="anjali@example.com"
                    className="mb-5 w-full rounded-[10px] border border-line bg-surface-sunken px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-primary/40"
                  />
                </>
              )}

              <label className="label-caps mb-2 block text-ink-muted" htmlFor="phone">
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoFocus={isReturning}
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
                className="mb-6 w-full rounded-[10px] border border-line bg-surface-sunken px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-primary/40"
              />

              <button
                type="submit"
                className="w-full rounded-pill bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:opacity-40"
                disabled={!detailsValid}
              >
                Continue with OTP
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <label className="label-caps mb-2 block text-ink-muted" htmlFor="otp">
              Enter the code sent to {phone}
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="4-digit code"
              className="mb-6 w-full rounded-[10px] border border-line bg-surface-sunken px-3.5 py-2.5 text-center text-sm tracking-[0.3em] text-ink placeholder:text-ink-faint focus:outline-none focus:border-primary/40"
            />
            <button
              type="submit"
              className="w-full rounded-pill bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-primary-hover disabled:opacity-40"
              disabled={otp.trim().length < 4}
            >
              Verify &amp; continue
            </button>
            <p className="mt-3 text-center text-xs text-ink-faint">Prototype — any 4-digit code works.</p>
            <button
              type="button"
              onClick={() => setStep('details')}
              className="mt-4 w-full text-center text-sm text-ink-muted hover:text-ink"
            >
              Change details
            </button>
          </form>
        )}

        {isReturning && step === 'details' && (
          <p className="mt-6 text-center text-sm text-ink-muted">
            Not you?{' '}
            <button type="button" onClick={useDifferentAccount} className="font-medium text-primary hover:underline">
              Use a different account
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
