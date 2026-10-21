import { useEffect, useState } from 'react'
import { AuthPage } from '../pages/auth/AuthPage'
import { LandingPage } from '../pages/public/LandingPage'
import type { AuthPageKind } from '../types/auth'

type Route = 'home' | 'auth' | 'officer'

function routeFromPath(path: string): Route {
  if (path === '/auth') return 'auth'
  if (path === '/petugas') return 'officer'
  return 'home'
}

export function AppRoutes() {
  const [route, setRoute] = useState<Route>(() => routeFromPath(window.location.pathname))

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setRoute(routeFromPath(path))
  }

  useEffect(() => {
    const syncRoute = () => setRoute(routeFromPath(window.location.pathname))
    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  if (route === 'home') return <LandingPage onNavigate={navigate} />

  const kind: AuthPageKind = route === 'officer' ? 'officer' : 'user'
  return <AuthPage kind={kind} onNavigate={navigate} />
}
