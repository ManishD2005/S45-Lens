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

export interface TimelineStep {
  label: string
  date: Date
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export function formatEventDate(date: Date): string {
  return DATE_FORMAT.format(date)
}

/**
 * Post-listing updates are stored as an offset from "today" (not an absolute
 * date) so they stay fresh no matter when this is viewed, same principle as
 * the rest of this file.
 */
export function dateDaysAgo(days: number): Date {
  return addDays(startOfDay(new Date()), -days)
}

/**
 * Standard SEBI T+3 listing timeline, derived from the same open/close dates
 * used elsewhere so the Full Report tab stays consistent with the rest of the app.
 */
export function getIpoFullTimeline(ipo: IpoSummary): TimelineStep[] | null {
  const dates = getIpoOpenCloseDates(ipo)
  if (!dates) return null

  return [
    { label: 'Anchor investor bidding', date: addDays(dates.openDate, -1) },
    { label: 'IPO opens', date: dates.openDate },
    { label: 'IPO closes', date: dates.closeDate },
    { label: 'Basis of allotment finalised', date: addDays(dates.closeDate, 1) },
    { label: 'Refunds initiated', date: addDays(dates.closeDate, 1) },
    { label: 'Shares credited to demat', date: addDays(dates.closeDate, 2) },
    { label: 'Listing date', date: addDays(dates.closeDate, LISTING_OFFSET_DAYS) },
  ]
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
