import { useEffect, useMemo, useRef, useState } from 'react'
import { ipoSummaries } from '../data/ipos'
import { IpoCard } from '../components/IpoCard'
import { UpcomingEventsRow } from '../components/UpcomingEventsRow'
import { IconSort } from '../components/icons'
import type { IpoCategory } from '../types'

type Filter = 'All' | IpoCategory | 'Closing soon'
type Sort = 'closing-soon' | 'name'

const FILTERS: Filter[] = ['All', 'SME', 'Mainboard', 'Closing soon']
const SORT_OPTIONS: { value: Sort; label: string }[] = [
  { value: 'closing-soon', label: 'Closing soon' },
  { value: 'name', label: 'Name A–Z' },
]

export function Home() {
  const [filter, setFilter] = useState<Filter>('All')
  const [sort, setSort] = useState<Sort>('closing-soon')
  const [sortMenuOpen, setSortMenuOpen] = useState(false)
  const sortMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sortMenuOpen) return
    function onPointerDown(e: PointerEvent) {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) setSortMenuOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setSortMenuOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [sortMenuOpen])

  const trending = useMemo(() => {
    let list = ipoSummaries.filter((ipo) => ipo.isOpen)
    if (filter === 'SME' || filter === 'Mainboard') list = list.filter((ipo) => ipo.category === filter)
    if (filter === 'Closing soon') list = list.filter((ipo) => typeof ipo.closesInDays === 'number')

    return [...list].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      return (a.closesInDays ?? 99) - (b.closesInDays ?? 99)
    })
  }, [filter, sort])

  return (
    <div>
      <UpcomingEventsRow />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-8">
        <section aria-label="Trending IPOs">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-ink">Popular IPOs on S45 Lens</h2>
          </div>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter IPOs">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={`rounded-pill px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-primary text-white'
                      : 'border border-line text-ink-muted hover:border-primary/40 hover:text-ink'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div ref={sortMenuRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setSortMenuOpen((o) => !o)}
                aria-label="Sort IPOs"
                aria-expanded={sortMenuOpen}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  sortMenuOpen ? 'bg-accent-soft text-primary' : 'border border-line text-ink-muted hover:text-ink'
                }`}
              >
                <IconSort width={16} height={16} />
              </button>

              {sortMenuOpen && (
                <div
                  role="menu"
                  className="anim-fade-up absolute right-0 top-11 z-20 w-44 overflow-hidden rounded-card border border-line bg-surface shadow-lg"
                >
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="menuitemradio"
                      aria-checked={sort === option.value}
                      onClick={() => {
                        setSort(option.value)
                        setSortMenuOpen(false)
                      }}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-sunken ${
                        sort === option.value ? 'font-medium text-primary' : 'text-ink'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {trending.length === 0 ? (
            <div className="rounded-card border border-line bg-surface-sunken px-5 py-12 text-center">
              <p className="text-sm text-ink-muted">No IPOs match this filter right now.</p>
              <button
                type="button"
                onClick={() => setFilter('All')}
                className="mt-4 rounded-pill border border-line px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-primary/40"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trending.map((ipo, i) => (
                <div key={ipo.slug} className="anim-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <IpoCard ipo={ipo} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
