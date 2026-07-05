import { useState } from 'react'
import type { IpoDetail } from '../../types'
import { InfoCard } from '../../components/InfoCard'
import { IconChevronRight } from '../../components/icons'

const METHODOLOGY: Record<string, string> = {
  'DRHP / RHP':
    "The Draft Red Herring Prospectus and Red Herring Prospectus are the company's own SEBI-filed disclosure documents — the base source for every fact shown in this app.",
  'MCA filings':
    "We compare promoter and director names against the Ministry of Corporate Affairs' company registry to check for undisclosed prior directorships, struck-off companies, or shell-company red flags.",
  'SEBI orders':
    "We check promoter and director names against SEBI's public enforcement database for past orders, bans, or penalties.",
  'Litigation records':
    'We review court and tribunal filings referencing the company or its promoters for material pending litigation not already disclosed in the DRHP.',
  'Exchange filings':
    'Once listed, we track NSE/BSE disclosures for material company-specific updates — board decisions, dividends, shareholding changes — not general market commentary.',
}

function HowWeVerify({ sourcesChecked }: { sourcesChecked: string[] }) {
  const [open, setOpen] = useState(false)
  const relevant = sourcesChecked.filter((source) => METHODOLOGY[source])
  if (relevant.length === 0) return null

  return (
    <section>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-card border border-line bg-surface px-5 py-4 text-left transition-colors hover:bg-surface-sunken"
      >
        <span className="text-sm font-medium text-ink">How we verify</span>
        <IconChevronRight
          width={16}
          height={16}
          className={`shrink-0 text-ink-faint transition-transform ${open ? 'rotate-90' : ''}`}
        />
      </button>
      {open && (
        <div className="anim-fade-up mt-2 space-y-3 rounded-card border border-line bg-surface-sunken p-5">
          {relevant.map((source) => (
            <div key={source}>
              <p className="text-sm font-medium text-ink">{source}</p>
              <p className="mt-0.5 text-sm text-ink-muted">{METHODOLOGY[source]}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export function TransparencyTab({ ipo, onViewFullReport }: { ipo: IpoDetail; onViewFullReport: () => void }) {
  return (
    <div className="space-y-8">
      <section>
        <p className="mb-3 text-xl font-semibold text-heading">Fact vs. S45&rsquo;s read</p>
        <div className="space-y-4">
          {ipo.factReadPairs.length === 0 && (
            <p className="rounded-card border border-line bg-surface-sunken px-5 py-8 text-center text-sm text-ink-muted">
              No fact/read pairs available for this IPO in the prototype.
            </p>
          )}
          {ipo.factReadPairs.map((pair, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoCard variant="fact" label="From the DRHP">
                {pair.fact}
              </InfoCard>
              <InfoCard variant="read" label="S45's read">
                {pair.read}
              </InfoCard>
            </div>
          ))}
        </div>
      </section>

      {ipo.leadManager && (
        <section>
          <p className="mb-3 text-xl font-semibold text-heading">Lead manager track record</p>
          <InfoCard variant="fact" label="From source">
            <p className="font-medium text-ink">{ipo.leadManager.name}</p>
            <p className="mt-1 text-ink-muted">
              {`${ipo.leadManager.belowIssuePriceCount} of ${ipo.leadManager.totalIssues} issues (${Math.round((ipo.leadManager.belowIssuePriceCount / ipo.leadManager.totalIssues) * 100)}%) closed below issue price on listing day.`}
            </p>
            <button
              type="button"
              onClick={onViewFullReport}
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              See all {ipo.leadManager.totalIssues} issues
              <IconChevronRight width={14} height={14} />
            </button>
          </InfoCard>
        </section>
      )}

      <section>
        <p className="mb-3 text-xl font-semibold text-heading">Sources checked</p>
        <div className="flex flex-wrap gap-2">
          {ipo.sourcesChecked.length === 0 ? (
            <p className="text-sm text-ink-faint">Not available for this IPO in the prototype.</p>
          ) : (
            ipo.sourcesChecked.map((source) => (
              <span key={source} className="label-caps rounded-pill bg-primary px-3 py-1.5 text-white">
                {source}
              </span>
            ))
          )}
        </div>
      </section>

      <HowWeVerify sourcesChecked={ipo.sourcesChecked} />

      <section className="flex items-start gap-3 rounded-card border border-line bg-surface-sunken px-5 py-4">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[0.65rem] font-semibold text-white">
          AI
        </span>
        <p className="text-sm text-ink-muted">
          Facts are AI-drafted from primary filings and reviewed by an S45 analyst before publishing. The read/verdict
          content is gated behind SEBI Research Analyst registration in the real product.
        </p>
      </section>
    </div>
  )
}
