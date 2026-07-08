import { useEffect, useRef, useState } from 'react'
import type { FactItem } from '../types'
import { IconCheckCircle, IconDangerOctagon, IconInfo, IconWarningTriangle } from './icons'

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
  const [open, setOpen] = useState(false)
  const [supportsHover, setSupportsHover] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSupportsHover(window.matchMedia('(hover: hover)').matches)
  }, [])

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="flex items-center gap-3 rounded-card border border-line bg-surface px-4 py-3.5">
      <Icon filled className={`shrink-0 ${TONE_COLOR[fact.tone]}`} />
      <p className="min-w-0 flex-1 text-[0.95rem] leading-snug text-ink">{fact.text}</p>
      <div
        ref={ref}
        className="relative shrink-0"
        onMouseEnter={() => supportsHover && setOpen(true)}
        onMouseLeave={() => supportsHover && setOpen(false)}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="View source"
          aria-expanded={open}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
            open ? 'bg-accent-soft text-primary' : 'text-ink-faint hover:bg-surface-sunken hover:text-ink-muted'
          }`}
        >
          <IconInfo width={18} height={18} />
        </button>
        {open && (
          <div
            role="tooltip"
            className="anim-fade-up absolute right-0 top-10 z-10 w-56 rounded-card border border-line bg-surface px-3.5 py-2.5 shadow-lg"
          >
            <p className="text-[0.6875rem] font-semibold text-ink-faint">{fact.source}</p>
          </div>
        )}
      </div>
    </div>
  )
}
