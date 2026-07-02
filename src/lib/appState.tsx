import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { UserProfile } from '../types'

const LOGGED_IN_KEY = 's45lens.loggedIn'
const INTRO_SEEN_KEY = 's45lens.introSeen'
const SAVED_KEY = 's45lens.savedIpos'
const RECENT_SEARCH_KEY = 's45lens.recentSearches'
const PROFILE_KEY = 's45lens.profile'
const MAX_RECENT_SEARCHES = 5

function readBool(key: string): boolean {
  return localStorage.getItem(key) === '1'
}

function readList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

function readProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    return raw ? (JSON.parse(raw) as UserProfile) : null
  } catch {
    return null
  }
}

interface AppStateValue {
  loggedIn: boolean
  profile: UserProfile | null
  login: (profile?: UserProfile) => void
  logout: () => void
  forgetAccount: () => void
  introSeen: boolean
  dismissIntro: () => void
  savedSlugs: string[]
  isSaved: (slug: string) => boolean
  toggleSaved: (slug: string) => void
  recentSearches: string[]
  addRecentSearch: (term: string) => void
  clearRecentSearches: () => void
}

const AppStateContext = createContext<AppStateValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(() => readBool(LOGGED_IN_KEY))
  const [profile, setProfile] = useState<UserProfile | null>(() => readProfile())
  const [introSeen, setIntroSeen] = useState(() => readBool(INTRO_SEEN_KEY))
  const [savedSlugs, setSavedSlugs] = useState<string[]>(() => readList(SAVED_KEY))
  const [recentSearches, setRecentSearches] = useState<string[]>(() => readList(RECENT_SEARCH_KEY))

  useEffect(() => {
    localStorage.setItem(LOGGED_IN_KEY, loggedIn ? '1' : '0')
  }, [loggedIn])

  useEffect(() => {
    if (profile) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    else localStorage.removeItem(PROFILE_KEY)
  }, [profile])

  useEffect(() => {
    localStorage.setItem(INTRO_SEEN_KEY, introSeen ? '1' : '0')
  }, [introSeen])

  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(savedSlugs))
  }, [savedSlugs])

  useEffect(() => {
    localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(recentSearches))
  }, [recentSearches])

  const value: AppStateValue = {
    loggedIn,
    profile,
    login: (nextProfile) => {
      if (nextProfile) setProfile(nextProfile)
      setLoggedIn(true)
    },
    logout: () => setLoggedIn(false),
    forgetAccount: () => {
      setLoggedIn(false)
      setProfile(null)
    },
    introSeen,
    dismissIntro: () => setIntroSeen(true),
    savedSlugs,
    isSaved: (slug) => savedSlugs.includes(slug),
    toggleSaved: (slug) =>
      setSavedSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug])),
    recentSearches,
    addRecentSearch: (term) =>
      setRecentSearches((prev) => [term, ...prev.filter((t) => t.toLowerCase() !== term.toLowerCase())].slice(0, MAX_RECENT_SEARCHES)),
    clearRecentSearches: () => setRecentSearches([]),
  }

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}
