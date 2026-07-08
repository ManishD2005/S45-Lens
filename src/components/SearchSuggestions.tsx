import { ipoSummaries } from '../data/ipos'
import { useAppState } from '../lib/appState'
import { getIpoLifecycleStatus } from '../lib/ipoFormat'

const SUGGESTION_TONE: Record<string, string> = {
  'closing-soon': 'bg-warning-soft text-warning',
}

export function SearchSuggestions({
  onPickTerm,
  onPickIpo,
}: {
  onPickTerm: (term: string) => void
  onPickIpo: (slug: string, name: string) => void
}) {
  const { recentSearches, clearRecentSearches } = useAppState()
  const trending = ipoSummaries.filter((ipo) => ipo.isOpen)

  return (
    <div>
      {recentSearches.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Recently searched</p>
            <button type="button" onClick={clearRecentSearches} className="text-xs text-ink-faint hover:text-ink">
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => onPickTerm(term)}
                className="rounded-pill bg-accent-soft px-3.5 py-1.5 text-sm text-primary transition-colors hover:bg-primary hover:text-white"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-3 text-sm font-semibold text-ink">Trending IPOs</p>
        <div className="flex flex-wrap gap-2">
          {trending.map((ipo) => (
            <button
              key={ipo.slug}
              type="button"
              onClick={() => onPickIpo(ipo.slug, ipo.name)}
              className={`rounded-pill px-3.5 py-1.5 text-sm transition-colors hover:opacity-80 ${
                SUGGESTION_TONE[getIpoLifecycleStatus(ipo)] ?? 'bg-surface-sunken text-ink-muted'
              }`}
            >
              {ipo.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
