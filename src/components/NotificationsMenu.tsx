import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { applicationHistory, ipoSummaries } from '../data/ipos'
import { IconBell } from './icons'

const STATUS_COPY: Record<string, string> = {
  applied: 'application was received',
  allotted: 'application was allotted',
  'not-allotted': 'application was not allotted',
  refunded: 'application was refunded',
}

export function NotificationsMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const closingSoon = ipoSummaries
    .filter((ipo) => ipo.isOpen && typeof ipo.closesInDays === 'number')
    .sort((a, b) => (a.closesInDays ?? 99) - (b.closesInDays ?? 99))[0]
  const latestApplication = applicationHistory[0]

  const hasNotifications = Boolean(closingSoon || latestApplication)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        aria-expanded={open}
        className={`hidden h-11 w-11 items-center justify-center rounded-full transition-colors sm:flex ${
          open ? 'bg-accent-soft text-primary' : 'bg-surface-sunken text-ink-muted hover:bg-accent-soft hover:text-primary'
        }`}
      >
        <IconBell width={18} height={18} />
      </button>

      {open && (
        <div
          role="menu"
          className="anim-fade-up absolute right-0 top-11 z-40 w-80 overflow-hidden rounded-card border border-line bg-surface shadow-xl"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="text-sm font-semibold text-ink">Notifications</p>
          </div>

          {hasNotifications ? (
            <div className="divide-y divide-line">
              {closingSoon && (
                <Link
                  to={`/ipo/${closingSoon.slug}`}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-left transition-colors hover:bg-surface-sunken"
                >
                  <p className="text-sm text-ink">
                    {closingSoon.name.split(' (')[0]}{' '}
                    {closingSoon.closesInDays === 1 ? 'closes tomorrow' : `closes in ${closingSoon.closesInDays} days`}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-faint">Closing reminder</p>
                </Link>
              )}
              {latestApplication && (
                <div className="px-4 py-3">
                  <p className="text-sm text-ink">
                    {latestApplication.companyName}: your {STATUS_COPY[latestApplication.status]}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-faint">{latestApplication.date}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="px-4 py-8 text-center text-sm text-ink-muted">No notifications yet.</p>
          )}

          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="block border-t border-line px-4 py-2.5 text-center text-xs font-medium text-primary hover:underline"
          >
            Notification preferences
          </Link>
        </div>
      )}
    </div>
  )
}
