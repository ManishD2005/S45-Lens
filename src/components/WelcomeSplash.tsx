import { useEffect, useRef, useState } from 'react'
import { getTimeOfDay } from '../lib/greeting'

const WORD_STAGGER_MS = 220
const NAME_GAP_MS = 220
const SUB_GAP_MS = 350
const COUNT_DURATION_MS = 900
const HOLD_MS = 2600
const FADE_OUT_MS = 550

const PERIOD_LABEL: Record<ReturnType<typeof getTimeOfDay>, string> = {
  morning: 'Morning,',
  afternoon: 'Afternoon,',
  evening: 'Evening,',
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function CountUp({ to, start, durationMs }: { to: number; start: boolean; durationMs: number }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start) return
    if (to <= 0 || prefersReducedMotion()) {
      setValue(to)
      return
    }
    let raf = 0
    const startedAt = performance.now()
    function tick(now: number) {
      const progress = Math.min(1, (now - startedAt) / durationMs)
      const eased = 1 - (1 - progress) ** 3
      setValue(Math.round(eased * to))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, to, durationMs])

  return <>{value}</>
}

export function WelcomeSplash({
  name,
  openCount,
  onDone,
}: {
  name: string
  openCount: number
  onDone: () => void
}) {
  const [exiting, setExiting] = useState(false)
  const [countStarted, setCountStarted] = useState(false)
  const reduced = useRef(prefersReducedMotion()).current

  const periodLabel = PERIOD_LABEL[getTimeOfDay()]
  const words = ['Good', periodLabel]

  const nameDelay = reduced ? 0 : words.length * WORD_STAGGER_MS + NAME_GAP_MS
  const subDelay = reduced ? 0 : nameDelay + WORD_STAGGER_MS + SUB_GAP_MS

  useEffect(() => {
    if (reduced) {
      const doneTimer = setTimeout(onDone, 500)
      return () => clearTimeout(doneTimer)
    }
    const countTimer = setTimeout(() => setCountStarted(true), subDelay)
    const exitTimer = setTimeout(() => setExiting(true), HOLD_MS)
    const doneTimer = setTimeout(onDone, HOLD_MS + FADE_OUT_MS)
    return () => {
      clearTimeout(countTimer)
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, subDelay, onDone])

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-surface transition-opacity duration-[550ms] ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="px-6 text-center">
        <h1 className="font-serif text-4xl font-medium leading-tight text-ink sm:text-5xl">
          {words.map((word, i) => (
            <span
              key={word}
              className={`mr-3 inline-block ${reduced ? '' : 'anim-word-in'}`}
              style={reduced ? undefined : { animationDelay: `${i * WORD_STAGGER_MS}ms` }}
            >
              {word}
            </span>
          ))}
          <span
            className={`inline-block text-primary ${reduced ? '' : 'anim-word-in'}`}
            style={reduced ? undefined : { animationDelay: `${nameDelay}ms` }}
          >
            {name}
          </span>
        </h1>

        <p
          className={`mt-5 flex items-center justify-center gap-2.5 font-sans text-lg text-ink-muted ${reduced ? '' : 'anim-word-in'}`}
          style={reduced ? undefined : { animationDelay: `${subDelay}ms` }}
        >
          <span
            className={`h-2.5 w-2.5 rounded-full bg-primary ${reduced ? '' : 'anim-dot-blink'}`}
            style={reduced ? undefined : { animationDelay: `${subDelay}ms` }}
            aria-hidden="true"
          />
          <span>
            <span className="font-semibold text-ink">
              <CountUp to={openCount} start={countStarted || reduced} durationMs={COUNT_DURATION_MS} /> IPOs
            </span>{' '}
            open right now
          </span>
        </p>
      </div>
    </div>
  )
}
