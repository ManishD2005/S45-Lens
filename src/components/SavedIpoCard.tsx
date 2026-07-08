import { Link } from 'react-router-dom'
import {
  LIFECYCLE_STATUS_LABEL,
  LIFECYCLE_STATUS_STYLE,
  formatInr,
  getIpoLifecycleStatus,
  monogramColor,
} from '../lib/ipoFormat'
import type { IpoSummary } from '../types'

export function SavedIpoCard({ ipo }: { ipo: IpoSummary }) {
  const lifecycleStatus = getIpoLifecycleStatus(ipo)
  const shortName = ipo.name.split(' (')[0]
  const isListed = typeof ipo.listedPrice === 'number'
  const priceText = isListed
    ? formatInr(ipo.listedPrice!)
    : typeof ipo.minInvestment === 'number'
      ? `Min ${formatInr(ipo.minInvestment)}`
      : null
  const changePercent = ipo.listedChangePercent

  return (
    <Link
      to={`/ipo/${ipo.slug}`}
      className="flex flex-col items-center gap-2.5 rounded-card border border-line bg-surface p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_8px_24px_-8px_rgba(5,93,86,0.2)]"
    >
      {ipo.logoUrl ? (
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm bg-surface-sunken p-2">
          <img src={ipo.logoUrl} alt="" className="h-full w-full object-contain" />
        </span>
      ) : (
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm bg-surface-sunken text-xl font-bold"
          style={{ color: monogramColor(ipo.slug) }}
          aria-hidden="true"
        >
          {shortName.charAt(0)}
        </span>
      )}

      <p className="w-full truncate text-sm font-medium text-ink">{shortName}</p>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <span className="rounded-sm bg-[#3F444A] px-2 py-0.5 text-[0.625rem] font-medium uppercase tracking-wide text-white">
          {ipo.category}
        </span>
        <span
          className={`rounded-sm px-2 py-0.5 text-[0.625rem] font-medium uppercase tracking-wide ${
            lifecycleStatus === 'closed' ? 'bg-surface-sunken text-ink-faint' : LIFECYCLE_STATUS_STYLE[lifecycleStatus]
          }`}
        >
          {LIFECYCLE_STATUS_LABEL[lifecycleStatus]}
        </span>
      </div>

      {priceText && (
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium text-ink">{priceText}</p>
          {isListed && typeof changePercent === 'number' && (
            <span className={`text-xs font-semibold ${changePercent >= 0 ? 'text-primary' : 'text-danger'}`}>
              {changePercent >= 0 ? '+' : ''}
              {changePercent}%
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
