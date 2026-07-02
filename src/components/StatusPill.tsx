import type { StatusTone } from '../types'

const TONE_STYLES: Record<StatusTone, string> = {
  'high-confidence': 'bg-accent-soft text-primary',
  'mixed-signals': 'bg-warning-soft text-warning',
  closed: 'bg-surface-sunken text-ink-faint',
}

const TONE_LABELS: Record<StatusTone, string> = {
  'high-confidence': 'High confidence',
  'mixed-signals': 'Mixed signals',
  closed: 'Closed',
}

export function StatusPill({ tone, label }: { tone: StatusTone; label?: string }) {
  return (
    <span className={`label-caps inline-flex items-center rounded-pill px-2.5 py-1 ${TONE_STYLES[tone]}`}>
      {label ?? TONE_LABELS[tone]}
    </span>
  )
}
