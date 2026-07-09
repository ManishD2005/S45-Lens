import { useEffect, useRef, useState, type ComponentType, type SVGProps } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppState } from '../lib/appState'
import {
  ArrowRightStartOnRectangleIcon,
  BellIcon,
  BookmarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UserIcon,
} from '@heroicons/react/24/solid'

const SETTINGS_ROWS: { label: string; detail: string; icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  {
    label: 'Notification preferences',
    detail: 'Choose which IPO updates, deadline reminders, and verification alerts you want to receive.',
    icon: BellIcon,
  },
]

export function ProfileMenu() {
  const { profile, logout } = useAppState()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [openRow, setOpenRow] = useState<string | null>(null)
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

  function handleLogout() {
    setOpen(false)
    logout()
    navigate('/login')
  }

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
        aria-label="Account menu"
        aria-expanded={open}
        className={`hidden h-11 w-11 items-center justify-center rounded-full text-white transition-colors sm:flex ${
          open ? 'bg-accent/30' : 'bg-accent/15 hover:bg-accent/25'
        }`}
      >
        <UserIcon width={18} height={18} />
      </button>

      {open && (
        <div
          role="menu"
          className="anim-fade-up absolute right-0 top-12 z-40 w-80 overflow-hidden rounded-card border border-white/10 bg-[#073835] shadow-xl"
        >
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
              <UserIcon width={22} height={22} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{profile?.name ?? 'Your account'}</p>
              {profile?.phone && <p className="truncate text-xs text-white/60">+91 {profile.phone}</p>}
            </div>
          </div>

          <div className="border-t border-white/10 py-2">
            <Link
              to="/profile?tab=saved"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/5"
            >
              <BookmarkIcon width={18} height={18} className="shrink-0 text-white/70" />
              <span className="flex-1 text-sm font-medium text-white">Saved IPOs</span>
              <ChevronRightIcon width={16} height={16} className="shrink-0 text-white/40" />
            </Link>

            {SETTINGS_ROWS.map((row) => (
              <div key={row.label}>
                <button
                  type="button"
                  aria-expanded={openRow === row.label}
                  onClick={() => setOpenRow(openRow === row.label ? null : row.label)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/5"
                >
                  <row.icon width={18} height={18} className="shrink-0 text-white/70" />
                  <span className="flex-1 text-sm font-medium text-white">{row.label}</span>
                  <ChevronDownIcon
                    width={16}
                    height={16}
                    className={`shrink-0 text-white/40 transition-transform ${openRow === row.label ? 'rotate-180' : ''}`}
                  />
                </button>
                {openRow === row.label && (
                  <p className="anim-fade-up px-4 pb-2 pl-[2.75rem] text-xs leading-relaxed text-white/60">
                    {row.detail}
                  </p>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/5"
            >
              <ArrowRightStartOnRectangleIcon width={18} height={18} className="shrink-0 text-white/70" />
              <span className="text-sm font-medium text-white">Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
