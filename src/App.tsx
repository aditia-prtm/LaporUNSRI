import { useEffect } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { ReactLenis, useLenis } from 'lenis/react'
import { AuthProvider } from './context/AuthContext'
import { AppRoutes } from './routes/AppRoutes'

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
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ReactLenis>
  )
}

