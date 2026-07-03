import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { ipoSummaries } from '../data/ipos'
import { useAppState } from '../lib/appState'
import { SearchSuggestions } from './SearchSuggestions'
import { IconClose, IconSearch } from './icons'
import type { IpoCategory } from '../types'

type FilterTab = 'All' | IpoCategory

const FILTER_TABS: FilterTab[] = ['All', 'SME', 'Mainboard']
const RESULT_LIMIT = 6

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const { addRecentSearch } = useAppState()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<FilterTab>('All')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    let list = ipoSummaries.filter(
      (ipo) => ipo.name.toLowerCase().includes(q) || ipo.oneLiner.toLowerCase().includes(q),
    )
    if (tab !== 'All') list = list.filter((ipo) => ipo.category === tab)
    return list
  }, [query, tab])

  function goToIpo(slug: string, name: string) {
    addRecentSearch(name)
    navigate(`/ipo/${slug}`)
    onClose()
  }

  function showAllResults(term: string) {
    if (!term.trim()) return
    addRecentSearch(term.trim())
    navigate(`/search?q=${encodeURIComponent(term.trim())}`)
    onClose()
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    showAllResults(query)
  }

  return createPortal(
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Search">
      <button
        type="button"
        aria-label="Close search"
        className="anim-fade-in absolute inset-0 bg-ink/40"
        onClick={onClose}
      />

      <div className="relative mx-auto max-w-2xl px-4 sm:px-0">
        <div className="anim-fade-up mt-[8vh] flex items-center gap-3 rounded-pill border border-line bg-surface px-4 py-3 shadow-lg sm:mt-[12vh]">
          <IconSearch width={18} height={18} className="shrink-0 text-ink-faint" />
          <form onSubmit={handleSubmit} className="min-w-0 flex-1">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              aria-label="Search a company or IPO"
              placeholder="Search a company or IPO"
              className="search-input w-full bg-transparent text-base text-ink placeholder:text-ink-faint focus:outline-none"
            />
          </form>
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="flex h-11 w-11 shrink-0 items-center justify-center text-ink-faint hover:text-ink"
            >
              <IconClose width={16} height={16} />
            </button>
          )}
          <button type="button" onClick={onClose} className="shrink-0 text-sm font-medium text-primary hover:underline">
            Close
          </button>
        </div>

        <div className="anim-fade-up mt-3 max-h-[70vh] overflow-y-auto scrollbar-thin rounded-card border border-line bg-surface p-6 shadow-xl">
          {query.trim() ? (
            <>
              <div role="tablist" aria-label="Filter results" className="mb-4 flex gap-1 border-b border-line">
                {FILTER_TABS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => setTab(t)}
                    className={`border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                      tab === t ? 'border-primary text-ink' : 'border-transparent text-ink-muted hover:text-ink'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {results.length === 0 ? (
                <p className="py-8 text-center text-sm text-ink-muted">No IPOs match &ldquo;{query}&rdquo;.</p>
              ) : (
                <div className="divide-y divide-line">
                  {results.slice(0, RESULT_LIMIT).map((ipo) => (
                    <button
                      key={ipo.slug}
                      type="button"
                      onClick={() => goToIpo(ipo.slug, ipo.name)}
                      className="flex w-full items-center justify-between gap-3 py-3 text-left transition-colors hover:bg-surface-sunken"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-ink">{ipo.name}</span>
                        <span className="block truncate text-xs text-ink-faint">{ipo.oneLiner}</span>
                      </span>
                      <span className="label-caps shrink-0 rounded-pill bg-accent-soft px-2.5 py-1 text-primary">
                        {ipo.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {results.length > 0 && (
                <button
                  type="button"
                  onClick={() => showAllResults(query)}
                  className="mt-3 w-full border-t border-line pt-3 text-center text-sm font-medium text-primary hover:underline"
                >
                  Show all {results.length} results
                </button>
              )}
            </>
          ) : (
            <SearchSuggestions onPickTerm={setQuery} onPickIpo={goToIpo} />
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
