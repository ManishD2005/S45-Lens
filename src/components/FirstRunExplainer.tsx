import { useEffect, useState, type ReactNode } from 'react'
import { useAppState } from '../lib/appState'
import { IconCheckCircle } from './icons'

function MiniFactCard() {
  return (
    <div className="rounded-[10px] border border-line bg-surface px-3.5 py-2.5 text-left">
      <p className="label-caps text-ink-faint">From the DRHP</p>
      <p className="mt-1 text-xs text-ink">Revenue +45% YoY</p>
    </div>
  )
}

function MiniReadCard() {
  return (
    <div className="rounded-[10px] border border-dashed border-accent/60 bg-surface px-3.5 py-2.5 text-left">
      <p className="label-caps text-primary">S45's read</p>
      <p className="mt-1 text-xs text-ink">Genuinely strong</p>
    </div>
  )
}

const STEPS: { title: string; body: string; visual: ReactNode }[] = [
  {
    title: 'Fact vs. opinion, always separated',
    body: "Solid-bordered cards are pulled straight from the DRHP. Dashed-bordered cards are S45's read — a judgment call. We never blur the two.",
    visual: (
      <div className="grid grid-cols-2 gap-2.5">
        <MiniFactCard />
        <MiniReadCard />
      </div>
    ),
  },
  {
    title: 'Every fact is sourced',
    body: 'No blanket disclaimers. Each claim is tagged with where it came from — DRHP, MCA filing, SEBI order — and how many sources verified it.',
    visual: (
      <div className="flex items-start gap-3 rounded-[10px] border border-line bg-surface px-3.5 py-2.5 text-left">
        <IconCheckCircle width={16} height={16} className="mt-0.5 shrink-0 text-accent" />
        <div>
          <p className="text-xs text-ink">Revenue up 45%, profit up 94% year on year</p>
          <p className="label-caps mt-1 text-ink-faint normal-case tracking-normal">verified against DRHP + MCA filing</p>
        </div>
      </div>
    ),
  },
  {
    title: 'Ask, scoped to the IPO',
    body: "Every IPO page has a chat scoped only to that company's verified data. It won't tell you whether to invest — it'll show you what the filing says, with a source.",
    visual: (
      <div className="space-y-1.5 text-left">
        <div className="ml-auto w-fit rounded-[10px] bg-primary px-3 py-2 text-xs text-white">Why is chicken 55% of revenue risky?</div>
        <div className="w-fit rounded-[10px] border border-line bg-surface px-3 py-2 text-xs text-ink">Concentration risk — one product line carries most of the business.</div>
        <p className="label-caps text-accent normal-case tracking-normal">source: DRHP p.42</p>
      </div>
    ),
  },
]

export function FirstRunExplainer() {
  const { dismissIntro } = useAppState()
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismissIntro()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [dismissIntro])

  return (
    <div
      className="anim-fade-in fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="How S45 Lens works"
    >
      <div className="w-full max-w-md rounded-card border border-line bg-surface p-7 shadow-2xl">
        <p className="label-caps text-primary">Before you start · {step + 1} of {STEPS.length}</p>
        <h2 className="mt-3 font-serif text-2xl text-ink">{current.title}</h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">{current.body}</p>

        <div key={step} className="anim-fade-up mt-5 rounded-card bg-surface-sunken p-4">{current.visual}</div>

        <div className="mt-7 flex items-center justify-between">
          <div className="flex gap-1.5" aria-hidden="true">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === step ? 'w-5 bg-primary' : 'w-1.5 bg-line'}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-4">
            {step > 0 ? (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="text-sm text-ink-muted hover:text-ink">
                Back
              </button>
            ) : (
              <button type="button" onClick={dismissIntro} className="text-sm text-ink-muted hover:text-ink">
                Skip
              </button>
            )}
            <button
              type="button"
              onClick={() => (isLast ? dismissIntro() : setStep((s) => s + 1))}
              className="rounded-pill bg-primary px-5 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
            >
              {isLast ? 'Get started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
