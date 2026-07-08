import { useMemo, useState, type ComponentType, type SVGProps } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ipoSummaries } from '../data/ipos'
import { useAppState } from '../lib/appState'
import { SavedIpoCard } from '../components/SavedIpoCard'
import { UpcomingEventsRow } from '../components/UpcomingEventsRow'
import { COMPENSATION_DISCLOSURE, LEGAL_DISCLAIMER } from '../lib/disclosures'
import { getIpoLifecycleStatus } from '../lib/ipoFormat'
import type { IpoLifecycleStatus, IpoSummary } from '../types'
import {
  ArrowRightStartOnRectangleIcon,
  BellIcon,
  ChevronRightIcon,
  CurrencyRupeeIcon,
  DocumentTextIcon,
  UserIcon,
} from '@heroicons/react/24/solid'

const SETTINGS_ROWS: { label: string; detail: string; icon: ComponentType<SVGProps<SVGSVGElement>> }[] = [
  {
    label: 'Notification preferences',
    detail: 'Choose which IPO updates, deadline reminders, and verification alerts you want to receive.',
    icon: BellIcon,
  },
  {
    label: 'How S45 is compensated',
    detail: COMPENSATION_DISCLOSURE,
    icon: CurrencyRupeeIcon,
  },
  {
    label: 'Disclaimers & legal',
    detail: LEGAL_DISCLAIMER,
    icon: DocumentTextIcon,
  },
]

const STATUS_GROUP_ORDER: IpoLifecycleStatus[] = ['closing-soon', 'open', 'listed', 'closed']

const STATUS_GROUP_LABEL: Record<IpoLifecycleStatus, string> = {
  'closing-soon': 'Closing soon',
  open: 'Open & upcoming',
  listed: 'Listed',
  closed: 'Closed',
}

type SavedFilter = 'all' | IpoLifecycleStatus

function SavedIposSection() {
  const { savedSlugs } = useAppState()
  const savedIpos = ipoSummaries.filter((ipo) => savedSlugs.includes(ipo.slug))
  const [filter, setFilter] = useState<SavedFilter>('all')

  const grouped = useMemo(() => {
    const bySlug = new Map<IpoLifecycleStatus, IpoSummary[]>()
    for (const ipo of savedIpos) {
      const status = getIpoLifecycleStatus(ipo)
      const bucket = bySlug.get(status) ?? []
      bucket.push(ipo)
      bySlug.set(status, bucket)
    }
    return bySlug
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedSlugs])

  const orderedAll = useMemo(() => STATUS_GROUP_ORDER.flatMap((status) => grouped.get(status) ?? []), [grouped])

  const filterChips = useMemo(
    () =>
      [
        { key: 'all' as SavedFilter, label: 'All', count: savedIpos.length },
        ...STATUS_GROUP_ORDER.map((status) => ({
          key: status as SavedFilter,
          label: STATUS_GROUP_LABEL[status],
          count: (grouped.get(status) ?? []).length,
        })),
      ].filter((opt) => opt.key === 'all' || opt.count > 0),
    [grouped, savedIpos.length],
  )

  const visibleIpos = filter === 'all' ? orderedAll : (grouped.get(filter) ?? [])

  return (
    <section>
      <p className="mb-5 text-xl font-semibold text-heading">Saved IPOs</p>
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
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {filterChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => setFilter(chip.key)}
                aria-pressed={filter === chip.key}
                className={`rounded-pill border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  filter === chip.key
                    ? 'border-line bg-surface-sunken text-ink'
                    : 'border-line text-ink-muted hover:text-ink'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <p className="mb-6 text-sm text-ink-muted">
            {visibleIpos.length} {visibleIpos.length === 1 ? 'result' : 'results'}
          </p>

          {visibleIpos.length === 0 ? (
            <p className="text-sm text-ink-muted">No saved IPOs in this category.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {visibleIpos.map((ipo) => (
                <SavedIpoCard key={ipo.slug} ipo={ipo} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}

function AccountSection() {
  const { profile, logout } = useAppState()
  const navigate = useNavigate()
  const [openRow, setOpenRow] = useState<string | null>(null)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <>
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-sunken text-ink-faint">
          <UserIcon width={28} height={28} />
        </div>
        <div>
          <h1 className="font-serif text-xl text-ink">{profile?.name ?? 'Your account'}</h1>
          {profile?.phone && <p className="text-sm text-ink-muted">+91 {profile.phone}</p>}
          {profile?.email && <p className="text-sm text-ink-muted">{profile.email}</p>}
        </div>
      </div>

      <section>
        <p className="label-caps mb-4 text-ink-muted">Settings</p>
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          {SETTINGS_ROWS.map((row, i) => (
            <div key={row.label} className={i !== 0 ? 'border-t border-line' : ''}>
              <button
                type="button"
                aria-expanded={openRow === row.label}
                onClick={() => setOpenRow(openRow === row.label ? null : row.label)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-surface-sunken"
              >
                <row.icon width={18} height={18} className="shrink-0 text-ink-muted" />
                <span className="flex-1 text-sm font-medium text-ink">{row.label}</span>
                <ChevronRightIcon
                  width={16}
                  height={16}
                  className={`shrink-0 text-ink-faint transition-transform ${openRow === row.label ? 'rotate-90' : ''}`}
                />
              </button>
              {openRow === row.label && (
                <p className="anim-fade-up px-5 pb-4 pl-[3.25rem] text-sm leading-relaxed text-ink-muted">
                  {row.detail}
                </p>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 border-t border-line px-5 py-4 text-left text-danger transition-colors hover:bg-danger-soft/40"
          >
            <ArrowRightStartOnRectangleIcon width={18} height={18} className="shrink-0" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </section>
    </>
  )
}

export function Profile() {
  const [params] = useSearchParams()
  const showSaved = params.get('tab') === 'saved'

  return (
    <div>
      <UpcomingEventsRow />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-8">
        {showSaved ? <SavedIposSection /> : <AccountSection />}
      </div>
    </div>
  )
}
