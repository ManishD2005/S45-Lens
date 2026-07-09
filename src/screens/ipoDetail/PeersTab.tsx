import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import type { IpoDetail } from '../../types'
import { PhaseTag } from '../../components/PhaseTag'

function peerComparisonSummary(ipo: IpoDetail): string | null {
  const subject = ipo.peers.find((p) => p.isSubject)
  const others = ipo.peers.filter((p) => !p.isSubject)
  if (!subject || others.length === 0) return null

  const shortName = ipo.name.split(' (')[0]
  const cheaperThan = others.filter((p) => subject.pe < p.pe).length

  if (cheaperThan === 0) {
    return `${shortName} is priced higher than all ${others.length} listed peers on P/E.`
  }
  if (cheaperThan === others.length) {
    return `${shortName} is priced lower than all ${others.length} listed peers on P/E.`
  }
  return `${shortName} is priced lower than ${cheaperThan} of ${others.length} peers on P/E.`
}

function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

function formatCr(value: number): string {
  return `₹${value.toLocaleString('en-IN')} Cr`
}

/**
 * Evenly-spaced "nice" tick values (steps of 1/2/5/10 × a power of ten) with
 * ~25% headroom above the tallest bar. Recharts always renders a tick at the
 * exact domain max, so an arbitrary domain (e.g. 75 on a 20-step grid) shows
 * up as a cramped, uneven extra tick — generating the ticks ourselves and
 * setting domain max to match the last one avoids that.
 */
function niceYAxisTicks(maxValue: number, targetTickCount = 5): number[] {
  const roughStep = (maxValue * 1.25) / targetTickCount
  const magnitude = 10 ** Math.floor(Math.log10(roughStep))
  const residual = roughStep / magnitude
  const niceResidual = residual > 5 ? 10 : residual > 2 ? 5 : residual > 1 ? 2 : 1
  const step = niceResidual * magnitude
  const top = Math.ceil((maxValue * 1.25) / step) * step

  const ticks: number[] = []
  for (let v = 0; v <= top; v += step) ticks.push(v)
  return ticks
}

function StatPairRow({ label, subjectValue, peerValue }: { label: string; subjectValue: string; peerValue: string }) {
  return (
    <div className="flex items-center justify-between rounded-card border border-line bg-surface px-4 py-3.5">
      <span className="text-sm text-ink-muted">{label}</span>
      <span className="text-sm text-ink">
        <span className="font-medium">{subjectValue}</span>
        <span className="mx-1.5 text-ink-faint">vs. peer median</span>
        <span className="font-medium">{peerValue}</span>
      </span>
    </div>
  )
}

export function PeersTab({ ipo }: { ipo: IpoDetail }) {
  const data = ipo.peers.map((p) => ({ name: p.name, pe: p.pe, isSubject: !!p.isSubject }))
  const maxPe = Math.max(...data.map((d) => d.pe), 1)
  const yTicks = niceYAxisTicks(maxPe)
  const summary = peerComparisonSummary(ipo)

  const extendedPeers = ipo.fullReport?.extendedPeers
  const subjectPeer = extendedPeers?.find((p) => p.isSubject)
  const otherPeers = extendedPeers?.filter((p) => !p.isSubject) ?? []
  const hasScaleContext = Boolean(subjectPeer) && otherPeers.length > 0

  const peerMedianRonw = median(otherPeers.map((p) => p.ronwPct))
  const peerMedianRevenue = median(otherPeers.map((p) => p.revenueCr))
  const peerMedianGrowth = median(otherPeers.map((p) => p.revenueGrowthPct))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xl font-semibold text-heading">Valuation multiple vs. peers (P/E)</p>
        <PhaseTag variant="fact" />
      </div>

      <div className="rounded-card border border-line bg-surface p-5">
        <div className="mb-4 flex items-center gap-5 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" /> This IPO
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#9AA1A8' }} /> Peers
          </span>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 40, right: 8, left: -16, bottom: 8 }} barCategoryGap="30%">
            <defs>
              <linearGradient id="peerBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#003A36" />
                <stop offset="100%" stopColor="#055D56" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#f0efec" strokeDasharray="0" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={{ stroke: '#e7e6e2' }}
              tick={{ fill: '#61686f', fontSize: 12 }}
            />
            <YAxis
              domain={[0, yTicks[yTicks.length - 1]]}
              ticks={yTicks}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#61686f', fontSize: 12 }}
              width={36}
            />
            <Bar dataKey="pe" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {data.map((d) => (
                <Cell key={d.name} fill={d.isSubject ? 'url(#peerBarGradient)' : '#9AA1A8'} />
              ))}
              <LabelList
                dataKey="pe"
                position="top"
                formatter={(v) => (v === undefined ? '' : `${v}x`)}
                style={{ fill: '#14171a', fontSize: 12, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {hasScaleContext && subjectPeer && (
        <div className="space-y-2.5">
          <StatPairRow label="Return on net worth" subjectValue={`${subjectPeer.ronwPct}%`} peerValue={`${peerMedianRonw}%`} />
          <StatPairRow
            label="Revenue scale"
            subjectValue={formatCr(subjectPeer.revenueCr)}
            peerValue={formatCr(peerMedianRevenue)}
          />
          <StatPairRow
            label="Revenue growth"
            subjectValue={`${subjectPeer.revenueGrowthPct}%`}
            peerValue={`${peerMedianGrowth}%`}
          />
        </div>
      )}

      {summary && (
        <div className="flex items-start justify-between gap-3 rounded-card border border-line bg-surface px-4 py-3.5">
          <p className="text-sm text-ink">{summary}</p>
          <PhaseTag variant="read" />
        </div>
      )}
    </div>
  )
}
