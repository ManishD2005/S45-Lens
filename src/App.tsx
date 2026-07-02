import { useEffect, type ReactNode } from 'react'
import { Navigate, Route, BrowserRouter, Routes, useLocation } from 'react-router-dom'
import { AppStateProvider, useAppState } from './lib/appState'
import { NavBar } from './components/NavBar'
import { BottomTabBar } from './components/BottomTabBar'
import { FirstRunExplainer } from './components/FirstRunExplainer'
import { Login } from './screens/Login'
import { Home } from './screens/Home'
import { SearchResults } from './screens/SearchResults'
import { IpoDetail } from './screens/IpoDetail'
import { Profile } from './screens/Profile'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function ProtectedShell({ children }: { children: ReactNode }) {
  const { loggedIn, introSeen } = useAppState()

  if (!loggedIn) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-surface pb-16 sm:pb-0">
      <NavBar />
      {children}
      <BottomTabBar />
      {!introSeen && <FirstRunExplainer />}
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedShell>
            <Home />
          </ProtectedShell>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedShell>
            <SearchResults />
          </ProtectedShell>
        }
      />
      <Route
        path="/ipo/:slug"
        element={
          <ProtectedShell>
            <IpoDetail />
          </ProtectedShell>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedShell>
            <Profile />
          </ProtectedShell>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppStateProvider>
        <AppRoutes />
      </AppStateProvider>
    </BrowserRouter>
  )
}

export default App
