import { useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getIpoDetail } from '../data/ipos'
import { useAppState } from '../lib/appState'
import { StatusPill } from '../components/StatusPill'
import { DockedChatPanel, MobileChatSheet } from '../components/ChatPanel'
import { IconBookmark, IconChevronLeft, IconShare } from '../components/icons'
import { SummaryTab } from './ipoDetail/SummaryTab'
import { DeepDiveTab } from './ipoDetail/DeepDiveTab'
import { PeersTab } from './ipoDetail/PeersTab'
import { TransparencyTab } from './ipoDetail/TransparencyTab'

const TABS = ['Summary', 'Deep dive', 'Peers', 'Transparency'] as const
type Tab = (typeof TABS)[number]

export function IpoDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { isSaved, toggleSaved } = useAppState()
  const [tab, setTab] = useState<Tab>('Summary')
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const ipo = slug ? getIpoDetail(slug) : undefined
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

  function handleShare() {
    if (navigator.clipboard && typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href).catch(() => {})
    }
    showToast('Link copied to clipboard')
  }

  return (
    <div className="mx-auto flex max-w-7xl">
      <div className="min-w-0 flex-1 px-4 pb-24 sm:px-8 lg:pb-16">
        <div className="flex items-center gap-3 pt-6">
          <Link
            to="/"
            aria-label="Back to home"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink"
          >
            <IconChevronLeft />
          </Link>
          {ipo.logoUrl && (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line bg-white p-1.5">
              <img src={ipo.logoUrl} alt="" className="h-full w-full object-contain" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="label-caps text-ink-faint">{ipo.category}</span>
              <StatusPill tone={ipo.status} />
            </div>
            <h1 className="mt-1 truncate font-serif text-xl text-ink sm:text-2xl">{ipo.name}</h1>
          </div>
          <button
            type="button"
            onClick={handleBookmark}
            aria-label={saved ? 'Remove from saved' : 'Save IPO'}
            aria-pressed={saved}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
              saved
                ? 'border-primary/40 bg-accent-soft text-primary'
                : 'border-line text-ink-muted hover:border-primary/40 hover:text-primary'
            }`}
          >
            <IconBookmark filled={saved} width={18} height={18} />
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Copy link to this IPO"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted transition-colors hover:border-primary/40 hover:text-primary"
          >
            <IconShare width={18} height={18} />
          </button>
        </div>

        {ipo.illustrative && (
          <p className="mt-4 rounded-card bg-warning-soft px-4 py-2.5 text-xs text-warning">
            This IPO uses illustrative sample data for the prototype, not a real verified filing.
          </p>
        )}

        <div
          role="tablist"
          aria-label="IPO sections"
          className="sticky top-16 z-20 -mx-4 mt-6 flex gap-1 overflow-x-auto border-b border-line bg-surface/95 px-4 backdrop-blur scrollbar-thin sm:-mx-8 sm:px-8"
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
          {tab === 'Summary' && <SummaryTab ipo={ipo} />}
          {tab === 'Deep dive' && <DeepDiveTab ipo={ipo} />}
          {tab === 'Peers' && <PeersTab ipo={ipo} />}
          {tab === 'Transparency' && <TransparencyTab ipo={ipo} />}
        </div>
      </div>

      <DockedChatPanel ipo={ipo} />
      <MobileChatSheet ipo={ipo} />

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
