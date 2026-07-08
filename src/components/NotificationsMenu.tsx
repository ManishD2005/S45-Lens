import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ipoSummaries } from '../data/ipos'
import { BellIcon } from '@heroicons/react/24/solid'

export function NotificationsMenu() {
  const [open, setOpen] = useState(false)
  const [supportsHover, setSupportsHover] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSupportsHover(window.matchMedia('(hover: hover)').matches)
  }, [])

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

  const hasNotifications = Boolean(closingSoon)

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => supportsHover && setOpen(true)}
      onMouseLeave={() => supportsHover && setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        aria-expanded={open}
        className={`hidden h-11 w-11 items-center justify-center rounded-full text-white transition-colors sm:flex ${
          open ? 'bg-accent/30' : 'bg-accent/15 hover:bg-accent/25'
        }`}
      >
        <BellIcon width={18} height={18} />
      </button>

      {open && (
        <div
          role="menu"
          className="anim-fade-up absolute right-0 top-12 z-40 w-80 overflow-hidden rounded-card border border-white/10 bg-[#073835] shadow-xl"
        >
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-sm font-semibold text-white">Notifications</p>
          </div>

          {hasNotifications ? (
            <div className="divide-y divide-white/10">
              {closingSoon && (
                <Link
                  to={`/ipo/${closingSoon.slug}`}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-left transition-colors hover:bg-white/5"
                >
                  <p className="text-sm text-white">
                    {closingSoon.name.split(' (')[0]}{' '}
                    {closingSoon.closesInDays === 1 ? 'closes tomorrow' : `closes in ${closingSoon.closesInDays} days`}
                  </p>
                  <p className="mt-0.5 text-xs text-white/50">Closing reminder</p>
                </Link>
              )}
            </div>
          ) : (
            <p className="px-4 py-8 text-center text-sm text-white/60">No notifications yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
