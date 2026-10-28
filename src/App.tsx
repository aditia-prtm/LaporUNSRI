import { useEffect, useState } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { ReactLenis, useLenis } from 'lenis/react'
import { AuthProvider } from './context/AuthContext'
import { AppRoutes } from './routes/AppRoutes'
import { LoadingScreen } from './components/common/LoadingScreen'

function ScrollToTop() {
  const { pathname } = useLocation()
  const lenis = useLenis()

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, lenis])

  return null
}

export default function App() {
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    // Saat web dibuka, tampilkan loading screen sejenak lalu lakukan transisi fade-out mulus
    const timer = window.setTimeout(() => {
      setInitialLoading(false)
    }, 600)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      <LoadingScreen isLoading={initialLoading} fadeDuration={0.6} />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ReactLenis>
  )
}

