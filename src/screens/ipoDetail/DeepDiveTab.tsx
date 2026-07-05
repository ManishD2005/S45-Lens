import { useState } from 'react'
import type { IpoDetail } from '../../types'
import { InfoCard } from '../../components/InfoCard'
import { IconThumbsDown, IconThumbsUp, IconUser } from '../../components/icons'
import { isIpoListed } from '../../lib/ipoFormat'

type StrengthsRisksTab = 'strengths' | 'risks'

export function DeepDiveTab({ ipo }: { ipo: IpoDetail }) {
  const [swTab, setSwTab] = useState<StrengthsRisksTab>('strengths')
  const hasStrengthsOrRisks = ipo.strengths.length > 0 || ipo.risks.length > 0
  const activeItems = swTab === 'strengths' ? ipo.strengths : ipo.risks.map((r) => r.text)

  return (
    <div className="space-y-8">
      <section>
        <p className="mb-3 text-xl font-semibold text-heading">Business model</p>
        <InfoCard variant="fact" label="From the DRHP">
          <div className="space-y-3">
            <div>
              <p className="label-caps mb-1 text-ink-faint">How they make money</p>
              <p>{ipo.howTheyMakeMoney}</p>
            </div>
            <div>
              <p className="label-caps mb-1 text-ink-faint">What they do</p>
              <p>{ipo.oneLiner}</p>
            </div>
            <div>
              <p className="label-caps mb-1 text-ink-faint">Their edge</p>
              <p>{ipo.strengths[0] ?? 'Not enough data to identify a clear edge yet.'}</p>
            </div>
          </div>
        </InfoCard>
      </section>

      <section>
        <p className="mb-3 text-xl font-semibold text-heading">Use of proceeds</p>
        <InfoCard variant="fact" label="From the DRHP">
          {ipo.useOfProceeds}
        </InfoCard>
      </section>

      {hasStrengthsOrRisks && (
        <section>
          <p className="mb-3 text-xl font-semibold text-heading">Strengths &amp; risks</p>
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => setSwTab('strengths')}
              aria-pressed={swTab === 'strengths'}
              className={`rounded-pill border px-4 py-2 text-sm font-medium transition-colors ${
                swTab === 'strengths'
                  ? 'border-line bg-surface-sunken text-ink'
                  : 'border-line text-ink-muted hover:text-ink'
              }`}
            >
              Strengths
            </button>
            <button
              type="button"
              onClick={() => setSwTab('risks')}
              aria-pressed={swTab === 'risks'}
              className={`rounded-pill border px-4 py-2 text-sm font-medium transition-colors ${
                swTab === 'risks' ? 'border-line bg-surface-sunken text-ink' : 'border-line text-ink-muted hover:text-ink'
              }`}
            >
              Risks
            </button>
          </div>

          {activeItems.length === 0 ? (
            <p className="rounded-card border border-line bg-surface-sunken px-5 py-6 text-center text-sm text-ink-muted">
              No {swTab} listed for this IPO in the prototype.
            </p>
          ) : (
            <div className="space-y-4">
              {activeItems.map((text, i) =>
                swTab === 'strengths' ? (
                  <div key={i} className="flex items-start gap-3">
                    <IconThumbsUp filled width={17} height={17} className="mt-0.5 shrink-0 text-primary" />
                    <p className="text-[0.95rem] leading-relaxed text-ink">{text}</p>
                  </div>
                ) : (
                  <div key={i} className="flex items-start gap-3">
                    <IconThumbsDown filled width={17} height={17} className="mt-0.5 shrink-0 text-[#C63B2A]" />
                    <p className="text-[0.95rem] leading-relaxed text-ink">{text}</p>
                  </div>
                ),
              )}
            </div>
          )}

          <p className="mt-4 text-xs text-ink-faint">
            Strengths from the DRHP &middot; Risks ranked by S45&rsquo;s read.
          </p>
        </section>
      )}

      <section>
        <p className="mb-3 text-xl font-semibold text-heading">Promoter &amp; governance</p>
        <div className="flex items-start gap-4 rounded-card border border-line bg-surface p-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-surface-sunken text-ink-faint">
            <IconUser width={26} height={26} />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-ink">{ipo.promoter.name}</p>
            <p className="text-sm text-ink-muted">Holds ~{ipo.promoter.holdingPct}% &middot; {ipo.promoter.context}</p>
            {ipo.promoter.background && (
              <p className="mt-1 text-sm text-ink-muted">{ipo.promoter.background}</p>
            )}
            {typeof ipo.promoter.preIssuePct === 'number' && typeof ipo.promoter.postIssuePct === 'number' && (
              <p className="mt-1 text-sm text-ink-muted">
                {ipo.promoter.preIssuePct}% pre-issue &rarr; {ipo.promoter.postIssuePct}% post-issue
              </p>
            )}
            {isIpoListed(ipo) &&
              typeof ipo.promoter.postIssuePct === 'number' &&
              typeof ipo.promoter.currentHoldingPct === 'number' && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <p className="text-sm text-ink-muted">
                    {ipo.promoter.postIssuePct}% at listing &rarr; {ipo.promoter.currentHoldingPct}% now
                  </p>
                  <span className="label-caps rounded-pill border border-line px-2 py-0.5 text-ink-faint">
                    From exchange filings
                  </span>
                </div>
              )}
            {ipo.promoter.notableAffiliation && (
              <p className="mt-3 rounded-card border border-line bg-warning-soft px-3.5 py-2.5 text-sm text-ink-muted">
                {ipo.promoter.notableAffiliation}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
