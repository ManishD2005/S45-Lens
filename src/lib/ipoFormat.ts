import { getIpoOpenCloseDates } from './ipoEvents'
import type { IpoSummary, StatusTone } from '../types'

export const STATUS_PILL_STYLE: Record<StatusTone, string> = {
  'high-confidence': 'bg-[#14B1A5] text-white',
  'mixed-signals': 'bg-[#FFC917] text-ink',
  closed: 'bg-white/20 text-white',
}

export const STATUS_PILL_LABEL: Record<StatusTone, string> = {
  'high-confidence': 'High confidence',
  'mixed-signals': 'Mixed signals',
  closed: 'Closed',
}

const MONOGRAM_COLORS = ['#DC2626', '#1D4ED8', '#7C3AED', '#EA580C', '#0891B2']

export function monogramColor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return MONOGRAM_COLORS[hash % MONOGRAM_COLORS.length]
}

export function formatInr(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`
}

export function isIpoListed(ipo: IpoSummary): boolean {
  return typeof ipo.listedPrice === 'number'
}

function daysBetween(from: Date, to: Date): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate())
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

export function getIpoCountdownText(ipo: IpoSummary): string {
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
