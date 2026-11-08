import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { Brand } from '../common/Brand'

type LandingNavbarProps = {
  onNavigate: (path: string) => void
  onScrollDown?: () => void
  onScrollToAbout?: () => void
  onScrollToSteps?: () => void
  onScrollToFaq?: () => void
  onScrollToTop?: () => void
}

const menuItems = [
  { label: 'Tentang', action: 'about' },
  { label: 'Alur Laporan', action: 'steps' },
  { label: 'FAQ', action: 'faq' },
] as const

export function LandingNavbar({
  onNavigate,
  onScrollDown,
  onScrollToAbout,
  onScrollToSteps,
  onScrollToFaq,
  onScrollToTop,
}: LandingNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOverContent, setIsOverContent] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 20)

      const contentEl = document.getElementById('content-container')
      if (contentEl) {
        const rect = contentEl.getBoundingClientRect()
        // Saat ujung atas content-container mencapai navbar (tinggi ~70px)
        setIsOverContent(rect.top <= 70)
      } else {
        setIsOverContent(scrollY > (typeof window !== 'undefined' ? window.innerHeight - 80 : 600))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMenuAction = (action: (typeof menuItems)[number]['action']) => {
    setMenuOpen(false)
    if (action === 'about') {
      if (onScrollToAbout) {
        onScrollToAbout()
      } else {
        document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }
    if (action === 'steps') {
      if (onScrollToSteps) {
        onScrollToSteps()
      } else if (onScrollDown) {
        onScrollDown()
      } else {
        document.getElementById('steps-section')?.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }
    if (action === 'faq') {
      if (onScrollToFaq) {
        onScrollToFaq()
      } else {
        document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] w-full transition-all duration-300 ${
        isScrolled || isOverContent || menuOpen
          ? 'bg-[#08315c]/90 backdrop-blur-md border-b border-white/15 shadow-md shadow-black/20'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="relative mx-auto flex min-h-[70px] w-full max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:px-14 py-2.5">
        {/* Brand Logo */}
        <Brand
          onClick={() => {
            if (onScrollToTop) {
              onScrollToTop()
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
        />

        {/* Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2"
          aria-label="Navigasi landing page"
        >
          <button
            type="button"
            className="rounded-lg px-3.5 py-1.5 text-xs font-bold text-white/90 hover:text-white hover:bg-white/15 transition cursor-pointer"
            onClick={() => handleMenuAction('about')}
          >
            Tentang
          </button>
          <button
            type="button"
            className="rounded-lg px-3.5 py-1.5 text-xs font-bold text-white/90 hover:text-white hover:bg-white/15 transition cursor-pointer"
            onClick={() => handleMenuAction('steps')}
          >
            Alur Laporan
          </button>
          <button
            type="button"
            className="rounded-lg px-3.5 py-1.5 text-xs font-bold text-white/90 hover:text-white hover:bg-white/15 transition cursor-pointer"
            onClick={() => handleMenuAction('faq')}
          >
            FAQ
          </button>
        </nav>

        {/* Right CTA and Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className={`hidden sm:inline-flex rounded-2xl px-5 py-2 text-xs font-bold transition active:scale-[0.98] cursor-pointer shadow-sm ${
              isScrolled || isOverContent
                ? 'bg-[#ffbb00] hover:bg-[#f0b000] text-slate-950 font-bold shadow-md shadow-black/20'
                : 'border border-white/35 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md'
            }`}
            onClick={() => onNavigate('/auth')}
          >
            Masuk
          </button>

          {/* Mobile Menu Button with Animated Rotating Icon (matching dashboard) */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="grid md:hidden size-10 place-items-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={menuOpen ? 'close' : 'menu'}
                initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.14 }}
              >
                {menuOpen ? <FiX className="size-5" /> : <FiMenu className="size-5" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu: Accordion full-width overflow-hidden yang sama persis seperti di dashboard */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="landing-mobile-nav-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.18, ease: 'easeInOut' },
            }}
            className="overflow-hidden border-t border-white/10 bg-[#062445]/95 backdrop-blur-xl md:hidden"
          >
            <div className="px-6 py-3 space-y-1.5 shadow-2xl">
              {menuItems.map((item) => (
                <button
                  key={item.action}
                  type="button"
                  onClick={() => handleMenuAction(item.action)}
                  className="flex min-h-[44px] w-full items-center rounded-xl px-3.5 py-2.5 text-xs font-bold text-white/90 hover:bg-white/10 hover:text-white transition cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  onNavigate('/auth')
                }}
                className="flex min-h-[44px] w-full items-center justify-center rounded-xl bg-[#ffbb00] hover:bg-[#f0b000] px-4 py-2.5 text-xs font-bold text-slate-950 transition cursor-pointer shadow-md mt-2"
              >
                Masuk ke LaporUNSRI
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
