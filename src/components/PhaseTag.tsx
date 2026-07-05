export function PhaseTag({ variant, label }: { variant: 'fact' | 'read'; label?: string }) {
  if (variant === 'fact') {
    return (
      <span className="label-caps inline-flex items-center gap-1.5 rounded-pill border border-line px-2.5 py-1 text-ink-muted">
        {label ?? 'From the DRHP'}
      </span>
    )
  }
  return (
    <span className="label-caps inline-flex items-center gap-1.5 rounded-pill border border-dashed border-accent px-2.5 py-1 text-primary">
      S45&rsquo;s read
    </span>
  )
}
