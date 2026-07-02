import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ipoSummaries } from '../data/ipos'
import { useAppState } from '../lib/appState'
import { IpoCard } from '../components/IpoCard'
import { SearchSuggestions } from '../components/SearchSuggestions'
import { IconSearch } from '../components/icons'

export function SearchResults() {
  const navigate = useNavigate()
  const { addRecentSearch } = useAppState()
  const [params, setParams] = useSearchParams()
  const query = params.get('q')?.trim() ?? ''
  const [input, setInput] = useState(query)

  useEffect(() => {
    if (query) addRecentSearch(query)
    // only re-run when the URL query itself changes, not on every addRecentSearch identity change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  function runSearch(term: string) {
    setInput(term)
    setParams(term.trim() ? { q: term.trim() } : {})
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    runSearch(input)
  }

  function goToIpo(slug: string, name: string) {
    addRecentSearch(name)
    navigate(`/ipo/${slug}`)
  }

  const results = useMemo(() => {
    if (!query) return []
    const q = query.toLowerCase()
    return ipoSummaries.filter(
      (ipo) =>
        ipo.name.toLowerCase().includes(q) ||
        ipo.category.toLowerCase().includes(q) ||
        ipo.oneLiner.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-8">
      <form onSubmit={handleSubmit} role="search" className="mb-6 sm:hidden">
        <div className="flex items-center gap-2 rounded-pill border border-line bg-surface-sunken px-3.5 py-2.5 transition-colors focus-within:border-primary/40 focus-within:bg-surface">
          <IconSearch width={16} height={16} className="shrink-0 text-ink-faint" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="search"
            autoFocus={!query}
            aria-label="Search a company or IPO"
            placeholder="Search a company or IPO"
            className="search-input w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>
      </form>

      {query ? (
        <>
          <p className="anim-fade-up mb-6 text-sm text-ink-muted" aria-live="polite">
            {results.length} {results.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
          </p>
          {results.length === 0 ? (
            <div className="rounded-card border border-line bg-surface-sunken px-5 py-12 text-center">
              <p className="text-sm text-ink-muted">No IPOs match &ldquo;{query}&rdquo;.</p>
              <p className="mt-2 text-xs text-ink-faint">Try a company name — like Zappfresh, Orbit, or Nimbus.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((ipo, i) =>
                ipo.status === 'closed' ? (
                  <div
                    key={ipo.slug}
                    className="anim-fade-up flex items-center justify-between rounded-card border border-line bg-surface px-5 py-4 opacity-55"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div>
                      <p className="label-caps text-ink-faint">{ipo.category}</p>
                      <p className="mt-1 font-serif text-base text-ink">{ipo.name}</p>
                      <p className="mt-1 text-sm text-ink-muted">{ipo.oneLiner}</p>
                    </div>
                    <span className="label-caps rounded-pill bg-surface-sunken px-2.5 py-1 text-ink-faint">Closed</span>
                  </div>
                ) : (
                  <div key={ipo.slug} className="anim-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                    <IpoCard ipo={ipo} />
                  </div>
                ),
              )}
            </div>
          )}
        </>
      ) : (
        <div className="px-1 pt-2">
          <SearchSuggestions onPickTerm={runSearch} onPickIpo={goToIpo} />
        </div>
      )}
    </div>
  )
}
