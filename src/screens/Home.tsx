import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ipoSummaries } from '../data/ipos'
import { IpoCard } from '../components/IpoCard'
import { UpcomingEventsRow } from '../components/UpcomingEventsRow'
import { Footer } from '../components/Footer'
import { getIpoListedDate, getIpoRelevantOpenDate } from '../lib/ipoEvents'
import { isIpoListed } from '../lib/ipoFormat'
import type { IpoSummary } from '../types'

function IpoSection({
  title,
  ipos,
  hasMore,
  viewMoreFilter,
  emptyMessage,
}: {
  title: string
  ipos: IpoSummary[]
  hasMore: boolean
  viewMoreFilter: 'open-upcoming' | 'recently-listed'
  emptyMessage: string
}) {
  return (
    <section aria-label={title} className="mb-10">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-heading">{title}</h2>
        {hasMore && (
          <Link
            to={`/search?filter=${viewMoreFilter}`}
            className="shrink-0 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View more
          </Link>
        )}
      </div>

      {ipos.length === 0 ? (
        <div className="rounded-card border border-line bg-surface-sunken px-5 py-12 text-center">
          <p className="text-sm text-ink-muted">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ipos.map((ipo, i) => (
            <div key={ipo.slug} className="anim-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <IpoCard ipo={ipo} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export function Home() {
  const openAndUpcomingAll = useMemo(() => {
    return ipoSummaries
      .filter((ipo) => ipo.isOpen)
      .map((ipo) => ({ ipo, date: getIpoRelevantOpenDate(ipo) }))
      .filter((entry): entry is { ipo: IpoSummary; date: Date } => entry.date !== null)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((entry) => entry.ipo)
  }, [])

  const recentlyListedAll = useMemo(() => {
    return ipoSummaries
      .filter((ipo) => isIpoListed(ipo))
      .map((ipo) => ({ ipo, date: getIpoListedDate(ipo) }))
      .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))
      .map((entry) => entry.ipo)
  }, [])

  return (
    <div>
      <UpcomingEventsRow />

      <div className="mx-auto max-w-7xl px-4 pb-3 pt-8 sm:px-8">
        <IpoSection
          title="Open & Upcoming"
          ipos={openAndUpcomingAll.slice(0, 3)}
          hasMore={openAndUpcomingAll.length > 3}
          viewMoreFilter="open-upcoming"
          emptyMessage="No open or upcoming IPOs right now."
        />

        <IpoSection
          title="Recently Listed"
          ipos={recentlyListedAll.slice(0, 3)}
          hasMore={recentlyListedAll.length > 3}
          viewMoreFilter="recently-listed"
          emptyMessage="No recently listed IPOs yet."
        />
      </div>

      <Footer />
    </div>
  )
}
