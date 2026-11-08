import { useState, useRef, useLayoutEffect } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { UserProfile } from '../../types/auth'
import { Brand } from '../common/Brand'
import { FiMenu, FiX } from 'react-icons/fi'

type StudentLayoutProps = {
  profile: UserProfile
  active: 'dashboard' | 'reports' | 'mine' | 'settings'
  onNavigate: (path: string) => void
  children: ReactNode
}

const navItems = [
  { id: 'dashboard', label: 'Ringkasan', path: '/mahasiswa' },
  { id: 'reports', label: 'Semua Laporan', path: '/mahasiswa/laporan' },
  { id: 'mine', label: 'Laporan Saya', path: '/mahasiswa/laporan-saya' },
] as const

export function StudentLayout({ profile, active, onNavigate, children }: StudentLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null)
  const avatarLetter = (profile.full_name || 'M').slice(0, 1).toUpperCase()

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false)
    onNavigate(path)
  }

  // Hitung posisi horizontal (left & width) murni relatif terhadap nav container
  // sehingga kebal terhadap scroll halaman dan tidak ada glitch terbang vertikal menyilang
  useLayoutEffect(() => {
    const updatePill = () => {
      if (!navRef.current) return
      const activeBtn = navRef.current.querySelector<HTMLButtonElement>(`[data-tab="${active}"]`)
      if (activeBtn) {
        setPillStyle({
          left: activeBtn.offsetLeft,
          width: activeBtn.offsetWidth,
        })
      } else {
        setPillStyle(null)
      }
    }
    updatePill()
    window.addEventListener('resize', updatePill)
    return () => window.removeEventListener('resize', updatePill)
  }, [active])

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb] font-['Poppins','Montserrat','Outfit',system-ui,sans-serif] text-slate-800 antialiased flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-[#08315c] border-b border-white/10 shadow-md">
        <div className="mx-auto flex h-18 w-full max-w-[1280px] items-center justify-between px-4 sm:px-8 lg:px-12">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <Brand
              showSubtitle={false}
              onClick={() => handleNavClick('/mahasiswa')}
              className="text-white"
            />
          </div>

          {/* Center: Navigation Pills (Desktop) */}
          <nav
            ref={navRef}
            className="relative hidden lg:flex items-center gap-1.5 bg-[#062445]/60 p-1.5 rounded-full border border-white/10 backdrop-blur-sm"
            aria-label="Navigasi Utama Mahasiswa"
          >
            {/* Latar belakang pill putih bergeser mulus secara horizontal */}
            {pillStyle && (
              <motion.div
                className="absolute rounded-full bg-white shadow-md z-0 pointer-events-none"
                style={{ top: 6, bottom: 6 }}
                initial={false}
                animate={{
                  left: pillStyle.left,
                  width: pillStyle.width,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 32,
                }}
              />
            )}

            {navItems.map((item) => {
              const isActive = active === item.id
              return (
                <button
                  key={item.id}
                  data-tab={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.path)}
                  className={`relative z-10 min-h-[38px] rounded-full px-5 py-1.5 text-xs font-bold transition-colors duration-200 cursor-pointer select-none ${
                    isActive
                      ? 'text-[#08315c]'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Right: User Profile (Navigates to Settings) */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleNavClick('/mahasiswa/pengaturan')}
              title="Buka Pengaturan Profil & Akun"
              className={`flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-4 transition cursor-pointer border select-none ${
                active === 'settings'
                  ? 'bg-white/20 border-[#ffbb00]'
                  : 'bg-white/5 hover:bg-white/15 border-white/10'
              }`}
            >
              <div
                className="grid size-8 place-items-center rounded-full bg-[#ffbb00] text-xs font-bold text-[#08315c] shadow-sm select-none"
                aria-hidden="true"
              >
                {avatarLetter}
              </div>
              <span className="text-xs font-semibold text-white max-w-[170px] truncate hover:text-[#ffbb00] transition-colors">
                {profile.full_name}
              </span>
            </button>
          </div>

          {/* Mobile Menu Button with Animated Icon */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => handleNavClick('/mahasiswa/pengaturan')}
              aria-label="Buka Pengaturan Profil & Akun"
              className="grid size-8 place-items-center rounded-full bg-[#ffbb00] text-xs font-bold text-[#08315c] shadow-sm cursor-pointer"
            >
              {avatarLetter}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              className="grid size-10 place-items-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileMenuOpen ? 'close' : 'menu'}
                  initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.14 }}
                >
                  {mobileMenuOpen ? <FiX className="size-5" /> : <FiMenu className="size-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu: Container terpisah overflow-hidden agar penutupan mulus tanpa jeda/lompatan */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-nav-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.18, ease: 'easeInOut' },
              }}
              className="overflow-hidden border-t border-white/10 bg-[#062445] lg:hidden"
            >
              <div className="px-4 py-3 space-y-1.5 shadow-2xl">
                <button
                  type="button"
                  onClick={() => handleNavClick('/mahasiswa/pengaturan')}
                  className="flex min-h-[44px] w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold text-sky-200 border-b border-white/10 hover:bg-white/10 hover:text-white transition cursor-pointer"
                >
                  <span className="truncate">{profile.full_name}</span>
                  <span className="text-[11px] text-[#ffbb00] font-bold">Pengaturan Akun</span>
                </button>
                {navItems.map((item) => {
                  const isActive = active === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.path)}
                      className={`flex min-h-[44px] w-full items-center rounded-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer ${
                        isActive
                          ? 'bg-white text-[#08315c]'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main View Container */}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  )
}

export default StudentLayout
