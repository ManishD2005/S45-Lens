import { Link } from 'react-router-dom'
import { getIpoOpenCloseDates } from '../lib/ipoEvents'
import { useAppState } from '../lib/appState'
import { IconBookmark } from './icons'
import type { IpoSummary } from '../types'

const MONOGRAM_COLORS = ['#DC2626', '#1D4ED8', '#7C3AED', '#EA580C', '#0891B2']

function monogramColor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return MONOGRAM_COLORS[hash % MONOGRAM_COLORS.length]
}

function formatInr(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`
}

function daysBetween(from: Date, to: Date): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate())
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

function countdownText(ipo: IpoSummary): string {
  if (typeof ipo.listedChangePercent === 'number') {
    const sign = ipo.listedChangePercent >= 0 ? '+' : ''
    return `Listed | ${sign}${ipo.listedChangePercent}%`
  }

  const dates = getIpoOpenCloseDates(ipo)
  if (!dates) return 'Closed'

  const today = new Date()
  const hasOpened = today >= dates.openDate

  const days = hasOpened ? daysBetween(today, dates.closeDate) : daysBetween(today, dates.openDate)
  const unit = days === 1 ? 'day' : 'days'
  return hasOpened ? `Closes in ${days} ${unit}` : `Opens in ${days} ${unit}`
}

const STATUS_PILL_STYLE: Record<string, string> = {
  'high-confidence': 'bg-[#14B1A5] text-white',
  'mixed-signals': 'bg-[#FFC917] text-ink',
  closed: 'bg-white/20 text-white',
}

const STATUS_LABEL: Record<string, string> = {
  'high-confidence': 'High confidence',
  'mixed-signals': 'Mixed signals',
  closed: 'Closed',
}

export function IpoCard({ ipo }: { ipo: IpoSummary }) {
  const { isSaved, toggleSaved } = useAppState()
  const closed = ipo.status === 'closed'
  const shortName = ipo.name.split(' (')[0]
  const saved = isSaved(ipo.slug)

  function handleSave(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleSaved(ipo.slug)
  }

  return (
    <Link
      to={`/ipo/${ipo.slug}`}
      className={`group block h-full overflow-hidden rounded-md border border-line bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_8px_24px_-8px_rgba(5,93,86,0.2)] ${
        closed ? 'opacity-60' : ''
      }`}
    >
      <div className="relative bg-gradient-to-b from-[#003A36] to-[#055D56] p-5">
        <button
          type="button"
          onClick={handleSave}
          aria-label={saved ? 'Remove from saved' : 'Save this IPO'}
          aria-pressed={saved}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center text-white transition-opacity duration-150 hover:opacity-80 focus-visible:opacity-100 ${
            saved ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <IconBookmark filled={saved} width={18} height={18} />
        </button>

        <div className="flex items-start gap-3">
          {ipo.logoUrl ? (
            <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-sm bg-white p-2">
              <img src={ipo.logoUrl} alt="" className="h-full w-full object-contain" />
            </span>
          ) : (
            <span
              className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-sm bg-white text-2xl font-bold"
              style={{ color: monogramColor(ipo.slug) }}
              aria-hidden="true"
            >
              {shortName.charAt(0)}
            </span>
          )}
          <div className="min-w-0 flex-1 pr-9">
            <h3 className="truncate text-lg font-medium text-white">{shortName}</h3>
            <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-white/70">{ipo.oneLiner}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-sm bg-ink/70 px-2.5 py-1 text-[0.6875rem] font-medium uppercase tracking-wide text-white">
            {ipo.category}
          </span>
          <span
            className={`rounded-sm px-2.5 py-1 text-[0.6875rem] font-medium uppercase tracking-wide ${STATUS_PILL_STYLE[ipo.status]}`}
          >
            {STATUS_LABEL[ipo.status]}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-[0.95rem] font-medium text-ink">{countdownText(ipo)}</span>
        {typeof ipo.listedPrice === 'number' ? (
          <span className="text-[0.95rem] font-medium text-ink">{formatInr(ipo.listedPrice)}</span>
        ) : (
          typeof ipo.minInvestment === 'number' && (
            <span className="text-[0.95rem] font-medium text-ink">Min {formatInr(ipo.minInvestment)}</span>
          )
        )}
      </div>
    </Link>
  )
}
