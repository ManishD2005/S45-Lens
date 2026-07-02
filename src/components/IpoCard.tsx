import { Link } from 'react-router-dom'
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
  const closed = ipo.status === 'closed'
  const shortName = ipo.name.split(' (')[0]

  return (
    <Link
      to={`/ipo/${ipo.slug}`}
      className={`group block h-full overflow-hidden rounded-md border border-line bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_8px_24px_-8px_rgba(5,93,86,0.2)] ${
        closed ? 'opacity-60' : ''
      }`}
    >
      <div className="bg-gradient-to-b from-[#003A36] to-[#055D56] p-5">
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
          <div className="min-w-0 flex-1">
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
        <span className="text-[0.95rem] font-medium text-ink">
          {typeof ipo.closesInDays === 'number'
            ? ipo.closesInDays === 1
              ? '1 Day left'
              : `${ipo.closesInDays} Days left`
            : 'Closed'}
        </span>
        {typeof ipo.minInvestment === 'number' && (
          <span className="text-[0.95rem] font-medium text-ink">Min {formatInr(ipo.minInvestment)}</span>
        )}
      </div>
    </Link>
  )
}
