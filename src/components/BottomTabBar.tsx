import { Link, useLocation } from 'react-router-dom'
import { IconBookmark, IconHome, IconSearch, IconUser } from './icons'

const TABS = [
  { to: '/', label: 'Home', icon: IconHome, match: (p: string) => p === '/' },
  { to: '/search', label: 'Search', icon: IconSearch, match: (p: string) => p === '/search' },
  { to: '/profile?tab=saved', label: 'Saved', icon: IconBookmark, match: (p: string, s: string) => p === '/profile' && s.includes('tab=saved') },
  { to: '/profile', label: 'Profile', icon: IconUser, match: (p: string, s: string) => p === '/profile' && !s.includes('tab=saved') },
]

export function BottomTabBar() {
  const location = useLocation()

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
    >
      {TABS.map((tab) => {
        const active = tab.match(location.pathname, location.search)
        const Icon = tab.icon
        return (
          <Link
            key={tab.label}
            to={tab.to}
            aria-current={active ? 'page' : undefined}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.6875rem] transition-colors ${
              active ? 'text-primary' : 'text-ink-faint'
            }`}
          >
            {tab.label === 'Saved' ? (
              <IconBookmark width={20} height={20} filled={active} />
            ) : (
              <Icon width={20} height={20} />
            )}
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
