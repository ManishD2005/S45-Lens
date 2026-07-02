import type { ReactNode } from 'react'

export function InfoCard({
  variant,
  label,
  children,
}: {
  variant: 'fact' | 'read'
  label: string
  children: ReactNode
}) {
  return (
    <div
      className={`rounded-card bg-surface p-5 ${
        variant === 'fact' ? 'border border-line' : 'border border-dashed border-accent/60'
      }`}
    >
      <p className={`label-caps mb-2 ${variant === 'fact' ? 'text-ink-faint' : 'text-primary'}`}>{label}</p>
      <div className="text-[0.95rem] leading-relaxed text-ink">{children}</div>
    </div>
  )
}
