import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import type { IpoDetail } from '../../types'
import { PhaseTag } from '../../components/PhaseTag'
import { IconThumbsDown, IconThumbsUp, IconUser } from '../../components/icons'
import { formatCr, isIpoListed } from '../../lib/ipoFormat'

type StrengthsRisksTab = 'strengths' | 'risks'

const DONUT_SIZE = 400
const DONUT_COLORS = ['#055D56', '#1CBDB1', '#61686F', '#9AA1A8', '#C7CBCE']

interface DonutDatum {
  name: string
  value: number
  color: string
}

function DonutTooltip({ datum, mousePos }: { datum: DonutDatum; mousePos: { x: number; y: number } }) {
  // flip to the other side of the cursor when too close to the container edge
  const left = mousePos.x > DONUT_SIZE - 160 ? mousePos.x - 174 : mousePos.x + 14
  const top = mousePos.y > DONUT_SIZE - 70 ? mousePos.y - 64 : mousePos.y + 14

  return (
    <div
      className="pointer-events-none absolute z-10 flex overflow-hidden bg-ink shadow-lg"
      style={{ left, top }}
    >
      <span className="w-1 shrink-0" style={{ backgroundColor: datum.color }} />
      <div className="px-3 py-2">
        <p className="whitespace-nowrap text-xs font-medium text-white">{datum.name}</p>
        <p className="mt-0.5 whitespace-nowrap text-xs text-white/70">{formatCr(datum.value)}</p>
      </div>
    </div>
  )
}

function UseOfProceedsDonut({ ipo }: { ipo: IpoDetail }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)
  const buckets = ipo.useOfProceedsBreakdown
  if (buckets.length === 0) return null

  const total = buckets.reduce((sum, b) => sum + b.amountCr, 0)
  const sorted = [...buckets].sort((a, b) => b.amountCr - a.amountCr)
  const data: DonutDatum[] = sorted.map((b, i) => ({
    name: b.label,
    value: b.amountCr,
    color: DONUT_COLORS[i % DONUT_COLORS.length],
  }))
  const activeDatum = activeIndex !== null ? data[activeIndex] : null

  return (
    <div className="mt-3 rounded-card border border-line bg-surface p-5">
      <div
        className="relative mx-auto"
        style={{ height: DONUT_SIZE, width: DONUT_SIZE }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
        }}
        onMouseLeave={() => setMousePos(null)}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={124}
              paddingAngle={2}
              isAnimationActive={false}
              label={(props: any) => {
                const pct = `${Math.round((props.percent ?? 0) * 100)}%`
                const anchor = props.x >= props.cx ? 'start' : 'end'
                const dx = props.x >= props.cx ? 8 : -8
                return (
                  <text
                    x={props.x + dx}
                    y={props.y}
                    textAnchor={anchor}
                    dominantBaseline="middle"
                    style={{ fill: '#61686f', fontSize: 17, fontWeight: 600 }}
                  >
                    {pct}
                  </text>
                )
              }}
              labelLine={{ stroke: '#9aa1a8', strokeWidth: 1 }}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((d, i) => (
                <Cell
                  key={d.name}
                  fill={d.color}
                  stroke="none"
                  opacity={activeIndex === null || activeIndex === i ? 1 : 0.35}
                  style={{ transition: 'opacity 150ms ease' }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold text-ink">{formatCr(total)}</span>
          <span className="text-sm text-ink-muted">Total raised</span>
        </div>
        {activeDatum && mousePos && <DonutTooltip datum={activeDatum} mousePos={mousePos} />}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-card bg-surface-sunken px-4 py-3">
        {data.map((d, i) => (
          <span
            key={d.name}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
            className="flex items-center gap-1.5 text-xs text-ink-muted"
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
            {d.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export function DeepDiveTab({ ipo }: { ipo: IpoDetail }) {
  const [swTab, setSwTab] = useState<StrengthsRisksTab>('strengths')
  const hasStrengthsOrRisks = ipo.strengths.length > 0 || ipo.risks.length > 0
  const activeItems = swTab === 'strengths' ? ipo.strengths : ipo.risks.map((r) => r.text)

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xl font-semibold text-heading">Business model</p>
          <PhaseTag variant="fact" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="overflow-hidden rounded-card border border-line bg-surface">
            <div className="bg-surface-sunken px-4 py-3">
              <p className="text-lg font-semibold text-heading">How they make money</p>
            </div>
            <div className="p-4">
              <p className="text-[0.95rem] leading-relaxed text-ink">{ipo.howTheyMakeMoney}</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-card border border-line bg-surface">
            <div className="bg-surface-sunken px-4 py-3">
              <p className="text-lg font-semibold text-heading">What they do</p>
            </div>
            <div className="p-4">
              <p className="text-[0.95rem] leading-relaxed text-ink">{ipo.oneLiner}</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-card border border-line bg-surface">
            <div className="bg-surface-sunken px-4 py-3">
              <p className="text-lg font-semibold text-heading">Their edge</p>
            </div>
            <div className="p-4">
              <p className="text-[0.95rem] leading-relaxed text-ink">
                {ipo.strengths[0] ?? 'Not enough data to identify a clear edge yet.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xl font-semibold text-heading">Use of proceeds</p>
          <PhaseTag variant="fact" />
        </div>
        <div className="rounded-card border border-line bg-surface p-4">
          <p className="text-[0.95rem] leading-relaxed text-ink">{ipo.useOfProceeds}</p>
        </div>
        <UseOfProceedsDonut ipo={ipo} />
      </section>

      {hasStrengthsOrRisks && (
        <section>
          <p className="mb-6 text-xl font-semibold text-heading">Strengths &amp; risks</p>
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

          <p className="mt-4 text-xs text-ink-faint">Strengths and risks from the DRHP.</p>
        </section>
      )}

      <section>
        <p className="mb-6 text-xl font-semibold text-heading">Promoter &amp; governance</p>
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
