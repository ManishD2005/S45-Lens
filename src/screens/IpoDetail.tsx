import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getIpoDetail } from '../data/ipos'
import { useAppState } from '../lib/appState'
import { buildAtAGlance, formatInr, getIpoCountdownText, monogramColor } from '../lib/ipoFormat'
import { ChatWidget } from '../components/ChatPanel'
import { IconBookmark, IconChevronLeft, IconInfo, IconShare } from '../components/icons'
import { SummaryTab } from './ipoDetail/SummaryTab'
import { DeepDiveTab } from './ipoDetail/DeepDiveTab'
import { PeersTab } from './ipoDetail/PeersTab'
import { TransparencyTab } from './ipoDetail/TransparencyTab'
import { FullReportTab } from './ipoDetail/FullReportTab'

const TABS = ['Summary', 'Deep dive', 'Peers', 'Transparency', 'Full Report'] as const
type Tab = (typeof TABS)[number]

export function IpoDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { isSaved, toggleSaved, recordIpoView } = useAppState()
  const [tab, setTab] = useState<Tab>('Summary')
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const ipo = slug ? getIpoDetail(slug) : undefined

  useEffect(() => {
    if (slug) recordIpoView(slug)
    // only re-run when the slug itself changes, not on every recordIpoView identity change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  if (!ipo) return <Navigate to="/" replace />

  const saved = isSaved(ipo.slug)

  function showToast(message: string) {
    clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = setTimeout(() => setToast(null), 1800)
  }

  function handleBookmark() {
    if (!ipo) return
    toggleSaved(ipo.slug)
    showToast(saved ? 'Removed from saved' : 'Saved — track it from your profile')
  }

  async function handleShare() {
    if (!ipo) return
    const shareText = buildAtAGlance(ipo)

    if (navigator.share) {
      try {
        await navigator.share({ title: ipo.name, text: shareText, url: window.location.href })
      } catch {
        // user cancelled the native share sheet — nothing further to do
      }
      return
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {})
    }
    showToast('Link copied to clipboard')
  }

  const shortName = ipo.name.split(' (')[0]

  return (
    <div className="mx-auto max-w-7xl">
      <div className="px-4 pb-24 pt-6 sm:px-8">
        <Link
          to="/"
          aria-label="Back to home"
          className="mb-2 flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink lg:hidden"
        >
          <IconChevronLeft />
        </Link>

        <div className="lg:grid lg:grid-cols-[320px_1fr] lg:items-start lg:gap-8">
          <aside className="lg:sticky lg:top-[88px]">
            <div className="overflow-hidden rounded-card border border-line bg-surface">
              <div className="bg-gradient-to-b from-[#003A36] to-[#055D56] p-5">
                <div className="flex items-start gap-3">
                  {ipo.logoUrl ? (
                    <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-sm bg-white p-2">
                      <img src={ipo.logoUrl} alt="" className="h-full w-full object-contain" />
                    </span>
                  ) : (
                    <span
                      className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-sm bg-white text-2xl font-bold"
                      style={{ color: monogramColor(ipo.slug) }}
                      aria-hidden="true"
                    >
                      {shortName.charAt(0)}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <h1 className="text-lg font-medium text-white">{shortName}</h1>
                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-white/70">{ipo.oneLiner}</p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink">{getIpoCountdownText(ipo)}</span>
                  {typeof ipo.listedPrice === 'number' ? (
                    <span className="text-sm font-medium text-ink">{formatInr(ipo.listedPrice)}</span>
                  ) : (
                    typeof ipo.minInvestment === 'number' && (
                      <span className="text-sm font-medium text-ink">Min {formatInr(ipo.minInvestment)}</span>
                    )
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={handleBookmark}
                    aria-pressed={saved}
                    className={`flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border text-sm font-medium transition-colors ${
                      saved
                        ? 'border-primary/40 bg-accent-soft text-primary'
                        : 'border-line text-ink-muted hover:border-primary/40 hover:text-primary'
                    }`}
                  >
                    <IconBookmark filled={saved} width={16} height={16} />
                    {saved ? 'Saved' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Copy link to this IPO"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <IconShare width={16} height={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-card border border-line bg-surface px-4 py-2.5 text-xs text-ink-muted">
              <IconInfo width={14} height={14} className="mt-0.5 shrink-0" />
              <span>S45 acted as banker on this IPO and was compensated by {shortName}.</span>
            </div>
          </aside>

          <div className="mt-6 lg:mt-0">
            <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-16 z-[19] h-6 bg-surface" />
            <div
              role="tablist"
              aria-label="IPO sections"
              className="sticky top-[88px] z-20 -mx-4 flex gap-1 overflow-x-auto border-b border-line bg-surface px-4 scrollbar-thin sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0"
            >
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`shrink-0 border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    tab === t ? 'border-primary text-ink' : 'border-transparent text-ink-muted hover:text-ink'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div key={tab} role="tabpanel" className="anim-fade-up pt-6">
              {tab === 'Summary' && <SummaryTab ipo={ipo} onViewFullReport={() => setTab('Full Report')} />}
              {tab === 'Deep dive' && <DeepDiveTab ipo={ipo} />}
              {tab === 'Peers' && <PeersTab ipo={ipo} />}
              {tab === 'Transparency' && <TransparencyTab ipo={ipo} onViewFullReport={() => setTab('Full Report')} />}
              {tab === 'Full Report' && <FullReportTab ipo={ipo} />}
            </div>
          </div>
        </div>
      </div>

      <ChatWidget ipo={ipo} />

      {toast && (
        <div
          role="status"
          className="anim-fade-up fixed bottom-24 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-pill bg-ink px-4 py-2 text-sm text-white shadow-lg sm:bottom-8"
        >
          {toast}
        </div>
      )}
    </div>
  )
}
