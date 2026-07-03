import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ipoSummaries } from '../data/ipos'
import { IpoCard } from '../components/IpoCard'
import { UpcomingEventsRow } from '../components/UpcomingEventsRow'
import { useAppState } from '../lib/appState'

const POPULARITY_WINDOW_MS = 7 * 24 * 60 * 60 * 1000

export function Home() {
  const { ipoViews } = useAppState()

  const trending = useMemo(() => {
    const cutoff = Date.now() - POPULARITY_WINDOW_MS
    const viewCounts = new Map<string, number>()
    for (const entry of ipoViews) {
      if (entry.at < cutoff) continue
      viewCounts.set(entry.slug, (viewCounts.get(entry.slug) ?? 0) + 1)
    }

    return ipoSummaries
      .filter((ipo) => ipo.isOpen)
      .sort((a, b) => {
        const viewDiff = (viewCounts.get(b.slug) ?? 0) - (viewCounts.get(a.slug) ?? 0)
        if (viewDiff !== 0) return viewDiff
        return (a.closesInDays ?? 99) - (b.closesInDays ?? 99)
      })
      .slice(0, 3)
  }, [ipoViews])

  return (
    <div>
      <UpcomingEventsRow />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-8">
        <section aria-label="Popular IPOs">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-ink">Popular IPOs on S45 Lens</h2>
            <Link
              to="/search"
              className="shrink-0 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              View more
            </Link>
          </div>

          {trending.length === 0 ? (
            <div className="rounded-card border border-line bg-surface-sunken px-5 py-12 text-center">
              <p className="text-sm text-ink-muted">No open IPOs right now.</p>
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
