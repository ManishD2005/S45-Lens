import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import type { IpoDetail } from '../../types'
import { PhaseTag } from '../../components/PhaseTag'

export function PeersTab({ ipo }: { ipo: IpoDetail }) {
  const data = ipo.peers.map((p) => ({ name: p.name, pe: p.pe, isSubject: !!p.isSubject }))
  const maxPe = Math.max(...data.map((d) => d.pe), 1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="label-caps text-ink-muted">Valuation multiple vs. peers (P/E)</p>
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

      <p className="text-sm text-ink-faint">
        Illustrative / placeholder data for this prototype. In Phase 1, this comparison is data-only — no
        &ldquo;expensive&rdquo; or &ldquo;cheap&rdquo; judgment is attached. A Phase 2 version would add an explicit read.
      </p>
    </div>
  )
}
