import { ipoSummaries } from '../data/ipos'

export type IpoEventType = 'open' | 'close' | 'listing'

export interface IpoEvent {
  date: Date
  type: IpoEventType
  ipoSlug: string
  ipoName: string
}

const OPEN_WINDOW_DAYS = 2
const LISTING_OFFSET_DAYS = 3

function addDays(base: Date, days: number): Date {
  const next = new Date(base)
  next.setDate(next.getDate() + days)
  return next
}

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Open/close/listing dates aren't in the mock data — only closesInDays is.
 * Derive them relative to real "today" so upcoming-events copy elsewhere in
 * the app stays consistent no matter when this is viewed.
 */
export function getIpoEvents(): IpoEvent[] {
  const today = startOfDay(new Date())
  const events: IpoEvent[] = []

  for (const ipo of ipoSummaries) {
    if (!ipo.isOpen || typeof ipo.closesInDays !== 'number') continue

    const closeDate = addDays(today, ipo.closesInDays)
    const openDate = addDays(closeDate, -OPEN_WINDOW_DAYS)
    const listingDate = addDays(closeDate, LISTING_OFFSET_DAYS)

    events.push(
      { date: openDate, type: 'open', ipoSlug: ipo.slug, ipoName: ipo.name },
      { date: closeDate, type: 'close', ipoSlug: ipo.slug, ipoName: ipo.name },
      { date: listingDate, type: 'listing', ipoSlug: ipo.slug, ipoName: ipo.name },
    )
  }

  return events
}
