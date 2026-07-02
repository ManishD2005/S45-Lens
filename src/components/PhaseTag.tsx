export function PhaseTag({ variant }: { variant: 'fact' | 'read' }) {
  if (variant === 'fact') {
    return (
      <span className="label-caps inline-flex items-center gap-1.5 rounded-pill border border-line px-2.5 py-1 text-ink-muted">
        Phase 1 · From the DRHP
      </span>
    )
  }
  return (
    <span className="label-caps inline-flex items-center gap-1.5 rounded-pill border border-dashed border-accent px-2.5 py-1 text-primary">
      Phase 2 · S45's read
    </span>
  )
}
