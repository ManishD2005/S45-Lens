import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ipoSummaries, applicationHistory } from '../data/ipos'
import { useAppState } from '../lib/appState'
import { IpoCard } from '../components/IpoCard'
import { IconChevronRight, IconLogout, IconUser } from '../components/icons'

const STATUS_LABEL: Record<string, string> = {
  applied: 'Applied',
  allotted: 'Allotted',
  'not-allotted': 'Not allotted',
  refunded: 'Refunded',
}

const STATUS_STYLE: Record<string, string> = {
  applied: 'bg-surface-sunken text-ink-muted',
  allotted: 'bg-accent-soft text-primary',
  'not-allotted': 'bg-danger-soft text-danger',
  refunded: 'bg-surface-sunken text-ink-muted',
}

const SETTINGS_ROWS: { label: string; detail: string }[] = [
  {
    label: 'Notification preferences',
    detail: 'Choose which IPO updates, deadline reminders, and verification alerts you want to receive.',
  },
  {
    label: 'How S45 is compensated',
    detail:
      'S45 may earn a fee from lead managers when you apply to an IPO through the platform. This does not change the plain-language facts or their sourcing — those are held to the same standard regardless of compensation.',
  },
  {
    label: 'Disclaimers & legal',
    detail:
      'Content on S45 Lens is for informational purposes and is not investment advice. Verdicts and risk rankings are opinions, gated behind SEBI Research Analyst registration in the live product. Always read the official DRHP before applying.',
  },
]

export function Profile() {
  const { profile, savedSlugs, logout } = useAppState()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [openRow, setOpenRow] = useState<string | null>(null)
  const savedRef = useRef<HTMLElement>(null)

  const savedIpos = ipoSummaries.filter((ipo) => savedSlugs.includes(ipo.slug))
  const focusSaved = params.get('tab') === 'saved'

  useEffect(() => {
    if (focusSaved) savedRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [focusSaved])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-8">
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-sunken text-ink-faint">
          <IconUser width={28} height={28} />
        </div>
        <div>
          <h1 className="font-serif text-xl text-ink">{profile?.name ?? 'Your account'}</h1>
          {profile?.phone && <p className="text-sm text-ink-muted">+91 {profile.phone}</p>}
          {profile?.email && <p className="text-sm text-ink-muted">{profile.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <section ref={savedRef} className="scroll-mt-24">
          <p className="label-caps mb-4 text-ink-muted">Saved IPOs</p>
          {savedIpos.length === 0 ? (
            <div className="rounded-card border border-line bg-surface-sunken px-5 py-10 text-center">
              <p className="text-sm text-ink-muted">Save an IPO to track it here.</p>
              <p className="mt-1.5 text-xs text-ink-faint">Tap the bookmark on any IPO page.</p>
              <Link
                to="/"
                className="mt-5 inline-block rounded-pill bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
              >
                Browse IPOs
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {savedIpos.map((ipo) => (
                <IpoCard key={ipo.slug} ipo={ipo} />
              ))}
            </div>
          )}
        </section>

        <section>
          <p className="label-caps mb-4 text-ink-muted">Application history</p>
          <div className="overflow-hidden rounded-card border border-line bg-surface">
            {applicationHistory.map((app, i) => (
              <div
                key={app.companyName}
                className={`flex items-center justify-between px-5 py-3.5 ${
                  i !== applicationHistory.length - 1 ? 'border-b border-line' : ''
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink">{app.companyName}</p>
                  <p className="text-xs text-ink-faint">{app.date}</p>
                </div>
                <span className={`label-caps shrink-0 rounded-pill px-2.5 py-1 ${STATUS_STYLE[app.status]}`}>
                  {STATUS_LABEL[app.status]}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-12">
        <p className="label-caps mb-4 text-ink-muted">Settings</p>
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          {SETTINGS_ROWS.map((row, i) => (
            <div key={row.label} className={i !== 0 ? 'border-t border-line' : ''}>
              <button
                type="button"
                aria-expanded={openRow === row.label}
                onClick={() => setOpenRow(openRow === row.label ? null : row.label)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-surface-sunken"
              >
                <span className="text-sm font-medium text-ink">{row.label}</span>
                <IconChevronRight
                  width={16}
                  height={16}
                  className={`text-ink-faint transition-transform ${openRow === row.label ? 'rotate-90' : ''}`}
                />
              </button>
              {openRow === row.label && (
                <p className="anim-fade-up px-5 pb-4 text-sm leading-relaxed text-ink-muted">{row.detail}</p>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-between border-t border-line px-5 py-4 text-left text-danger transition-colors hover:bg-danger-soft/40"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <IconLogout width={16} height={16} /> Log out
            </span>
          </button>
        </div>
      </section>
    </div>
  )
}
