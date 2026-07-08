import { useEffect, useRef, useState } from 'react'
import type { IpoDetail } from '../../types'
import { FactRow } from '../../components/FactRow'
import { PhaseTag } from '../../components/PhaseTag'
import { IconChevronRight } from '../../components/icons'
import {
  LIFECYCLE_STATUS_LABEL,
  LIFECYCLE_STATUS_STYLE,
  buildAtAGlance,
  formatInr,
  getIpoLifecycleStatus,
  getSourceCheckLines,
  isIpoListed,
} from '../../lib/ipoFormat'

function VerifiedSourcesNote({ ipo }: { ipo: IpoDetail }) {
  const [open, setOpen] = useState(false)
  const [supportsHover, setSupportsHover] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSupportsHover(window.matchMedia('(hover: hover)').matches)
  }, [])

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (ipo.sourcesChecked.length === 0) {
    return <span className="text-ink-muted">Verified against {ipo.verifiedSourceCount} independent sources</span>
  }

  const checkLines = getSourceCheckLines(ipo)

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => supportsHover && setOpen(true)}
      onMouseLeave={() => supportsHover && setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="border-b border-dashed border-ink-faint pb-0.5 text-ink-muted transition-colors hover:border-ink-muted hover:text-ink"
      >
        Verified against {ipo.verifiedSourceCount} independent sources
      </button>
      {open && (
        <div
          role="tooltip"
          className="anim-fade-up absolute bottom-full right-0 z-10 mb-2 w-80 rounded-card border border-line bg-surface p-3.5 shadow-lg"
        >
          <p className="label-caps mb-2.5 text-ink-faint">Sources checked</p>
          <div className="space-y-2.5">
            {checkLines.map((line) => (
              <div key={line.category}>
                <p className="text-xs font-medium text-ink">{line.category}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{line.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function SummaryTab({ ipo, onViewFullReport }: { ipo: IpoDetail; onViewFullReport: () => void }) {
  const latestUpdate = ipo.postListing?.updates[0]
  const lifecycleStatus = getIpoLifecycleStatus(ipo)

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xl font-semibold text-heading">At a glance</p>
          <PhaseTag variant="fact" />
        </div>
        <div className="rounded-card border border-line bg-surface-sunken p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-sm bg-[#3F444A] px-2.5 py-1 text-[0.6875rem] font-medium uppercase tracking-wide text-white">
              {ipo.category}
            </span>
            <span
              className={`rounded-sm px-2.5 py-1 text-[0.6875rem] font-medium uppercase tracking-wide ${LIFECYCLE_STATUS_STYLE[lifecycleStatus]}`}
            >
              {LIFECYCLE_STATUS_LABEL[lifecycleStatus]}
            </span>
          </div>
          <p className="text-[0.95rem] leading-relaxed text-ink">{buildAtAGlance(ipo)}</p>
        </div>
      </section>

      <section>
        <p className="mb-6 text-xl font-semibold text-heading">Top 3 facts that matter</p>
        <div className="space-y-2.5">
          {ipo.topFacts.map((fact, i) => (
            <FactRow key={i} fact={fact} />
          ))}
        </div>
      </section>

      {isIpoListed(ipo) && (
        <section>
          <p className="mb-6 text-xl font-semibold text-heading">Since listing</p>
          <div className="rounded-card border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold text-ink">{formatInr(ipo.listedPrice!)}</span>
              {typeof ipo.listedChangePercent === 'number' && (
                <span className={`text-sm font-medium ${ipo.listedChangePercent >= 0 ? 'text-primary' : 'text-danger'}`}>
                  {ipo.listedChangePercent >= 0 ? '+' : ''}
                  {ipo.listedChangePercent}% vs issue price
                </span>
              )}
            </div>
            {latestUpdate && (
              <button
                type="button"
                onClick={onViewFullReport}
                className="mt-3 flex w-full items-center justify-between gap-2 rounded-card bg-surface-sunken px-3.5 py-2.5 text-left text-sm text-ink-muted transition-colors hover:text-ink"
              >
                <span>Latest: {latestUpdate.title}</span>
                <IconChevronRight width={14} height={14} className="shrink-0" />
              </button>
            )}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-1.5 rounded-card bg-surface-sunken px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        {ipo.fullReport ? (
          <button
            type="button"
            onClick={onViewFullReport}
            className="flex items-center gap-1.5 font-medium text-primary transition-colors hover:text-primary/80"
          >
            View full research report
            <IconChevronRight width={16} height={16} />
          </button>
        ) : (
          <span />
        )}
        <VerifiedSourcesNote ipo={ipo} />
      </section>
    </div>
  )
}
