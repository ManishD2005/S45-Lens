import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getIpoEvents, type IpoEvent, type IpoEventType } from '../lib/ipoEvents'

const DRAG_THRESHOLD_PX = 5
const WINDOW_DAYS = 4 // today (0) through the next 4 days
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function daysUntil(today: Date, target: Date): number {
  const a = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const b = new Date(target.getFullYear(), target.getMonth(), target.getDate())
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

function ordinal(day: number): string {
  const v = day % 100
  if (v >= 11 && v <= 13) return `${day}th`
  switch (day % 10) {
    case 1:
      return `${day}st`
    case 2:
      return `${day}nd`
    case 3:
      return `${day}rd`
    default:
      return `${day}th`
  }
}

function statusText(type: IpoEventType, days: number, date: Date): string {
  const verb = type === 'open' ? 'opens' : type === 'close' ? 'closes' : 'lists'
  if (days === 0) return `${verb} today`
  if (days === 1) return `${verb} tomorrow`
  return `${verb} on ${ordinal(date.getDate())} ${MONTH_LABELS[date.getMonth()]}`
}

export function UpcomingEventsRow() {
  const today = new Date()
  const scrollerRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, startX: 0, startScrollLeft: 0, moved: false, pointerId: 0 })
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const upcoming = getIpoEvents()
    .map((event) => ({ ...event, days: daysUntil(today, event.date) }))
    .filter((event) => event.days >= 0 && event.days <= WINDOW_DAYS)
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  function updateScrollState() {
    const el = scrollerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    updateScrollState()
    window.addEventListener('resize', updateScrollState)
    return () => window.removeEventListener('resize', updateScrollState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upcoming.length])

  if (upcoming.length === 0) return null

  function handlePointerDown(e: React.PointerEvent) {
    if (e.pointerType !== 'mouse') return
    const el = scrollerRef.current
    if (!el) return
    drag.current = { active: true, startX: e.clientX, startScrollLeft: el.scrollLeft, moved: false, pointerId: e.pointerId }
    // Pointer capture is deferred to the first real move — capturing here would
    // retarget the eventual click away from the <Link>, breaking plain clicks.
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (e.pointerType !== 'mouse' || !drag.current.active) return
    const el = scrollerRef.current
    if (!el) return
    const delta = e.clientX - drag.current.startX
    if (!drag.current.moved && Math.abs(delta) > DRAG_THRESHOLD_PX) {
      drag.current.moved = true
      el.setPointerCapture(drag.current.pointerId)
    }
    if (drag.current.moved) el.scrollLeft = drag.current.startScrollLeft - delta
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (e.pointerType !== 'mouse') return
    drag.current.active = false
    if (drag.current.moved) scrollerRef.current?.releasePointerCapture(e.pointerId)
  }

  function handleCardClick(e: React.MouseEvent) {
    if (drag.current.moved) e.preventDefault()
  }

  return (
    <div className="border-b border-line bg-surface" aria-label="Upcoming IPO events">
      <div className="relative mx-auto max-w-7xl">
        <div
          ref={scrollerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onScroll={updateScrollState}
          className="scrollbar-none flex cursor-grab select-none items-center gap-3 overflow-x-auto whitespace-nowrap px-4 py-3 active:cursor-grabbing sm:px-8"
        >
          {upcoming.map((event: IpoEvent & { days: number }) => {
            const isToday = event.days === 0
            return (
              <Link
                key={`${event.ipoSlug}-${event.type}`}
                to={`/ipo/${event.ipoSlug}`}
                onClick={handleCardClick}
                draggable={false}
                className={`flex shrink-0 items-center gap-2.5 rounded-pill py-2 pl-2 pr-5 transition-colors ${
                  isToday ? 'bg-primary hover:bg-primary-hover' : 'bg-surface-sunken hover:bg-line/60'
                }`}
              >
                <span
                  className={`shrink-0 whitespace-nowrap rounded-pill px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide ${
                    isToday ? 'bg-accent text-white' : 'bg-surface text-ink-muted'
                  }`}
                >
                  {statusText(event.type, event.days, event.date)}
                </span>
                <span className={`text-sm font-medium ${isToday ? 'text-white' : 'text-ink'}`}>
                  {event.ipoName.split(' (')[0]}
                </span>
              </Link>
            )
          })}
        </div>

        {canScrollLeft && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-surface to-transparent sm:w-16"
          />
        )}
        {canScrollRight && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-surface to-transparent sm:w-16"
          />
        )}
      </div>
    </div>
  )
}
