import type { IpoDetail } from '../../types'
import { InfoCard } from '../../components/InfoCard'
import { PhaseTag } from '../../components/PhaseTag'
import { IconUser } from '../../components/icons'

export function DeepDiveTab({ ipo }: { ipo: IpoDetail }) {
  return (
    <div className="space-y-8">
      <section>
        <p className="label-caps mb-3 text-ink-muted">Business model</p>
        <InfoCard variant="fact" label="From the DRHP">
          {ipo.businessModel}
        </InfoCard>
      </section>

      <section>
        <p className="label-caps mb-3 text-ink-muted">Use of proceeds</p>
        <InfoCard variant="fact" label="From the DRHP">
          {ipo.useOfProceeds}
        </InfoCard>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <p className="label-caps text-ink-muted">Risk factors, ranked by materiality</p>
          <PhaseTag variant="read" />
        </div>
        <div className="overflow-hidden rounded-card border border-dashed border-accent/60 bg-surface">
          {ipo.risks.map((risk, i) => (
            <div
              key={risk.rank}
              className={`flex items-start gap-3.5 px-5 py-3.5 ${i !== ipo.risks.length - 1 ? 'border-b border-line' : ''}`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-xs text-white">
                {risk.rank}
              </span>
              <p className="pt-0.5 text-[0.95rem] text-ink">{risk.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="label-caps mb-3 text-ink-muted">Promoter &amp; governance</p>
        <div className="flex items-center gap-4 rounded-card border border-line bg-surface p-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface-sunken text-ink-faint">
            <IconUser width={26} height={26} />
          </div>
          <div>
            <p className="font-medium text-ink">{ipo.promoter.name}</p>
            <p className="text-sm text-ink-muted">Holds ~{ipo.promoter.holdingPct}% &middot; {ipo.promoter.context}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
