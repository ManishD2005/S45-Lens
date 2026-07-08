import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ipoSummaries } from '../data/ipos'
import { useAppState } from '../lib/appState'
import { IpoCard } from '../components/IpoCard'
import { SearchSuggestions } from '../components/SearchSuggestions'
import { IconSearch } from '../components/icons'
import { isIpoListed } from '../lib/ipoFormat'
import { getIpoListedDate, getIpoRelevantOpenDate } from '../lib/ipoEvents'

type LifecycleFilter = 'all' | 'open-upcoming' | 'recently-listed'

const FILTER_CHIPS: { value: LifecycleFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'open-upcoming', label: 'Open & upcoming' },
  { value: 'recently-listed', label: 'Recently listed' },
]

export function SearchResults() {
  const navigate = useNavigate()
  const { addRecentSearch } = useAppState()
  const [params, setParams] = useSearchParams()
  const query = params.get('q')?.trim() ?? ''
  const filterParam = params.get('filter')
  const filter: LifecycleFilter =
    filterParam === 'open-upcoming' || filterParam === 'recently-listed' ? filterParam : 'all'
  const [input, setInput] = useState(query)

  useEffect(() => {
    if (query) addRecentSearch(query)
    // only re-run when the URL query itself changes, not on every addRecentSearch identity change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  function runSearch(term: string) {
    setInput(term)
    const next: Record<string, string> = {}
    if (term.trim()) next.q = term.trim()
    if (filter !== 'all') next.filter = filter
    setParams(next)
  }

  function setFilter(next: LifecycleFilter) {
    const nextParams: Record<string, string> = {}
    if (query) nextParams.q = query
    if (next !== 'all') nextParams.filter = next
    setParams(nextParams)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    runSearch(input)
  }

  function goToIpo(slug: string, name: string) {
    addRecentSearch(name)
    navigate(`/ipo/${slug}`)
  }

  const showResults = Boolean(query) || filter !== 'all'

  const results = useMemo(() => {
    let base = ipoSummaries
    if (query) {
      const q = query.toLowerCase()
      base = base.filter(
        (ipo) =>
          ipo.name.toLowerCase().includes(q) ||
          ipo.category.toLowerCase().includes(q) ||
          ipo.oneLiner.toLowerCase().includes(q),
      )
    }

    if (filter === 'open-upcoming') {
      return base
        .filter((ipo) => ipo.isOpen)
        .map((ipo) => ({ ipo, date: getIpoRelevantOpenDate(ipo) }))
        .sort((a, b) => (a.date?.getTime() ?? Infinity) - (b.date?.getTime() ?? Infinity))
        .map((entry) => entry.ipo)
    }

    if (filter === 'recently-listed') {
      return base
        .filter((ipo) => isIpoListed(ipo))
        .map((ipo) => ({ ipo, date: getIpoListedDate(ipo) }))
        .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))
        .map((entry) => entry.ipo)
    }

    return base
  }, [query, filter])

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

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip.value}
            type="button"
            onClick={() => setFilter(chip.value)}
            aria-pressed={filter === chip.value}
            className={`rounded-pill border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === chip.value
                ? 'border-line bg-surface-sunken text-ink'
                : 'border-line text-ink-muted hover:text-ink'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {showResults ? (
        <>
          <p className="anim-fade-up mb-6 text-sm text-ink-muted" aria-live="polite">
            {results.length} {results.length === 1 ? 'result' : 'results'}
            {query && (
              <>
                {' '}
                for &ldquo;{query}&rdquo;
              </>
            )}
          </p>
          {results.length === 0 ? (
            <div className="rounded-card border border-line bg-surface-sunken px-5 py-12 text-center">
              <p className="text-sm text-ink-muted">
                {query ? <>No IPOs match &ldquo;{query}&rdquo;.</> : 'No IPOs match this filter right now.'}
              </p>
              {query && (
                <p className="mt-2 text-xs text-ink-faint">Try a company name — like Zappfresh, Orbit, or Nimbus.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((ipo, i) => (
                <div key={ipo.slug} className="anim-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <IpoCard ipo={ipo} />
                </div>
              ))}
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
