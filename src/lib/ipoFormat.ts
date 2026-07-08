import { getIpoOpenCloseDates } from './ipoEvents'
import type { IpoDetail, IpoLifecycleStatus, IpoSummary } from '../types'

const CLOSING_SOON_THRESHOLD_DAYS = 2

export const LIFECYCLE_STATUS_STYLE: Record<IpoLifecycleStatus, string> = {
  open: 'bg-[#14B1A5] text-white',
  'closing-soon': 'bg-[#FFC917] text-ink',
  listed: 'bg-[#14B1A5] text-white',
  closed: 'bg-white/20 text-white',
}

export const LIFECYCLE_STATUS_LABEL: Record<IpoLifecycleStatus, string> = {
  open: 'Open',
  'closing-soon': 'Closing soon',
  listed: 'Listed',
  closed: 'Closed',
}

/**
 * Purely lifecycle-based (open / closing soon / listed / closed) — computed
 * from isOpen, closesInDays, and listedPrice, never authored per company.
 */
export function getIpoLifecycleStatus(ipo: IpoSummary): IpoLifecycleStatus {
  if (isIpoListed(ipo)) return 'listed'
  if (!ipo.isOpen) return 'closed'
  if (typeof ipo.closesInDays !== 'number') return 'open'

  const dates = getIpoOpenCloseDates(ipo)
  if (!dates) return 'open'

  const daysToClose = daysBetween(new Date(), dates.closeDate)
  return daysToClose <= CLOSING_SOON_THRESHOLD_DAYS ? 'closing-soon' : 'open'
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

export function formatCr(value: number): string {
  return `₹${value.toLocaleString('en-IN')} Cr`
}

/**
 * "Primary" allocation = the first bucket in useOfProceedsBreakdown. Every
 * authored IPO lists its headline capex/allocation item first, matching what
 * each company's free-text useOfProceeds sentence already leads with — so
 * this stays generic without parsing that free text.
 */
function primaryUseOfProceedsPhrase(ipo: IpoDetail): string | null {
  const primary = ipo.useOfProceedsBreakdown[0]
  const totalRaisedCr = ipo.fullReport?.issueMechanics.freshIssueCr
  if (!primary || typeof totalRaisedCr !== 'number') return null

  const detail = primary.label.includes('–') ? primary.label.split('–')[1].trim() : primary.label
  const lowered = detail.charAt(0).toLowerCase() + detail.slice(1)
  return `Raising ${formatCr(totalRaisedCr)}, mainly for ${lowered}.`
}

/**
 * Template-only summary for the Summary tab's "At a glance" card and the
 * share preview text — never freely authored, so it can't drift into opinion.
 * Fixed structure: business description + first topFact (the growth/scale
 * metric every company's data authors first) + primary use-of-proceeds line.
 */
export function buildAtAGlance(ipo: IpoDetail): string {
  const parts: string[] = []
  if (ipo.oneLiner) parts.push(`${ipo.oneLiner}.`)

  const keyFact = ipo.topFacts[0]
  if (keyFact) parts.push(`${keyFact.text}.`)

  const proceedsPhrase = primaryUseOfProceedsPhrase(ipo)
  if (proceedsPhrase) parts.push(proceedsPhrase)

  return parts.join(' ')
}

export function isIpoListed(ipo: IpoSummary): boolean {
  return typeof ipo.listedPrice === 'number'
}

const SOURCE_CATEGORIES = ['DRHP / RHP', 'MCA filings', 'SEBI orders', 'Litigation records', 'Exchange filings'] as const

export interface SourceCheckLine {
  category: string
  text: string
}

/**
 * Per-category verification detail for the "Verified against N independent
 * sources" note. Distinguishes "checked, nothing to report" from "not yet
 * checked" instead of collapsing every category into one word — and where
 * a check actually found something (e.g. Orbit's MCA cross-check), says so
 * rather than falsely claiming a clean result.
 */
export function getSourceCheckLines(ipo: IpoDetail): SourceCheckLine[] {
  return SOURCE_CATEGORIES.map((category) => {
    const checked = ipo.sourcesChecked.includes(category)

    if (category === 'DRHP / RHP') {
      return {
        category,
        text: checked
          ? 'Filed with SEBI — the base source for every fact shown in this app.'
          : 'Not yet available for this IPO.',
      }
    }

    if (category === 'MCA filings') {
      if (!checked) return { category, text: 'Not yet checked.' }
      return ipo.promoter.notableAffiliation
        ? { category, text: `Checked — flagged: ${ipo.promoter.notableAffiliation}` }
        : { category, text: 'Checked against company and promoter registry records — nothing flagged.' }
    }

    if (category === 'SEBI orders') {
      return {
        category,
        text: checked ? "Checked against SEBI's enforcement database — none found, nothing to report." : 'Not yet checked.',
      }
    }

    if (category === 'Litigation records') {
      return {
        category,
        text: checked ? 'Reviewed court and tribunal filings — no material undisclosed litigation found.' : 'Pending.',
      }
    }

    // Exchange filings
    if (checked) return { category, text: 'Tracked for material updates since listing.' }
    return { category, text: isIpoListed(ipo) ? 'Pending.' : 'Not applicable — company has not listed yet.' }
  })
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
