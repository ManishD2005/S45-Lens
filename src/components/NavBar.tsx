import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { SearchOverlay } from './SearchOverlay'
import { NotificationsMenu } from './NotificationsMenu'
import { ProfileMenu } from './ProfileMenu'
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'

export function NavBar() {
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== '/') return
      const target = e.target as HTMLElement | null
      const isTyping =
        target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable
      if (isTyping) return
      e.preventDefault()
      setSearchOpen(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#04211F]">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-8">
        <Logo variant="dark" />

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden w-64 items-center gap-2 rounded-pill border border-accent/20 bg-accent/15 px-3.5 py-2 text-left transition-colors hover:border-accent/40 hover:bg-accent/25 sm:flex lg:w-72"
          >
            <MagnifyingGlassIcon width={16} height={16} className="shrink-0 text-white" />
            <span className="min-w-0 flex-1 truncate text-sm text-white/70">Search a company or IPO</span>
            <span className="label-caps hidden shrink-0 rounded-[5px] border border-accent/25 px-1.5 py-0.5 text-white/60 normal-case tracking-normal lg:inline-block">
              /
            </span>
          </button>

          <Link to="/search" className="text-white sm:hidden" aria-label="Search">
            <MagnifyingGlassIcon width={20} height={20} />
          </Link>

          <NotificationsMenu />

          <ProfileMenu />
        </div>
      </div>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </header>
  )
}
