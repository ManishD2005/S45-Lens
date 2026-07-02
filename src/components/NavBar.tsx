import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Logo } from './Logo'
import { SearchOverlay } from './SearchOverlay'
import { NotificationsMenu } from './NotificationsMenu'
import { IconSearch, IconUser } from './icons'

export function NavBar() {
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)

  const onProfile = location.pathname === '/profile'

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-8">
        <Logo />

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden w-64 items-center gap-2 rounded-pill border border-line bg-surface-sunken px-3.5 py-2 text-left transition-colors hover:border-primary/40 sm:flex lg:w-72"
          >
            <IconSearch width={16} height={16} className="shrink-0 text-ink-faint" />
            <span className="min-w-0 flex-1 truncate text-sm text-ink-faint">Search a company or IPO</span>
            <span className="label-caps hidden shrink-0 rounded-[5px] border border-line px-1.5 py-0.5 text-ink-faint normal-case tracking-normal lg:inline-block">
              Ctrl+K
            </span>
          </button>

          <Link to="/search" className="text-ink-muted hover:text-ink sm:hidden" aria-label="Search">
            <IconSearch />
          </Link>

          <NotificationsMenu />

          <Link
            to="/profile"
            aria-label="Profile — saved IPOs, application history, and settings"
            aria-current={onProfile ? 'page' : undefined}
            className={`hidden h-9 w-9 items-center justify-center rounded-full transition-colors sm:flex ${
              onProfile ? 'bg-accent-soft text-primary' : 'bg-surface-sunken text-ink-muted hover:bg-accent-soft hover:text-primary'
            }`}
          >
            <IconUser width={18} height={18} />
          </Link>
        </div>
      </div>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </header>
  )
}
