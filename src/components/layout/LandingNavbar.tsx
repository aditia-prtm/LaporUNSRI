import { useState, useEffect } from 'react'
import { BiMenu, BiX } from 'react-icons/bi'

type LandingNavbarProps = {
  onNavigate: (path: string) => void
  onScrollDown?: () => void
  onScrollToAbout?: () => void
  onScrollToSteps?: () => void
  onScrollToFaq?: () => void
  onScrollToTop?: () => void
}

const menuItems = [
  { label: 'Beranda', action: 'home' },
  { label: 'Tentang', action: 'about' },
  { label: 'Alur Pelaporan', action: 'steps' },
  { label: 'FAQ', action: 'faq' },
  { label: 'Layanan Aspirasi', action: 'auth' },
  { label: 'Portal Petugas', action: 'officer' },
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
    if (action === 'home') {
      if (onScrollToTop) {
        onScrollToTop()
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }
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
      return
    }
    onNavigate(action === 'auth' ? '/auth' : '/petugas')
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] w-full bg-transparent transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-md' : ''
      } ${
        isOverContent
          ? 'border-b border-slate-200/80'
          : isScrolled
            ? 'border-b border-white/10'
            : 'border-b border-transparent'
      }`}
    >
      <div className="relative mx-auto flex min-h-[70px] w-full max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:px-14 py-2.5">
        {/* Brand Logo (Otomatis kontras: putih saat di hero, gelap tajam saat di konten putih) */}
        <a
          className="flex flex-col items-start no-underline transition duration-150 hover:-translate-y-px cursor-pointer"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            if (onScrollToTop) {
              onScrollToTop()
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
          aria-label="LaporUNSRI Beranda"
        >
          <span
            className={`flex items-baseline gap-0.5 text-2xl font-normal leading-none tracking-tight transition-colors ${
              isOverContent ? 'text-slate-950 font-black' : 'text-white'
            }`}
          >
            <span className="font-normal opacity-90">lapor</span>
            <strong className="font-black tracking-tight">UNSRI</strong>
            <i
              className="ml-0.5 size-1.5 -translate-y-1 rounded-full bg-[#ffbb00] shadow-[0_0_8px_#ffbb00]"
              aria-hidden="true"
            />
          </span>
          <span
            className={`mt-1 text-[8px] font-bold uppercase tracking-[0.24em] transition-colors ${
              isOverContent ? 'text-slate-600' : 'text-white/80'
            }`}
          >
            Layanan Aspirasi Kampus
          </span>
        </a>

        {/* Desktop Navigation Links (Otomatis kontras tajam sesuai background) */}
        <nav
          className="hidden md:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2"
          aria-label="Navigasi landing page"
        >
          <button
            type="button"
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              isOverContent
                ? 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/60'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => handleMenuAction('about')}
          >
            Tentang
          </button>
          <button
            type="button"
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              isOverContent
                ? 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/60'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => handleMenuAction('steps')}
          >
            Alur Pelaporan
          </button>
          <button
            type="button"
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              isOverContent
                ? 'text-slate-800 hover:text-slate-950 hover:bg-slate-200/60'
                : 'text-white/90 hover:text-white hover:bg-white/10'
            }`}
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
              isOverContent
                ? 'bg-[#0c4278] hover:bg-[#08315c] text-white shadow-md'
                : 'border border-white/35 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md'
            }`}
            onClick={() => onNavigate('/auth')}
          >
            Masuk
          </button>
          <button
            type="button"
            className={`flex md:hidden size-9 items-center justify-center rounded-lg transition cursor-pointer ${
              isOverContent ? 'text-slate-950 hover:bg-slate-200/60' : 'text-white hover:bg-white/10'
            }`}
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <BiX size={26} /> : <BiMenu size={26} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <nav
            id="landing-navigation-menu"
            className="md:hidden absolute right-6 top-full mt-2 z-50 min-w-[210px] rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl"
            aria-label="Navigasi mobile"
          >
            {menuItems.map((item) => (
              <button
                key={item.action}
                className="block w-full rounded-lg px-3.5 py-2 text-left text-xs font-semibold text-slate-800 hover:bg-slate-100 hover:text-slate-950 transition cursor-pointer"
                type="button"
                onClick={() => handleMenuAction(item.action)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
