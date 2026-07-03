import { ipoSummaries } from '../data/ipos'
import type { IpoSummary } from '../types'

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
export function getIpoOpenCloseDates(ipo: IpoSummary): { openDate: Date; closeDate: Date } | null {
  if (!ipo.isOpen || typeof ipo.closesInDays !== 'number') return null
  const today = startOfDay(new Date())
  const closeDate = addDays(today, ipo.closesInDays)
  const openDate = addDays(closeDate, -OPEN_WINDOW_DAYS)
  return { openDate, closeDate }
}

export function getIpoEvents(): IpoEvent[] {
  const events: IpoEvent[] = []

  for (const ipo of ipoSummaries) {
    const dates = getIpoOpenCloseDates(ipo)
    if (!dates) continue

    const listingDate = addDays(dates.closeDate, LISTING_OFFSET_DAYS)

    events.push(
      { date: dates.openDate, type: 'open', ipoSlug: ipo.slug, ipoName: ipo.name },
      { date: dates.closeDate, type: 'close', ipoSlug: ipo.slug, ipoName: ipo.name },
      { date: listingDate, type: 'listing', ipoSlug: ipo.slug, ipoName: ipo.name },
    )
  }

  return events
}
