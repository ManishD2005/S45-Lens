import { DocumentCheckIcon, SparklesIcon } from '@heroicons/react/24/solid'

export function PhaseTag({ variant, label }: { variant: 'fact' | 'read'; label?: string }) {
  if (variant === 'fact') {
    return (
      <span className="label-caps inline-flex items-center gap-1.5 rounded-sm border border-line bg-surface-sunken px-2.5 py-1 text-ink-muted">
        <DocumentCheckIcon width={12} height={12} className="shrink-0 text-ink-faint" />
        {label ?? 'From the DRHP'}
      </span>
    )
  }
  return (
    <span className="label-caps inline-flex items-center gap-1.5 rounded-sm border border-dashed border-accent bg-accent-soft px-2.5 py-1 text-primary">
      <SparklesIcon width={12} height={12} className="shrink-0 text-primary" />
      S45&rsquo;s read
    </span>
  )
}
