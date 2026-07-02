import type { IpoDetail } from '../../types'
import { InfoCard } from '../../components/InfoCard'

export function TransparencyTab({ ipo }: { ipo: IpoDetail }) {
  return (
    <div className="space-y-8">
      <section>
        <p className="label-caps mb-3 text-ink-muted">Fact vs. S45&rsquo;s read</p>
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

      <section>
        <p className="label-caps mb-3 text-ink-muted">Sources checked</p>
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
