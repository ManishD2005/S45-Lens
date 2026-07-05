import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import type { IpoDetail } from '../../types'
import { PhaseTag } from '../../components/PhaseTag'
import { InfoCard } from '../../components/InfoCard'

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
            <span className="h-2.5 w-2.5 rounded-full bg-ink-muted" /> Peers
          </span>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 24, right: 8, left: -16, bottom: 8 }} barCategoryGap="30%">
            <CartesianGrid vertical={false} stroke="#e7e6e2" strokeDasharray="0" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={{ stroke: '#e7e6e2' }}
              tick={{ fill: '#61686f', fontSize: 12 }}
            />
            <YAxis
              domain={[0, Math.ceil((maxPe * 1.25) / 5) * 5]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#61686f', fontSize: 12 }}
              width={36}
            />
            <Bar dataKey="pe" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {data.map((d) => (
                <Cell key={d.name} fill={d.isSubject ? '#055D56' : '#61686f'} />
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
        <InfoCard variant="read" label="S45's read">
          {summary}
        </InfoCard>
      )}
    </div>
  )
}
