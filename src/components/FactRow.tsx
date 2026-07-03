import type { FactItem } from '../types'
import { IconCheckCircle, IconDangerOctagon, IconWarningTriangle } from './icons'

const TONE_ICON = {
  success: IconCheckCircle,
  warning: IconWarningTriangle,
  danger: IconDangerOctagon,
}

const TONE_COLOR = {
  success: 'text-primary',
  warning: 'text-warning',
  danger: 'text-danger',
}

export function FactRow({ fact }: { fact: FactItem }) {
  const Icon = TONE_ICON[fact.tone]
  return (
    <div className="flex items-start gap-3 rounded-card border border-line bg-surface px-4 py-3.5">
      <Icon className={`mt-0.5 shrink-0 ${TONE_COLOR[fact.tone]}`} />
      <div className="min-w-0">
        <p className="text-[0.95rem] leading-snug text-ink">{fact.text}</p>
        <p className="label-caps mt-1.5 text-ink-faint normal-case tracking-normal">{fact.source}</p>
      </div>
    </div>
  )
}
