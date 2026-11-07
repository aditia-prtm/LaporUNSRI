import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BiMenu, BiX } from 'react-icons/bi'
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
        isScrolled || isOverContent
          ? 'bg-[#08315c]/85 backdrop-blur-md border-b border-white/15 shadow-md shadow-black/20'
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
            className={`rounded-2xl px-5 py-2 text-xs font-bold transition active:scale-[0.98] cursor-pointer shadow-sm ${
              isScrolled || isOverContent
                ? 'bg-[#ffbb00] hover:bg-[#f0b000] text-slate-950 font-bold shadow-md shadow-black/20'
                : 'border border-white/35 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md'
            }`}
            onClick={() => onNavigate('/auth')}
          >
            Masuk
          </button>
          <button
            type="button"
            className="flex md:hidden size-9 items-center justify-center rounded-lg text-white hover:bg-white/15 transition cursor-pointer"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <BiX size={26} /> : <BiMenu size={26} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu with Smooth Animation */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="landing-navigation-menu"
              key="landing-mobile-menu"
              initial={{ opacity: 0, scale: 0.95, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden absolute right-6 top-full mt-2 z-50 min-w-[210px] rounded-2xl border border-white/20 bg-[#08315c]/95 backdrop-blur-xl p-2 shadow-2xl"
              aria-label="Navigasi mobile"
            >
              {menuItems.map((item) => (
                <button
                  key={item.action}
                  className="block w-full rounded-lg px-3.5 py-2 text-left text-xs font-semibold text-white/90 hover:bg-white/15 hover:text-white transition cursor-pointer"
                  type="button"
                  onClick={() => handleMenuAction(item.action)}
                >
                  {item.label}
                </button>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
