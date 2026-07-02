import type { IpoDetail } from '../../types'
import { FactRow } from '../../components/FactRow'
import { InfoCard } from '../../components/InfoCard'
import { PhaseTag } from '../../components/PhaseTag'

export function SummaryTab({ ipo }: { ipo: IpoDetail }) {
  return (
    <div className="space-y-8">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <p className="label-caps text-ink-muted">S45 Lens verdict</p>
          <PhaseTag variant="read" />
        </div>
        <InfoCard variant="read" label={ipo.confidenceLabel}>
          <h2 className="mb-2 font-serif text-xl leading-snug text-ink">{ipo.verdictHeadline}</h2>
          <p className="text-ink-muted">{ipo.verdictBody}</p>
        </InfoCard>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <p className="label-caps text-ink-muted">Top 3 facts that matter</p>
          <PhaseTag variant="fact" />
        </div>
        <div className="space-y-2.5">
          {ipo.topFacts.map((fact, i) => (
            <FactRow key={i} fact={fact} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-1.5 rounded-card bg-surface-sunken px-5 py-4 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <span>Verified against {ipo.verifiedSourceCount} independent sources</span>
        {ipo.isOpen && typeof ipo.closesInDays === 'number' && (
          <span className="font-medium text-ink">
            {ipo.closesInDays === 1 ? '1 day left to apply' : `${ipo.closesInDays} days left to apply`}
          </span>
        )}
      </section>
    </div>
  )
}
